"use client";

import { VelocityScroll } from "../ui/scroll-based-velocity";

export function Stats() {
    return (
        <div className="relative flex flex-col justify-center items-center mb-20 w-full overflow-hidden">
            <VelocityScroll>
                • Ask • Explore • Learn
            </VelocityScroll>
            <div className="left-0 absolute inset-y-0 bg-gradient-to-r from-background w-1/4 pointer-events-none"></div>
            <div className="right-0 absolute inset-y-0 bg-gradient-to-l from-background w-1/4 pointer-events-none"></div>
        </div>
    );
}