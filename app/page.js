"use client";

import React from "react";
import Image from "next/image";
import heroImage from "./image/hero1.jpg";

export function HeroSection() {
return (
    <div className="grid grid-cols-2 bg-zinc-800 gap-4 mx-3">
    <div className="w-full h-full px-5 py-5">
        <span className="text-6xl font-sans px-5 py-5">
            Plan ELD-Compliant 
            <br />Truck Routes Automatically
        </span>

        <div className="text-2xl font-sans px-5 py-5">
            Calculate routes, fuel stops, mandatory breaks,<br/>
            remaining cycle hours and keep your <br />
            driver logs from a single trip plan.
        </div>

        <div className="py-5 text-xl">
        <button className="px-3 py-2 rounded-3xl bg-emerald-800">
            <span className="relative inline-flex">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="ml-2">Wants to know?</span>
        </button>
        </div>
    </div>

    <div className="w-full h-full px-3 py-2">
        <Image
        src={heroImage}
        alt="Hero"
        width={500}
        height={500}
        />
    </div>
    </div>
);
}



export function Works()
{
    return(
        <>
        <div className="grid grid-cols-3 gap-10 mx-3 my-5 px-5 py-7 bg-zinc-700">
            <div className="h-full w-full bg-black px-3 py-5">hey this the grid child</div>
            <div className="h-full w-full bg-black px-3 py-5">hey this the grid child</div>
            <div className="h-full w-full bg-black px-3 py-5">hey this the grid child</div>
        </div>
        
        </>
    )
}




    export default function Home() {
    return (
        <>
        Hello World
        <HeroSection />
        <Works />
        </>
    );
    }