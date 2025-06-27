import { Footer } from '@/components/Footer';
import { FAQ } from '@/components/home/FAQ';
import { HeroSection } from '@/components/home/HeroSection';
import { Stats } from '@/components/home/Stats';
import { Navbar } from '@/components/ui/resizable-navbar';
import { SmoothCursor } from '@/components/ui/smooth-cursor';
import { FeaturesGrid } from '@/components/home/Features';
import "./page.css"

export default function Home() {
    return (
        <>
            <SmoothCursor/>
            <Navbar />
            <HeroSection />
            <Stats />
            <FeaturesGrid/>
            <FAQ />
            <Footer />
        </>
    );
}