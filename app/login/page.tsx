import LoginForm from '@/components/auth/LoginForm'
import { getSession } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
    const session = await getSession()
    if (session?.user) redirect('/jobapplications')

    return <LoginForm />
}
