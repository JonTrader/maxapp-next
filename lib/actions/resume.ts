'use server'

import mongoose from 'mongoose'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/auth'
import connectDB from '@/lib/db'
import Resume from '@/lib/models/Resume'
import { extractJson, extractPdfText } from '@/lib/utils'
import { resumeAnalysis } from '@/lib/gemini'
import { uploadResumePdfToCloudinary, deleteResumeFromCloudinary } from '@/lib/cloudinary'

export type ActionResult = { ok: true } | { ok: false; message: string }

export type CreateResumeState = {
    ok: boolean
    message: string
    resumeId: string
}

export async function deleteResume(
    resumeId: string,
): Promise<ActionResult> {
    try {
        const session = await getSession()
        if (!session) return { ok: false, message: 'Unauthorized' }

        if (!mongoose.isValidObjectId(resumeId)) {
            return { ok: false, message: 'Invalid resume id' }
        }

        await connectDB()

        const resume = await Resume.findOne({
            _id: new mongoose.Types.ObjectId(resumeId),
            userId: new mongoose.Types.ObjectId(String(session.user.id)),
        })

        if (!resume) {
            return { ok: false, message: 'Resume not found' }
        }

        if (resume.cloudinaryPublicId) {
            deleteResumeFromCloudinary(resume.cloudinaryPublicId).catch((err) =>
                console.error('Failed to delete resume from Cloudinary', err)
            )
        }

        await Resume.deleteOne({
            _id: new mongoose.Types.ObjectId(resumeId),
            userId: new mongoose.Types.ObjectId(String(session.user.id)),
        })

        revalidatePath(`/resumes/${resumeId}`)
        revalidatePath('/resumes')

        return { ok: true }
    } catch (err) {
        console.error(err)
        return { ok: false, message: 'Server error' }
    }
}

export async function createResume(
    prevState: CreateResumeState,
    formData: FormData,
): Promise<CreateResumeState> {
    try {
        const session = await getSession()
        if (!session) return { ok: false, message: 'Unauthorized', resumeId: '' }

        const targetRole = (formData.get('targetRole') as string)?.trim()

        if (!targetRole) {
            return { ok: false, message: 'Target role is required', resumeId: '' }
        }

        const resumeFile = formData.get('resume') as File | null
        if (!resumeFile || resumeFile.size === 0) {
            return { ok: false, message: 'Resume (PDF) is required', resumeId: '' }
        }

        const isPdf = resumeFile.type === 'application/pdf' || resumeFile.name.toLowerCase().endsWith('.pdf')
        if (!isPdf) {
            return { ok: false, message: 'Only PDF files are accepted', resumeId: '' }
        }

        await connectDB()

        const bytes = await resumeFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const resumeSnapshot = buffer.toString('base64')
        const resumeText = await extractPdfText(buffer)

        const cloudinaryResult = await uploadResumePdfToCloudinary(buffer, resumeFile.name)

        const aiResponse = await resumeAnalysis(targetRole, resumeText)

        const cleanedResponse = extractJson(aiResponse)

        let parsed: Record<string, unknown>
        try {
            parsed = JSON.parse(cleanedResponse)
        } catch (error) {
            console.error('Failed to parse AI analysis response', error, aiResponse)
            return { ok: false, message: 'Failed to parse AI analysis response', resumeId: '' }
        }

        const resume = await Resume.create({
            userId: new mongoose.Types.ObjectId(String(session.user.id)),
            targetRole,
            resumeText,
            resumeSnapshot,
            aiAnalysis: parsed,
            cloudinaryPublicId: cloudinaryResult.public_id,
            cloudinaryUrl: cloudinaryResult.secure_url,
            originalFilename: resumeFile.name,
            mimeType: resumeFile.type || 'application/pdf',
            fileSize: resumeFile.size,
        })

        revalidatePath('/resumes')

        return { ok: true, message: '', resumeId: String(resume._id) }
    } catch (err) {
        console.error(err)
        return { ok: false, message: 'Server error', resumeId: '' }
    }
}