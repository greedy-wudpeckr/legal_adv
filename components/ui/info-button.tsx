import { Book } from 'lucide-react';

export default function InfoButton() {
    return (
        <button className="inline-block relative bg-green-500 p-px rounded-full font-semibold text-green-500 text-xs no-underline leading-6 cursor-none">
            <div className="z-10 flex items-center gap-2 bg-white px-4 py-0.5 rounded-full">
                <Book size={15} />
                <span>
                    Learn through immersive storytelling
                </span>
            </div>
        </button>
    )
}