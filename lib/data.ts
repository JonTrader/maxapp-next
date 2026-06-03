import mongoose from "mongoose"
import Application, { IApplication } from "@/lib/models/Application"
import Resume, { IResume } from "@/lib/models/Resume"
import connectDB from './db'

export { STATUS_OPTIONS, type Status, type StatusKey } from '@/lib/constants'
import type { StatusKey, Status } from '@/lib/constants'
import { STATUS_OPTIONS } from '@/lib/constants'

export type SerializedApplication = Omit<
    IApplication,
    '_id' | 'userId' | 'appliedDate' | 'createdAt' | 'updatedAt'
> & {
    _id: string
    userId: string
    appliedDate?: string
    createdAt?: string
    updatedAt?: string
}

export type ApplicationBucket = {
    total: number
    items: SerializedApplication[]
}

export type LatestApplicationsByStatus = Record<StatusKey, ApplicationBucket>

export type SerializedResume = Omit<
    IResume,
    '_id' | 'userId' | 'createdAt' | 'updatedAt'
> & {
    _id: string
    userId: string
    createdAt?: string
    updatedAt?: string
}

export type PaginatedResumes = {
    items: SerializedResume[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

type RawApplication = Partial<IApplication> & { _id?: unknown; userId?: unknown }
type RawResume = Partial<IResume> & { _id?: unknown; userId?: unknown; createdAt?: Date; updatedAt?: Date }

function getErrorMessage(e: unknown): string {
    if (e instanceof Error) return e.message
    if (typeof e === 'string') return e
    try { return JSON.stringify(e) } catch { return String(e) }
}

function isValidObjectId(id: string): boolean {
    return mongoose.isValidObjectId(id)
}

function serialize(doc: RawApplication): SerializedApplication {
    const { _id, userId, appliedDate, createdAt, updatedAt, ...rest } = doc
    return {
        ...(rest as Omit<SerializedApplication, '_id' | 'userId' | 'appliedDate' | 'createdAt' | 'updatedAt'>),
        _id: String(_id),
        userId: String(userId),
        appliedDate: appliedDate ? new Date(appliedDate as Date).toISOString() : undefined,
        createdAt: createdAt ? new Date(createdAt as Date).toISOString() : undefined,
        updatedAt: updatedAt ? new Date(updatedAt as Date).toISOString() : undefined,
    }
}

function serializeResume(doc: RawResume): SerializedResume {
    const { _id, userId, createdAt, updatedAt, ...rest } = doc
    return {
        ...(rest as Omit<SerializedResume, '_id' | 'userId' | 'createdAt' | 'updatedAt'>),
        _id: String(_id),
        userId: String(userId),
        createdAt: createdAt ? new Date(createdAt as Date).toISOString() : undefined,
        updatedAt: updatedAt ? new Date(updatedAt as Date).toISOString() : undefined,
    }
}

type FacetResult = Record<StatusKey, RawApplication[]> &
    Record<`${StatusKey}Count`, { total: number }[]>

export async function fetchLatestApplicationsByStatus(
    userId: string
): Promise<LatestApplicationsByStatus | null> {
    if (!userId) return null
    await connectDB()

    try {
        // Return up to 5 items per status, plus the full total count for each status.
        const facet = Object.fromEntries(
            STATUS_OPTIONS.flatMap((status) => {
                const key = status.toLowerCase() as StatusKey
                return [
                    [key, [{ $match: { status } }, { $sort: { createdAt: -1 } }, { $limit: 5 }]],
                    [`${key}Count`, [{ $match: { status } }, { $count: 'total' }]],
                ]
            })
        )

        const [result] = await Application.aggregate<FacetResult>([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $facet: facet },
        ])

        if (!result) return null

        return STATUS_OPTIONS.reduce((acc, status) => {
            const key = status.toLowerCase() as StatusKey
            acc[key] = {
                total: result[`${key}Count`][0]?.total ?? 0,
                items: result[key].map(serialize),
            }
            return acc
        }, {} as LatestApplicationsByStatus)
    } catch (error) {
        console.error(getErrorMessage(error) || 'Internal Server error fetching latest applications by status')
        return null
    }
}

export const getApplication = async (
    applicationId: string,
    userId: string
): Promise<SerializedApplication | null> => {
    try {
        if (!isValidObjectId(applicationId) || !isValidObjectId(userId)) {
            return null
        }
        await connectDB()
        const doc = await Application.findOne({
            _id: new mongoose.Types.ObjectId(applicationId),
            userId: new mongoose.Types.ObjectId(userId)
        }).lean<RawApplication>()

        if (!doc) {
            return null
        }

        return serialize(doc)
    } catch (err) {
        console.error(getErrorMessage(err))
        return null
    }
}

export const getResume = async (resumeId: string, userId: string): Promise<SerializedResume | null> => {
    try {
        if (!isValidObjectId(resumeId) || !isValidObjectId(userId)) {
            return null
        }
        await connectDB()
        const doc = await Resume.findOne({
            _id: new mongoose.Types.ObjectId(resumeId),
            userId: new mongoose.Types.ObjectId(userId)
        }).lean<RawResume>()

        if (!doc) {
            return null
        }

        return serializeResume(doc)
    } catch (err) {
        console.error(getErrorMessage(err))
        return null
    }
}

export async function fetchTodayAppliedCount(userId: string): Promise<number> {
    if (!userId) return 0
    await connectDB()

    try {
        const now = new Date()
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

        return await Application.countDocuments({
            userId: new mongoose.Types.ObjectId(userId),
            status: 'Applied',
            appliedDate: { $gte: todayStart, $lt: todayEnd },
        })
    } catch (error) {
        console.error(getErrorMessage(error) || 'Error fetching today applied count')
        return 0
    }
}

export type PaginatedApplications = {
    items: SerializedApplication[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

export async function fetchApplicationsByStatus(
    userId: string,
    status: Status,
    page: number = 1,
    limit: number = 20
): Promise<PaginatedApplications | null> {
    if (!userId) return null
    await connectDB()

    try {
        const skip = (page - 1) * limit
        const query = { userId: new mongoose.Types.ObjectId(userId), status }

        const [items, total] = await Promise.all([
            Application.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean<IApplication[]>(),
            Application.countDocuments(query)
        ])

        const totalPages = Math.ceil(total / limit)

        return {
            items: items.map(serialize),
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }
    } catch (error) {
        console.error(getErrorMessage(error) || 'Internal Server error fetching applications by status')
        return null
    }
}

export async function fetchResumes(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResumes | null> {
  if (!userId) return null
  await connectDB()

  try {
    const skip = (page - 1) * limit
    const query = { userId: new mongoose.Types.ObjectId(userId) }

    const [items, total] = await Promise.all([
      Resume.find(query)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IResume[]>(),
      Resume.countDocuments(query),
    ])

    const totalPages = Math.max(1, Math.ceil(total / limit))

    return {
      items: items.map(serializeResume),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  } catch (error) {
    console.error(getErrorMessage(error) || 'Internal Server error fetching resumes')
    return null
  }
}