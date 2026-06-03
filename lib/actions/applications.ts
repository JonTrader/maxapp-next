'use server'

import mongoose from 'mongoose'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/auth'
import connectDB from '@/lib/db'
import Application from '@/lib/models/Application'
import { STATUS_OPTIONS, type Status } from '@/lib/data'
import { jobApplicationAnalysis } from '@/lib/gemini'
import { extractJson, extractPdfText } from '@/lib/utils'

export type ActionResult = { ok: true } | { ok: false; message: string }

export type CreateApplicationState = {
    ok: boolean
    message: string
    applicationId: string
}

export async function updateApplicationStatus(
    applicationId: string,
    status: Status,
): Promise<ActionResult> {
    try {
        const session = await getSession()
        if (!session) return { ok: false, message: 'Unauthorized' }

        if (!mongoose.isValidObjectId(applicationId)) {
            return { ok: false, message: 'Invalid application id' }
        }

        if (!STATUS_OPTIONS.includes(status)) {
            return { ok: false, message: 'Invalid status' }
        }

        await connectDB()

        const result = await Application.updateOne(
            {
                _id: new mongoose.Types.ObjectId(applicationId),
                userId: new mongoose.Types.ObjectId(String(session.user.id)),
            },
            { status },
        )

        if (result.matchedCount === 0) {
            return { ok: false, message: 'Application not found' }
        }

        revalidatePath(`/jobapplications/${applicationId}`)
        revalidatePath('/jobapplications')

        return { ok: true }
    } catch (err) {
        console.error("Failed to update application status:", err)
        return { ok: false, message: 'Server error' }
    }
}

export async function deleteApplication(
    applicationId: string,
): Promise<ActionResult> {
    try {
        const session = await getSession()
        if (!session) return { ok: false, message: 'Unauthorized' }

        if (!mongoose.isValidObjectId(applicationId)) {
            return { ok: false, message: 'Invalid application id' }
        }

        await connectDB()

        const result = await Application.deleteOne({
            _id: new mongoose.Types.ObjectId(applicationId),
            userId: new mongoose.Types.ObjectId(String(session.user.id)),
        })

        if (result.deletedCount === 0) {
            return { ok: false, message: 'Application not found' }
        }

        revalidatePath(`/jobapplications/${applicationId}`)
        revalidatePath('/jobapplications')

        return { ok: true }
    } catch (err) {
        console.error("Failed to delete application:", err)
        return { ok: false, message: 'Server error' }
    }
}

export async function createApplication(
    prevState: CreateApplicationState,
    formData: FormData,
): Promise<CreateApplicationState> {
    try {
        const session = await getSession()
        if (!session) return { ok: false, message: 'Unauthorized', applicationId: '' }

        const company = (formData.get('company') as string)?.trim()
        const role = (formData.get('role') as string)?.trim()
        const jobDescription = (formData.get('jobDescription') as string)?.trim()

        if (!company || !role || !jobDescription) {
            return { ok: false, message: 'Company, role, and job description are required', applicationId: '' }
        }

        const status = (formData.get('status') as string) || 'Applied'

        const appliedDateRaw = formData.get('appliedDate') as string
        let appliedDate: Date | undefined
        if (appliedDateRaw) {
            const [year, month, day] = appliedDateRaw.split('-').map(Number)
            appliedDate = new Date(year, month - 1, day)
        }

        const location = (formData.get('location') as string)?.trim() || undefined
        const notes = (formData.get('notes') as string)?.trim() || undefined

        const jobUrlRaw = (formData.get('jobUrl') as string)?.trim() || ''
        const jobUrl = jobUrlRaw ? jobUrlRaw.replace(/^(https?:\/\/)/, '') : undefined

        const resumeFile = formData.get('resume') as File | null
        if (!resumeFile || resumeFile.size === 0) {
            return { ok: false, message: 'Resume (PDF) is required', applicationId: '' }
        }

        const isPdf = resumeFile.type === 'application/pdf' || resumeFile.name.toLowerCase().endsWith('.pdf')
        if (!isPdf) {
            return { ok: false, message: 'Only PDF files are accepted', applicationId: '' }
        }

        await connectDB()

        const bytes = await resumeFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const resumeSnapshot = buffer.toString('base64')
        const resumeText = await extractPdfText(buffer)
        if (!resumeText) {
            return { ok: false, message: 'Could not read text from your PDF. The file may be corrupted or not a valid PDF.', applicationId: '' }
        }

        const application = await Application.create({
            userId: new mongoose.Types.ObjectId(String(session.user.id)),
            company,
            role,
            status,
            appliedDate,
            location,
            notes,
            jobDescription,
            jobUrl,
            resumeSnapshot,
            resumeFilename: resumeFile.name,
            resumeText,
        })

        revalidatePath('/jobapplications')

        return { ok: true, message: '', applicationId: String(application._id) }
    } catch (err) {
        console.error("Failed to create application:", err)
        return { ok: false, message: 'Server error', applicationId: '' }
    }
}

export async function runApplicationAnalysis(applicationId: string): Promise<ActionResult> {
    try {
        const session = await getSession()
        if (!session) return { ok: false, message: 'Unauthorized' }

        if (!mongoose.isValidObjectId(applicationId)) {
            return { ok: false, message: 'Invalid application id' }
        }

        await connectDB()

        const application = await Application.findOne({
            _id: new mongoose.Types.ObjectId(applicationId),
            userId: new mongoose.Types.ObjectId(String(session.user.id)),
        })

        if (!application) {
            return { ok: false, message: 'Application not found' }
        }

        const existingAnalysis = application.aiAnalysis || {}
        if (existingAnalysis && Object.keys(existingAnalysis).length > 0) {
            return { ok: false, message: 'Analysis already completed for this application' }
        }

        if (!application.jobDescription) {
            return { ok: false, message: 'Job description is required for analysis' }
        }

        const resumeText = application.resumeText
        if (!resumeText) {
            return { ok: false, message: 'Resume text is missing; cannot run analysis' }
        }

        const aiResponse = await jobApplicationAnalysis(application.jobDescription, application.role, resumeText)

        const cleanedResponse = extractJson(aiResponse)

        let parsed: Record<string, unknown>
        try {
            parsed = JSON.parse(cleanedResponse)
        } catch (error) {
            console.error('Failed to parse AI analysis response', error, aiResponse)
            return { ok: false, message: 'Failed to parse AI analysis response' }
        }

        await Application.updateOne(
            {
                _id: new mongoose.Types.ObjectId(applicationId),
                userId: new mongoose.Types.ObjectId(String(session.user.id)),
            },
            { $set: { aiAnalysis: parsed } },
        )

        revalidatePath(`/jobapplications/${applicationId}`)
        revalidatePath('/jobapplications')

        return { ok: true }
    } catch (err) {
        console.error("Failed to run application analysis:", err)
        return { ok: false, message: 'Server error' }
    }
}