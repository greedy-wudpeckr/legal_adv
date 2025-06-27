import { Footer } from '@/components/Footer';
import { FAQ } from '@/components/home/FAQ';
import { HeroSection } from '@/components/home/HeroSection';
import { Stats } from '@/components/home/Stats';
import { FeaturesGrid } from '@/components/home/Features';
import "./page.css"

export default function Home() {
    return (
        <>
            <HeroSection />
            <Stats />
            <FeaturesGrid/>
            <FAQ />
            <Footer />
        </>
    );
}