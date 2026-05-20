"use client";

import React from "react";
import Image from "next/image";
import heroImage from "./image/hero1.jpg";
import { useRouter } from 'next/navigation'

//--------------Hero Section--------------
export function HeroSection() {

    const router = useRouter();
return (
    <div className="grid grid-cols-2 bg-zinc-900 gap-4 min-h-[90vh] items-center px-10 py-16 border-b border-zinc-800">
    <div className="w-full h-full px-5 py-5 flex flex-col justify-center gap-6">
        {/* Badge */}
        <div className="flex">
        <span className="text-xs font-medium tracking-widest uppercase text-indigo-400 border border-indigo-800 bg-indigo-950/50 px-3 py-1 rounded-full">
            FMCSA Compliant · 70hr/8day
        </span>
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-bold leading-tight text-white">
        Plan ELD-Compliant
        <br />
        <span className="text-indigo-400">Truck Routes</span>
        <br />
        Automatically
        </h1>

        {/* Subtext */}
        <p className="text-zinc-400 text-xl leading-relaxed max-w-md">
        Calculate routes, fuel stops, mandatory breaks, remaining cycle hours
        and generate driver logs from a single trip plan.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-4 pt-2">
        <button className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors duration-200"
        onClick={() => {router.push(`/predict`)}}
        >
            Plan a Trip
        </button>
        </div>

        {/* Trust line */}
        <p className="text-zinc-500 text-sm pt-1">
        Property-carrying · No signup 
        </p>
    </div>

    {/* Hero image */}
    <div className="w-full h-full px-3 py-2">
        <Image
        src={heroImage}
        alt="ELD Trip Planning"
        className="rounded-2xl object-cover w-full h-full max-h-[70vh]"
        />
    </div>
    </div>
);
}


//---------How Does it works-------------
export function Works() {
return (
    <section className="max-w-full bg-zinc-900 mx-auto px-6 py-20 border-b border-zinc-800">
    <div className="text-center mb-16">
        <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">
        Simple Process
        </p>
        <h2 className="text-5xl font-bold text-white">How It Works</h2>
        <p className="text-zinc-400 text-lg mt-4 max-w-xl mx-auto">
        Plan your trip in minutes and generate ELD-compliant schedules
        automatically.
        </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-2xl p-8 hover:border-indigo-800 hover:bg-zinc-800 transition-all duration-300">
        <div className="text-4xl font-bold text-indigo-500 mb-4">01</div>
        <h3 className="text-xl font-semibold mb-3 text-white">
            Enter Locations
        </h3>
        <p className="text-zinc-400 leading-relaxed">
            Provide your current location, pickup point, destination, and
            current cycle hours used.
        </p>
        </div>

        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-2xl p-8 hover:border-indigo-800 hover:bg-zinc-800 transition-all duration-300">
        <div className="text-4xl font-bold text-indigo-500 mb-4">02</div>
        <h3 className="text-xl font-semibold mb-3 text-white">
            Generate Route
        </h3>
        <p className="text-zinc-400 leading-relaxed">
            Calculate total distance, fuel stops every 1,000 miles, mandatory
            HOS breaks, and remaining cycle hours.
        </p>
        </div>

        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-2xl p-8 hover:border-indigo-800 hover:bg-zinc-800 transition-all duration-300">
        <div className="text-4xl font-bold text-indigo-500 mb-4">03</div>
        <h3 className="text-xl font-semibold mb-3 text-white">
            Get Driver Logs
        </h3>
        <p className="text-zinc-400 leading-relaxed">
            Automatically generate filled FMCSA-compliant daily log sheets,
            ready for inspection.
        </p>
        </div>
    </div>
    </section>
);
}

//-------------Features Section--------------------
export function Features() {
const features = [
    {
    num: "01",
    title: "Route Mapping",
    desc: "Interactive map showing the full route with stop markers, fuel stations, and rest break locations.",
    },
    {
    num: "02",
    title: "HOS Calculator",
    desc: "Enforces 11hr drive limit, 14hr window, 30min break rule, and 70hr/8day cycle automatically.",
    },
    {
    num: "03",
    title: "Fuel Stop Planner",
    desc: "Inserts mandatory fuel stops every 1,000 miles and marks them on your route map.",
    },
    {
    num: "04",
    title: "ELD Log Sheets",
    desc: "Generates filled paper-style driver daily log sheets  multiple sheets for multi-day trips.",
    },
];

return (
    <section className="max-w-full bg-zinc-950 mx-auto px-6 py-20 border-b border-zinc-800">
    <div className="text-center mb-16">
        <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">
        What You Get
        </p>
        <h2 className="text-5xl font-bold text-white">Features</h2>
        <p className="text-zinc-400 text-lg mt-4 max-w-xl mx-auto">
        Everything needed to plan a compliant interstate truck trip in one
        place.
        </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((f) => (
        <div
            key={f.num}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-indigo-800/60 hover:bg-zinc-800/50 transition-all duration-300 group"
        >
            <div className="text-4xl font-bold text-indigo-500 mb-4 group-hover:text-indigo-400 transition-colors">
            {f.num}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">{f.title}</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">{f.desc}</p>
        </div>
        ))}
    </div>
    </section>
);
}


// ------------------ Footer -------------------
export function Footer() {
    const router = useRouter();
return (
    <section className="bg-indigo-950/40 border-y border-indigo-900/40 px-6 py-16">
    <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <h2 className="text-4xl font-bold text-white leading-tight">
        Ready to plan your first trip?
        </h2>
        <p className="text-zinc-400 text-lg">
        Enter your trip details and get a full ELD-compliant route with log
        sheets in seconds.
        </p>
        <button className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-colors duration-200"
        onClick={()=>{router.push('/predict')}}>
        Start Planning →
        </button>
    </div>
    </section>
);
}

//-------------Home Section----------------------
export default function Home() {
return (
    <main className="bg-zinc-950 text-white min-h-screen">
    <HeroSection />
    <Features />
    <Works />
    <Footer />
    </main>
);
}