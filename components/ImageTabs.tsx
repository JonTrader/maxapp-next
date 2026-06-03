"use client";
import Image from "next/image";
import { useState } from "react";

export default function ImageTabs() {
    const [activeTab, setActiveTab] = useState("organize")
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-6xl">
                    {/* Tabs */}
                    <div className="flex gap-2 justify-center mb-8">
                        <button onClick={() => setActiveTab('organize')} className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'organize' ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Organize Applications</button>
                        <button onClick={() => setActiveTab('hired')} className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'hired' ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Get Hired</button>
                        <button onClick={() => setActiveTab('manage')} className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'manage' ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Manage Boards</button>
                    </div>
                    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-xl">
                        {activeTab === "organize" && <Image
                            src="/home-images/hero1.png"
                            alt="Organize"
                            width={1200}
                            height={800} />}

                        {activeTab === "hired" && <Image
                            src="/home-images/hero2.png"
                            alt="hired"
                            width={1200}
                            height={800} />}

                        {activeTab === "manage" && <Image
                            src="/home-images/hero3.png"
                            alt="manage"
                            width={1200}
                            height={800} />}
                    </div>
                </div>
            </div>
        </section>
    )
}