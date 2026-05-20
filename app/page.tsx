import React from "react"


//--------Hero Section------------

export function HeroSection()
{
    return(
        <>
        
        <div className="grid grid-cols-2 ">
            <div className="w-full min-h-full bg-gray-800">
                Hello this is grid 1
            </div>
            <div className="w-full min-h-full bg-gray-800 ">
                hello this is grid 2
            </div>
        </div>
        
        </>
    )
}













export default function home()
{
    return(
        <>
        Hello World
        <HeroSection />
        </>
    )
}