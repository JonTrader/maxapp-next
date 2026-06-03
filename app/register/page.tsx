import RegisterForm from '@/components/auth/RegisterForm'
import { getSession } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
    const session = await getSession()
    if (session?.user) redirect('/jobapplications')

    return <RegisterForm />
}
