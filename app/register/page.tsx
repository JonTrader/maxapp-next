"use client";

import { signUp } from '@/lib/auth/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const handleSubmit = async (event: React.SubmitEvent) => {
        event.preventDefault()
        setLoading(true)
        try {
            const response = await signUp.email({
                name,
                email,
                password
            })
            if (response.error) {
                toast.error(response.error.message ?? "Failed to register")
            } else {
                toast.success('Account created!')
                router.replace("/jobapplications")
            }
        } catch (err) {
            console.error(err)
            toast.error('Could not create account. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-100 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-b-gray-200 bg-base-200 p-8 shadow-sm">
                <Link href="/" className="block text-center text-3xl font-semibold hover:opacity-80 transition-opacity">MaxApp</Link>
                <p className="mt-2 text-center text-sm text-base-content/70">Create Your Account</p>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="form-control items-center">
                        <label className="label justify-center">
                            <span className="label-text text-center">Full Name</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered w-full max-w-sm mx-auto"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="form-control items-center">
                        <label className="label justify-center">
                            <span className="label-text text-center">Email</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input input-bordered w-full max-w-sm mx-auto"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-control items-center">
                        <label className="label justify-center">
                            <span className="label-text text-center">Password</span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input input-bordered w-full max-w-sm mx-auto"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-base-content/70">
                    Already have an account?{' '}
                    <Link className="link link-primary" href="/login">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
