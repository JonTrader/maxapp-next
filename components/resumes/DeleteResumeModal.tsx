"use client";

import { Trash2 } from 'lucide-react';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteResume } from '@/lib/actions/resume'

type Props = {
    resumeId: string
}

function DeleteResumeModal({ resumeId }: Props) {
    const [deleting, setDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (deleting) return

        setDeleting(true)

        try {
            const result = await deleteResume(resumeId)
            if (result.ok) {
                toast.success('Resume deleted')
                router.push('/resumes')
            } else {
                toast.error(result.message)
            }
        } catch (err) {
            console.error(err)
            toast.error('Failed to delete resume')
        } finally {
            setDeleting(false)
            setShowDeleteModal(false)
        }
    }

    const openDeleteModal = () => {
        if (deleting) return
        setShowDeleteModal(true)
    }

    const closeDeleteModal = () => {
        if (deleting) return
        setShowDeleteModal(false)
    }

    return (
        <>
            <button
                type="button"
                className="btn btn-error btn-sm gap-2 hover:border-white"
                onClick={openDeleteModal}
                disabled={deleting}
            >
                <Trash2 className="h-4 w-4" />
                {deleting ? 'Deleting...' : 'Delete Resume'}
            </button>

            {showDeleteModal && <div className="modal modal-open">
                <div className="modal-box max-w-md">
                    <h2 className="text-xl font-semibold">Delete resume?</h2>
                    <p className="mt-3 text-sm text-base-content/70">
                        This will permanently remove this resume and its analysis.
                    </p>
                    <p className="mt-2 text-sm text-base-content/70">
                        This action cannot be undone.
                    </p>
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={closeDeleteModal}
                            disabled={deleting}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-error gap-2"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            <Trash2 className="h-4 w-4" />
                            {deleting ? 'Deleting...' : 'Delete Resume'}
                        </button>
                    </div>
                </div>
                <button
                    type="button"
                    className="modal-backdrop"
                    onClick={closeDeleteModal}
                    aria-label="Close delete confirmation"
                >
                    Close
                </button>
            </div>}
        </>
    )
}

export default DeleteResumeModal
