"use client";
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { HeroHighlight } from '@/components/ui/hero-highlight';
import InfoButton from '@/components/ui/info-button';
import { ShimmerButton } from '@/components/ui/shimmer-button';

export function HeroSection() {
    return (
        <HeroHighlight>
            <div className="relative flex flex-col justify-center items-center mx-auto px-4 py-10 md:py-20 max-w-7xl min-h-screen font-inter text-neutral-600 dark:text-neutral-400">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.2,
                        ease: "easeOut",
                    }}
                >
                    <InfoButton />
                </motion.div>
                <h1 className="z-10 relative mx-auto mt-4 font-bold text-3xl md:text-4xl lg:text-7xl text-center">
                    {"Bring subjects to life"
                        .split(" ")
                        .map((word, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                transition={{
                                    duration: 0.2,
                                    delay: index * 0.1,
                                    ease: "easeIn",
                                }}
                                className="inline-block mr-2 font-grotesk"
                            >
                                {word}
                            </motion.span>
                        ))}
                </h1>
                <motion.p
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.3,
                        delay: 0.6,
                    }}
                    className="z-10 relative mx-auto py-4 max-w-xl text-neutral-600 dark:text-neutral-400 text-sm md:text-base lg:text-lg text-center"
                >
                    Engage with 3D avatars of great minds and explore history, science, law, and more through interactive games and chat-based learning.
                </motion.p>
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.3,
                        delay: 1,
                    }}
                    className="z-10 relative flex flex-wrap justify-center items-center gap-2 md:gap-4 mt-4 text-xs sm:text-sm"
                >
                    <div className="flex items-center gap-1">
                        <CheckCircle2 className="text-green-600" size={20} />
                        Avatars from every subject
                    </div>
                    <div className="flex items-center gap-1">
                        <CheckCircle2 className="text-green-600" size={20} />
                        Explore subjects through games
                    </div>
                    <div className="flex items-center gap-1">
                        <CheckCircle2 className="text-green-600" size={20} />
                        Learn by doing, not memorizing
                    </div>
                </motion.div>
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.3,
                        delay: 1,
                    }}
                    className="z-10 relative flex flex-wrap justify-center items-center gap-4 mt-8"
                >
                    <Link href="/signup">
                        <ShimmerButton>
                            Start Learning
                        </ShimmerButton>
                    </Link>
                </motion.div>
            </div>
        </HeroHighlight>
    );
}