"use client";

import React from "react";
import AnimatedSection from "./AnimatedSection";
import LineArt from "./LineArt";

const features = [
  {
    title: "Organize Applications",
    description: "Custom boards and columns to track every stage of your job search journey.",
    lineArt: "briefcase" as const,
  },
  {
    title: "Track Progress",
    description: "Visual Kanban boards show your pipeline from applied to offer at a glance.",
    lineArt: "trending" as const,
  },
  {
    title: "Stay Organized",
    description: "Never lose track of an application with centralized job search management.",
    lineArt: "check" as const,
  },
  {
    title: "AI Analyzer",
    description: "Get AI-powered insights and analysis to improve your job search strategy.",
    lineArt: "brain" as const,
  },
  {
    title: "Smart Reminders",
    description: "Get notified about the progress of your job applications through email.",
    lineArt: "bell" as const,
  },
  {
    title: "Insights & Analytics",
    description: "Understand your job search patterns with detailed statistics and reports.",
    lineArt: "chart" as const,
  },
];

function FeatureLineArt({ variant }: { variant: string }) {
  const paths: Record<string, React.ReactNode> = {
    briefcase: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="8" y="16" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M16 16V12a4 4 0 014-4h8a4 4 0 014 4v4" stroke="currentColor" strokeWidth="2" />
        <path d="M8 24h32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>
    ),
    trending: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M8 32l12-12 8 8 12-16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="40" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" />
        <path d="M14 24l8 8 12-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    brain: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M16 24c0-6 4-10 8-10s8 4 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="24" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="24" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M24 34v-4M20 38h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    bell: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M12 20c0-8 6-12 12-12s12 4 12 12v10l4 4H8l4-4V20z" stroke="currentColor" strokeWidth="2" />
        <path d="M20 38a4 4 0 008 0" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="6" y="6" width="36" height="36" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M6 36l12-12 8 8 10-20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="36" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  };
  return paths[variant] || null;
}

export default function Features() {
  return (
    <section className="py-24 lg:py-32 bg-base-100 relative overflow-hidden">
      {/* Background line art */}
      <AnimatedSection className="absolute top-0 left-0 w-96 h-96 text-base-content/2" parallaxSpeed={0.1}>
        <LineArt variant="spiral" strokeWidth={1} />
      </AnimatedSection>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header - left aligned, oversized */}
        <AnimatedSection>
          <div className="max-w-2xl mb-20">
            <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
              Powerful features
            </p>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-base-content tracking-tight leading-[0.95]">
              Everything
              <br />
              you need to{" "}
              <span className="italic font-serif text-primary">get hired</span>
            </h2>
          </div>
        </AnimatedSection>

        {/* Bento Grid - Asymmetric layout */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Row 1: Large card + 2 stacked small cards */}
          {/* Large feature card - spans 7 columns */}
          <AnimatedSection className="col-span-12 lg:col-span-7" delay={0} parallaxSpeed={0.2}>
            <div className="group h-full bg-base-200/50 border border-base-300 p-8 lg:p-10 transition-all duration-500 hover:bg-base-200 hover:border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 text-primary/10 transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500">
                <FeatureLineArt variant={features[0].lineArt} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 text-primary mb-6">
                  <FeatureLineArt variant={features[0].lineArt} />
                </div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-base-content mb-3">
                  {features[0].title}
                </h3>
                <p className="text-base-content/60 text-lg max-w-sm leading-relaxed">
                  {features[0].description}
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* 2 stacked cards - spans 5 columns */}
          <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-4 lg:gap-6">
            <AnimatedSection delay={100} parallaxSpeed={0.3}>
              <div className="group h-full bg-base-200/30 border border-base-300 p-6 transition-all duration-500 hover:bg-base-200 hover:-translate-y-1 hover:border-primary/20 relative overflow-hidden">
                <div className="w-10 h-10 text-primary/70 mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <FeatureLineArt variant={features[1].lineArt} />
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  {features[1].title}
                </h3>
                <p className="text-base-content/60 text-sm">
                  {features[1].description}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200} parallaxSpeed={0.25}>
              <div className="group h-full bg-base-200/30 border border-base-300 p-6 transition-all duration-500 hover:bg-base-200 hover:-translate-y-1 hover:border-primary/20 relative overflow-hidden">
                <div className="w-10 h-10 text-primary/70 mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <FeatureLineArt variant={features[2].lineArt} />
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  {features[2].title}
                </h3>
                <p className="text-base-content/60 text-sm">
                  {features[2].description}
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Row 2: 3 equal cards with varied heights */}
          <AnimatedSection className="col-span-12 md:col-span-4" delay={300} parallaxSpeed={0.15}>
            <div className="group h-full min-h-50 bg-base-200/30 border border-base-300 p-6 transition-all duration-500 hover:bg-base-200 hover:translate-x-1 hover:border-primary/20">
              <div className="w-10 h-10 text-primary/70 mb-4 group-hover:text-primary transition-colors duration-300">
                <FeatureLineArt variant={features[3].lineArt} />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                {features[3].title}
              </h3>
              <p className="text-base-content/60 text-sm">
                {features[3].description}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="col-span-12 md:col-span-4" delay={400} parallaxSpeed={0.2}>
            <div className="group h-full min-h-50 bg-base-200/30 border border-base-300 p-6 transition-all duration-500 hover:bg-base-200 hover:-translate-y-1 hover:border-primary/20">
              <div className="w-10 h-10 text-primary/70 mb-4 group-hover:text-primary transition-colors duration-300">
                <FeatureLineArt variant={features[4].lineArt} />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                {features[4].title}
              </h3>
              <p className="text-base-content/60 text-sm">
                {features[4].description}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="col-span-12 md:col-span-4" delay={500} parallaxSpeed={0.15}>
            <div className="group h-full min-h-50 bg-base-200/30 border border-base-300 p-6 transition-all duration-500 hover:bg-base-200 hover:translate-x-1 hover:border-primary/20">
              <div className="w-10 h-10 text-primary/70 mb-4 group-hover:text-primary transition-colors duration-300">
                <FeatureLineArt variant={features[5].lineArt} />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">
                {features[5].title}
              </h3>
              <p className="text-base-content/60 text-sm">
                {features[5].description}
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* Bottom decorative line art */}
        <AnimatedSection className="mt-20 flex justify-center" delay={600} parallaxSpeed={0.1}>
          <div className="w-32 h-8 text-base-content/10">
            <LineArt variant="wave" strokeWidth={1} />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
