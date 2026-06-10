"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import LineArt from "./LineArt";

interface HeroProps {
  isAuthenticated: boolean;
}

export default function Hero({ isAuthenticated }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background - single tone */}
      <div className="absolute inset-0 bg-base-100 pointer-events-none" />

      {/* Floating line art - top right */}
      <AnimatedSection className="absolute top-20 right-10 lg:right-32 w-32 h-32 lg:w-48 lg:h-48 text-primary/20" parallaxSpeed={0.3}>
        <LineArt variant="spiral" strokeWidth={1} />
      </AnimatedSection>

      {/* Floating line art - mid left */}
      <AnimatedSection className="absolute top-1/3 -left-4 lg:left-16 w-24 h-48 text-base-content/10" parallaxSpeed={0.5} delay={200}>
        <LineArt variant="dots" strokeWidth={1} />
      </AnimatedSection>

      {/* Wave line - bottom */}
      <AnimatedSection className="absolute bottom-32 right-0 lg:right-48 w-48 lg:w-72 h-24 text-primary/15" parallaxSpeed={0.2} delay={300}>
        <LineArt variant="wave" strokeWidth={1.5} />
      </AnimatedSection>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-center w-full py-24">
          {/* Left content - oversized typography */}
          <div className="lg:col-span-7 xl:col-span-6">
            <AnimatedSection delay={0}>
              {/* Badge - vertical orientation */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-base-300 mb-8">
                <span className="flex h-2 w-2 bg-emerald-500" />
                <span className="text-sm font-medium text-base-content/70">
                  Free forever — No credit card
                </span>
              </div>
            </AnimatedSection>

            {/* Oversized headline */}
            <AnimatedSection delay={100}>
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-base-content leading-[0.85] mb-8">
                Land your
                <br />
                <span className="text-primary italic font-serif">dream</span>
                <br />
                job faster
              </h1>
            </AnimatedSection>

            {/* Sub-headline - narrower width */}
            <AnimatedSection delay={200}>
              <p className="text-lg sm:text-xl text-base-content/60 max-w-md mb-10 leading-relaxed">
                Organize your entire job search in one beautiful place.
                Track applications and improve your resume with AI.
              </p>
            </AnimatedSection>

            {/* CTA - asymmetric placement */}
            <AnimatedSection delay={300}>
              <Link
                href={isAuthenticated ? "/jobapplications" : "/register"}
                className="group inline-flex items-center gap-3 text-lg font-semibold text-base-content hover:text-primary transition-colors duration-300"
              >
                <span className="border-b-2 border-current pb-1">
                  {isAuthenticated ? "Continue tracking" : "Start for free"}
                </span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </AnimatedSection>

            {/* Trust indicators - horizontal with line art */}
            <AnimatedSection delay={400}>
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-base-200">
                <div className="text-sm text-base-content/50">
                  <span className="font-semibold text-base-content">Unlimited</span> Applications
                </div>
                <div className="h-8 w-px bg-base-300" />
                <div className="text-sm text-base-content/50">
                  <span className="font-semibold text-base-content">AI</span> Analysis
                </div>
                <div className="h-8 w-px bg-base-300" />
                <div className="text-sm text-base-content/50">
                  <span className="font-semibold text-base-content">Cover</span> Letters
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right side - decorative space with line art accents */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 relative h-full min-h-100">
            {/* Large decorative curve */}
            <AnimatedSection className="absolute top-1/4 left-1/4 w-64 h-64 text-primary/10" parallaxSpeed={0.4} delay={500}>
              <LineArt variant="curve" strokeWidth={2} />
            </AnimatedSection>

            {/* Circle accent */}
            <AnimatedSection className="absolute bottom-1/4 right-1/4 w-32 h-32 text-base-content/5" parallaxSpeed={0.6} delay={600}>
              <LineArt variant="circle" strokeWidth={1.5} />
            </AnimatedSection>

            {/* Vertical line */}
            <AnimatedSection className="absolute top-0 left-1/2 h-48 w-4 text-base-content/10" parallaxSpeed={0.3} delay={700}>
              <LineArt variant="line" strokeWidth={2} />
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
