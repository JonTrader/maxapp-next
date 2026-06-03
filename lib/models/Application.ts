import mongoose, { Schema, Document } from 'mongoose'

export interface IApplication extends Document {
    userId: mongoose.Types.ObjectId;
    company: string;
    role: string;
    jobDescription?: string;
    jobUrl?: string;
    status: 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    location?: string;
    notes?: string;
    appliedDate?: Date;
    resumeSnapshot?: string;
    resumeFilename?: string;
    resumeText?: string;
    aiAnalysis: Record<string, unknown>;
    createdAt?: Date;
    updatedAt?: Date;
}

const ApplicationSchema = new Schema<IApplication>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    company: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String
    },
    jobUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'],
        default: 'Saved'
    },
    location:
    {
        type: String

    },
    notes: {
        type: String
    },
    appliedDate: {
        type: Date
    },
    resumeSnapshot: {
        type: String
    },
    resumeFilename: {
        type: String
    },
    resumeText: {
        type: String
    },
    aiAnalysis: {
        type: Object,
        default: {}
    },
}, { timestamps: true });

ApplicationSchema.index({ userId: 1, status: 1, createdAt: -1 });

export default mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);