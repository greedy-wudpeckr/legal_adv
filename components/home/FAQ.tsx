'use client';

import { Accordion } from '@/components/ui/accordion';
import PageHeading from '@/components/ui/page-heading';

const faqs = [
    {
        active: false,
        title: "What is this platform about?",
        text: "It's an interactive 3D learning platform where you can chat with historical, legal, scientific and many more avatars, and explore subjects through immersive quests and storytelling.",
    },
    {
        active: false,
        title: "Do I need to install anything?",
        text: "Nope! The entire experience runs in your browser. Just visit the site and start learning with our 3D avatars instantly.",
    },
    {
        active: false,
        title: "Which subjects are covered?",
        text: "We support History, Law, Science, Geography, Computer Science and many more — each with dedicated avatars and custom learning journeys.",
    },
    {
        active: false,
        title: "Who are the avatars?",
        text: "Our avatars are AI-powered representations of key historical and domain experts like Mahatma Gandhi, Ashoka, and others tailored for each subject.",
    },
    {
        active: false,
        title: "Is it free to use?",
        text: "Yes! The core features are completely free to access. We may add premium features for advanced quests or certifications later.",
    },
    {
        active: false,
        title: "What makes it different from YouTube or textbooks?",
        text: "Unlike static videos or pages, our platform is interactive and conversational — you engage in quests, ask questions, and learn by doing, not just watching.",
    },
];  

export function FAQ() {
    return (
        <main className="relative flex flex-col justify-center overflow-hidden">
            <PageHeading
                smallHeading="FAQs"
                bigHeading="Frequently Asked Questions"
            />
            <div className="space-y-4 mx-auto mt-10 px-4 md:px-6 w-full max-w-2xl">
                {faqs.map((faq, index) => {
                    return (
                        <Accordion key={faq.title} title={faq.title} id={index} active={faq.active}>
                            {faq.text}
                        </Accordion>
                    );
                })}
            </div>
        </main>
    );
}