import { useState, useEffect } from "react";

const Navbar = () => {
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const sections = ["home", "features", "pricing", "faq"];
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach((section) => {
            const element = document.getElementById(section);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const smoothScroll = (e, sectionId) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <nav className="fixed w-full z-50 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 md:px-0">
                
                <a href="#home" onClick={(e) => smoothScroll(e, "home")} className="flex items-center gap-1">
                    <h1 className="text-2xl font-bold text-primary-text">
                        Zentic<span className="text-secondary-text">AI</span>
                    </h1>
                </a>

                <div className="hidden md:flex items-center gap-8">
                    <a
                        href="#home"
                        onClick={(e) => smoothScroll(e, "home")}
                        className={`transition duration-300 text-lg cursor-pointer ${
                            activeSection === "home"
                                ? "text-primary-text"
                                : "text-secondary-text hover:text-primary-text"
                        }`}
                    >
                        Home
                    </a>
                    <a
                        href="#features"
                        onClick={(e) => smoothScroll(e, "features")}
                        className={`transition duration-300 text-lg cursor-pointer ${
                            activeSection === "features"
                                ? "text-primary-text"
                                : "text-secondary-text hover:text-primary-text"
                        }`}
                    >
                        Features
                    </a>
                    <a
                        href="#pricing"
                        onClick={(e) => smoothScroll(e, "pricing")}
                        className={`transition duration-300 text-lg cursor-pointer ${
                            activeSection === "pricing"
                                ? "text-primary-text"
                                : "text-secondary-text hover:text-primary-text"
                        }`}
                    >
                        Pricing
                    </a>
                    <a
                        href="#faq"
                        onClick={(e) => smoothScroll(e, "faq")}
                        className={`transition duration-300 text-lg cursor-pointer ${
                            activeSection === "faq"
                                ? "text-primary-text"
                                : "text-secondary-text hover:text-primary-text"
                        }`}
                    >
                        FAQ
                    </a>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-lg font-normal text-primary-text hover:text-secondary-text transition hidden lg:flex">
                        Login
                    </button>
                    <button className="px-5 py-2 text-lg font-normal bg-btn-primary rounded-xl text-white hover:opacity-80 transition ">
                        Sign up
                    </button>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-primary-text">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;