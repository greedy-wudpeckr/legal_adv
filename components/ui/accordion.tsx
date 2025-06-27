'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion';

type AccordionpProps = {
    children: React.ReactNode
    title: string
    id: number,
    active?: boolean
}

export function Accordion({
    children,
    title,
    id,
    active = false
}: AccordionpProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [accordionOpen, setAccordionOpen] = useState<boolean>(false)

    useEffect(() => {
        setAccordionOpen(active)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: id * 0.2 }}
        >
            <div className="border-2 border-orange rounded-xl">
                <h2>
                    <button
                        className="flex justify-between items-center p-4 w-full font-grotesk font-semibold text-lg text-left cursor-none"
                        onClick={(e) => { e.preventDefault(); setAccordionOpen(!accordionOpen); }}
                        aria-expanded={accordionOpen}
                        aria-controls={`accordion-text-${id}`}
                    >
                        <span>{title}</span>
                    </button>
                </h2>
                <div
                    id={`accordion-text-${id}`}
                    role="region"
                    aria-labelledby={`accordion-title-${id}`}
                    className={`grid text-sm text-white bg-black overflow-hidden transition-all duration-300 ease-in-out ${accordionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                    <div className="overflow-hidden">
                        <p className="p-4">
                            {children}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div >

    )
}