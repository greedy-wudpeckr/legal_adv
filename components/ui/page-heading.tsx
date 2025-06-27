interface PageHeading {
    smallHeading: string,
    bigHeading: string
}
export default function PageHeading({ smallHeading, bigHeading }: PageHeading) {
    return (
        <div className="flex flex-col items-center gap-4 px-4 sm:px-10">
            <h2 className="font-grotesk font-bold text-orange text-sm">{smallHeading}</h2>
            <h3 className="max-w-xl font-inter text-xl sm:text-4xl text-center">{bigHeading}</h3>
        </div>
    )
}