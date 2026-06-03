"use client";

import AnimatedSection from "./AnimatedSection";


export default function Footer() {
  return (
    <footer className="bg-base-100 border-t border-base-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-base-content/60">
              &copy; {new Date().getFullYear()} Max App. All rights reserved.
            </p>
            {/* Trust badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-base-content/60">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-base-content/60">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span>Verified</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
