import { getSession } from "@/lib/auth/auth";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-base-100">
      <main className="flex-1">
        <Hero isAuthenticated={!!session?.user} />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
