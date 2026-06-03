import mongoose, { Schema, Document } from 'mongoose'

export interface IResume extends Document {
    userId: mongoose.Types.ObjectId;
    targetRole: string;
    resumeText: string;
    resumeSnapshot?: string;
    aiAnalysis: Record<string, unknown>;
    cloudinaryPublicId: string;
    cloudinaryUrl: string;
    originalFilename: string;
    mimeType: string;
    fileSize: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const ResumeSchema = new Schema<IResume>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetRole: {
        type: String,
        required: true,
        trim: true
    },
    resumeText: {
        type: String,
        required: true
    },
    resumeSnapshot: {
        type: String
    },
    aiAnalysis: {
        type: Object,
        default: {}
    },
    cloudinaryPublicId: {
        type: String,
        required: true
    },
    cloudinaryUrl: {
        type: String,
        required: true
    },
    originalFilename: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    }
}, { timestamps: true })

ResumeSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);