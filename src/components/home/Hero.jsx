import { useState, useRef } from "react";
import heroImg from "../../assets/hero-img.png";
import heroImgSm from "../../assets/hero-img-sm.png"

const Hero = () => {

    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const imageRef = useRef(null);

    const handleMouseMove = (e) => {
        if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateXValue = ((y - centerY) / centerY) * -15;
            const rotateYValue = ((x - centerX) / centerX) * 15;

            setRotateX(rotateXValue);
            setRotateY(rotateYValue);
        }
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setIsHovering(false);
    };
    

    return (
        <section id="home" className="relative min-h-screen flex items-center px-6 pt-32">
            <div className="max-w-7xl mx-auto w-full">

                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-semibold mb-4">
                        <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                            Static Documents,
                        </span>
                        <br />
                        <span className="bg-gradient-to-b from-brand-light to-brand-medium bg-clip-text text-transparent ">
                            AI-Powered Insights
                        </span>
                    </h1>

                    <p className="text-gray-300 text-lg md:text-md max-w-2xl mx-auto mt-5">
                        Upload documents, get instant answers, generate summaries,
                        <span className="hidden lg:inline">
                            <br />
                        </span>
                        and explore insights with accurate citations.
                    </p>

                    <button className="mt-6 px-5 py-2 text-lg font-normal bg-btn-primary rounded-xl text-primary-text hover:opacity-80 transition duration-700 shadow-lg hover:scale-105 transform">
                        Get Started For Free ➤
                    </button>
                </div>

                <div className="md:mt-2 mt-12 flex justify-center">
                    <div
                        ref={imageRef}
                        className="relative"
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    >
                        {/* Glow effect on hover */}
                        {isHovering && (
                            <div className="absolute -inset-4opacity-50 animate-pulse"></div>
                        )}

                        <img
                            src={heroImg}
                            className="w-full max-w-3xl mx-auto hidden lg:inline relative z-10 transition-all duration-300 shadow-2xl rounded-xl"
                            style={{
                                transform: isHovering ? 'scale(1.02)' : 'scale(1)',
                                transition: 'transform 0.3s ease'
                            }}
                        />
                        <img src={heroImgSm} className="w-72 h-72 mx-auto md:hidden" alt="" />
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Hero;