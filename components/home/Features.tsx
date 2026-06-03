"use client";

import {
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Brain,
  Bell,
  BarChart3,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const features = [
  {
    icon: Briefcase,
    title: "Organize Applications",
    description: "Custom boards and columns to track every stage of your job search journey.",
    color: "from-blue-400 to-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Visual Kanban boards show your pipeline from applied to offer at a glance.",
    color: "from-emerald-400 to-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    icon: CheckCircle2,
    title: "Stay Organized",
    description: "Never lose track of an application with centralized job search management.",
    color: "from-violet-400 to-violet-500",
    bgColor: "bg-violet-50",
  },
  {
    icon: Brain,
    title: "AI Analyzer",
    description: "Get AI-powered insights and analysis to improve your job search strategy.",
    color: "from-rose-400 to-rose-500",
    bgColor: "bg-rose-50",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Get notified about the progress of your job applications through email.",
    color: "from-amber-400 to-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    icon: BarChart3,
    title: "Insights & Analytics",
    description: "Understand your job search patterns with detailed statistics and reports.",
    color: "from-cyan-400 to-cyan-500",
    bgColor: "bg-cyan-50",
  },
];

export default function Features() {
  return (
    <section className="py-16 sm:py-24 bg-base-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100 border border-base-200 shadow-sm mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-base-content/70">
                Powerful features
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-base-content mb-6">
              Everything you need to{" "}
              <span className="text-primary">get hired</span>
            </h2>
            <p className="text-lg sm:text-xl text-base-content/70">
              A complete toolkit designed specifically for modern job seekers who want to stay organized and land faster.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={index * 100}>
              <div className="group relative bg-base-100 rounded-2xl p-6 border border-base-200 transition-all duration-300 hover:shadow-xl hover:shadow-base-200/50 hover:-translate-y-1 hover:border-base-300">
                {/* Icon */}
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  {feature.title}
                </h3>
                <p className="text-base-content/70 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-5 pointer-events-none" />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
