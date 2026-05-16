import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";

const HomePage = () => {
    return (
        <div className="relative min-h-screen bg-black overflow-hidden">

            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-top-bg-gradient opacity-70 blur-3xl"></div>

            <div className="relative z-10">
                <Navbar />
                <Hero />
            </div>

        </div>
    );
};

export default HomePage;