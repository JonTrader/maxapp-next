"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  isAuthenticated: boolean;
}

export default function Hero({ isAuthenticated }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-base-200 pointer-events-none" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100 border border-base-200 shadow-sm mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-base-content/70">
              Free forever — No credit card required
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-base-content mb-6 leading-[1.1]">
            Land your dream job{" "}
            <span className="text-primary">faster</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl md:text-2xl text-base-content/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Organize your entire job search in one beautiful place.
            Track applications, manage interviews, and with the help of AI, improve your resume and cover letter.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href={isAuthenticated ? "/jobapplications" : "/register"}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-primary rounded-2xl shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              {isAuthenticated ? "Continue tracking" : "Start for free"}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-base-content/60">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Unlimited Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>AI Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Cover Letter Generator</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
