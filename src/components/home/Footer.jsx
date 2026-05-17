import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa6";

const Footer = () => {

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
        <footer className="relative bg-footer-bg md:mt-20 mt-3 rounded-t-3xl ">
            <div className="max-w-7xl mx-auto py-12 px-6">

                <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12 mt-5">

                    <div className="md:max-w-xs">
                        <a
                            href="#home"
                            onClick={(e) => smoothScroll(e, "home")}
                            className="flex items-center gap-1 mb-4 justify-center md:justify-start"
                        >
                            <h1 className="text-xl font-bold text-primary-text">
                                Zentic<span className="text-secondary-text">AI</span>
                            </h1>
                        </a>
                        <p className="text-sm  text-center md:text-left">
                            Upload any PDF and turn static pages into a living conversation.
                            Instant summaries, deep insights, and page-perfect citations.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row flex-wrap justify-center md:justify-end gap-8 md:gap-28">

                        {/* Column 1*/}
                        <div className="text-center md:text-left">
                            <h3 className="text-secondary-text font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#features" onClick={(e) => smoothScroll(e, "features")} className=" hover:text-secondary-text transition text-sm">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#pricing" onClick={(e) => smoothScroll(e, "pricing")} className=" hover:text-secondary-text transition text-sm">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a href="#faq" onClick={(e) => smoothScroll(e, "faq")} className=" hover:text-secondary-text transition text-sm">
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className=" hover:text-secondary-text transition text-sm">
                                        Changelog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 2*/}
                        <div className="text-center md:text-left">
                            <h3 className="text-secondary-text font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className=" hover:text-secondary-text transition text-sm">
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className=" hover:text-secondary-text transition text-sm">
                                        API Reference
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className=" hover:text-secondary-text transition text-sm">
                                        Support
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className=" hover:text-secondary-text transition text-sm">
                                        Status
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3*/}
                        <div className="text-center md:text-left">
                            <h3 className="text-secondary-text font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className=" hover:text-secondary-text transition text-sm">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className=" hover:text-secondary-text transition text-sm">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className=" hover:text-secondary-text transition text-sm">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className=" hover:text-secondary-text transition text-sm">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="md:mt-28 mt-10 pt-6 relative">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-footer-line"></div>

                    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
                        <div className="text-center md:text-left">
                            <p className="text-secondary-text text-xs">
                                © {new Date().getFullYear()} ZenticAI. All rights reserved.
                            </p>
                        </div>
                        <div className="flex gap-3 text-secondary-text justify-center md:justify-end">
                            <a href="" className=" hover:text-primary-text transition-all duration-600"><FaGithub /></a>
                            <a href="" className="hover:text-primary-text transition-all duration-600"><FaLinkedin /></a>
                            <a href="" className="hover:text-primary-text transition-all duration-600"><FaInstagram /></a>
                        </div>
                    </div>

                </div>

            </div>
        </footer>
    );
};

export default Footer;