import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [activeSection, setActiveSection] = useState("home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        setMobileMenuOpen(false); // Close mobile menu when clicking
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <nav className="fixed w-full z-50 backdrop-blur-lg bg-black/50">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">

                {/* Logo */}
                <a href="#home" onClick={(e) => smoothScroll(e, "home")} className="flex items-center gap-1">
                    <h1 className="text-2xl font-bold text-primary-text">
                        Zentic<span className="text-secondary-text">AI</span>
                    </h1>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <a
                        href="#home"
                        onClick={(e) => smoothScroll(e, "home")}
                        className={`transition duration-300 text-lg cursor-pointer ${activeSection === "home"
                            ? "text-primary-text"
                            : "text-secondary-text hover:text-primary-text"
                            }`}
                    >
                        Home
                    </a>
                    <a
                        href="#features"
                        onClick={(e) => smoothScroll(e, "features")}
                        className={`transition duration-300 text-lg cursor-pointer ${activeSection === "features"
                            ? "text-primary-text "
                            : "text-secondary-text hover:text-primary-text"
                            }`}
                    >
                        Features
                    </a>
                    <a
                        href="#pricing"
                        onClick={(e) => smoothScroll(e, "pricing")}
                        className={`transition duration-300 text-lg cursor-pointer ${activeSection === "pricing"
                            ? "text-primary-text"
                            : "text-secondary-text hover:text-primary-text"
                            }`}
                    >
                        Pricing
                    </a>
                    <a
                        href="#faq"
                        onClick={(e) => smoothScroll(e, "faq")}
                        className={`transition duration-300 text-lg cursor-pointer ${activeSection === "faq"
                            ? "text-primary-text"
                            : "text-secondary-text hover:text-primary-text"
                            }`}
                    >
                        FAQ
                    </a>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3">
                    <Link to="/signin" >
                        <button className="px-4 py-2 text-lg font-normal text-primary-text hover:text-secondary-text transition hidden sm:block">
                            Login
                        </button>
                    </Link>
                    <Link to="/signup">
                        <button className="px-5 py-2 text-lg font-normal bg-btn-primary rounded-xl text-white hover:opacity-80 transition">
                            Sign up
                        </button>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-primary-text focus:outline-none"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <div className="w-6 h-6 relative">
                            <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? "rotate-45 top-3" : "top-1"
                                }`} />
                            <span className={`absolute h-0.5 bg-current transition-all duration-300 ease-in-out ${mobileMenuOpen ? "opacity-0 w-0" : "w-6 top-3 opacity-100"
                                }`} />
                            <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? "-rotate-45 top-3" : "top-5"
                                }`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}>
                <div className="px-6 pb-6 pt-2 bg-black/95 backdrop-blur-lg border-t border-brand-light/20">
                    <div className="flex flex-col gap-4">
                        <a
                            href="#home"
                            onClick={(e) => smoothScroll(e, "home")}
                            className={`transition text-lg py-2 ${activeSection === "home"
                                ? "text-primary-text font-semibold border-l-4 border-secondary-text pl-3"
                                : "text-secondary-text hover:text-primary-text pl-4"
                                }`}
                        >
                            Home
                        </a>
                        <a
                            href="#features"
                            onClick={(e) => smoothScroll(e, "features")}
                            className={`transition text-lg py-2 ${activeSection === "features"
                                ? "text-primary-text font-semibold border-l-4 border-secondary-text pl-3"
                                : "text-secondary-text hover:text-primary-text pl-4"
                                }`}
                        >
                            Features
                        </a>
                        <a
                            href="#pricing"
                            onClick={(e) => smoothScroll(e, "pricing")}
                            className={`transition text-lg py-2 ${activeSection === "pricing"
                                ? "text-primary-text font-semibold border-l-4 border-secondary-text pl-3"
                                : "text-secondary-text hover:text-primary-text pl-4"
                                }`}
                        >
                            Pricing
                        </a>
                        <a
                            href="#faq"
                            onClick={(e) => smoothScroll(e, "faq")}
                            className={`transition text-lg py-2 ${activeSection === "faq"
                                ? "text-primary-text font-semibold border-l-4 border-secondary-text pl-3"
                                : "text-secondary-text hover:text-primary-text pl-4"
                                }`}
                        >
                            FAQ
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;