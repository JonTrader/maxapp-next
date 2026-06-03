"use client";

import { LogOut } from 'lucide-react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth/auth-client';
import Image from 'next/image';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import clsx from 'clsx'

export default function Header() {
    const router = useRouter()
    const pathname = usePathname()

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`)

    const handleLogout = async () => {
        const response = await signOut()
        // console.log(response)
        if (response?.data?.success) {
            router.replace('/login')
            toast.success('Successfully signed out')
        } else {
            toast.error(`Error signing out: ${response?.error}`)
        }
    }

    return (
        <header className="w-full border-b border-base-200 bg-base-100">
            <div className="mx-auto flex container items-center justify-between px-4 py-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                >
                    <span><Image className='h-10' src="/note.svg" alt="Clipboard" width={40} height={40} /></span>
                    <span>MaxApp</span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/jobapplications"
                        aria-current={isActive('/jobapplications') ? 'page' : undefined}
                        className={clsx(
                            "text-sm font-medium text-green-300 hover:text-base-content transition-colors",
                            isActive('/jobapplications') && "font-bold underline underline-offset-4",
                        )}
                    >
                        Job Applications
                    </Link>
                    <Link
                        href="/resumes"
                        aria-current={isActive('/resumes') ? 'page' : undefined}
                        className={clsx(
                            "text-sm font-medium text-blue-400 hover:text-base-content transition-colors",
                            isActive('/resumes') && "font-bold underline underline-offset-4",
                        )}
                    >
                        Resumes
                    </Link>
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm gap-2 hover:border-white"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>

                {/* Mobile dropdown */}
                <div className="dropdown dropdown-end md:hidden">
                    <label tabIndex={0} className="btn btn-ghost btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                        <li>
                            <Link
                                href="/jobapplications"
                                aria-current={isActive('/jobapplications') ? 'page' : undefined}
                                className={clsx(
                                    "text-green-300",
                                    isActive('/jobapplications') && "font-bold",
                                )}
                            >
                                Job Applications
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/resumes"
                                aria-current={isActive('/resumes') ? 'page' : undefined}
                                className={clsx(
                                    "text-blue-400",
                                    isActive('/resumes') && "font-bold",
                                )}
                            >
                                Resumes
                            </Link>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}