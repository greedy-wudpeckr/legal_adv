import React from "react";
import { CardSpotlight } from "../ui/card-spotlight";
import PageHeading from "../ui/page-heading";

interface FeatureCardProps {
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
    return (
        <div className="z-50 relative bg-black p-6 border border-white/10 rounded-xl text-white transition">
            <h3 className="mb-2 font-semibold text-xl">{title}</h3>
            <p className="text-gray-300 text-sm">{description}</p>
        </div>
    );
};

export const FeaturesGrid = () => {
    return (
        <>
            <PageHeading
                smallHeading="Features"
                bigHeading="Know what we provide"
            />
            <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3 bg-black mt-10 p-6">
                {cards.map((card, index) => (
                    <CardSpotlight key={index}>
                        <FeatureCard
                            title={card.title}
                            description={card.description}
                        />
                    </CardSpotlight>
                ))}
            </div>
        </>
    );
};

export const cards = [
    {
        title: "AI-Powered Avatars",
        description: "Talk to historical and scientific figures like Gandhi, Ada Lovelace, and Einstein in real-time using natural language.",
    },
    {
        title: "Immersive Storytelling",
        description: "Learn through narrative quests that turn lessons into memorable adventures across time and topics.",
    },
    {
        title: "Multi-Subject Coverage",
        description: "Explore diverse subjects including Law, History, Science, Geography, and Computer Science — each with tailored experiences.",
    },
    {
        title: "Interactive Learning",
        description: "Engage in real conversations, solve challenges, and get guided explanations rather than passive content.",
    },
    {
        title: "Browser-Based Access",
        description: "No downloads needed — just open your browser and start learning interactively from anywhere.",
    },
    {
        title: "Gamified Experience",
        description: "Earn points, unlock characters, and level up your knowledge through a fun, game-like progression system.",
    },
];