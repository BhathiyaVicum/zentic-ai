import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Pricing from "../components/home/Pricing"
import FAQ from "../components/home/FAQ";

const HomePage = () => {

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">

            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-top-bg-gradient opacity-70 blur-3xl"></div>

            <div className="relative z-10">
                <Navbar />

                <section id="home">
                    <Hero />
                </section>

                <section id="features">
                    <Features />
                </section>

                <section id="features">
                    <HowItWorks />
                </section>

                <section id="pricing">
                    <Pricing />
                </section>

                <section id="faq">
                    <FAQ />
                </section>
            </div>
        </div>
    );
};

export default HomePage;