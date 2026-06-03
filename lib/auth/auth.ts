import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const client = new MongoClient(process.env.MONGO_URI!)
const db = client.db()

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client
    }),
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 3600 * 60,
        }
    },
    emailAndPassword: {
        enabled: true
    },
});

export async function getSession() {
    const result = await auth.api.getSession({
        headers: await headers()
    })

    return result
}

// NOTE: Currently unused. Kept for server-side logout flows only.
// Use cases:
// 1) Server actions that must invalidate a session, then redirect.
// 2) Route handlers / API endpoints that log a user out server-side.
// 3) Server components/middleware-like guards that clear cookies and redirect.
// Do not call from client components (relies on next/headers).
export async function signOut() {
    const result = await auth.api.signOut({
        headers: await headers()
    })
    console.log('Sign out result:', result.success)
    if (result.success) {
        redirect('/login')
    }
}