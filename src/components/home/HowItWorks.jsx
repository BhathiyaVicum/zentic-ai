import Step1 from "../../assets/step1.png"
import Step2 from "../../assets/step2.png"
import Step3 from "../../assets/step3.png"
import ArrowIcon from "../../assets/arrow.png"
import ArrowIconMobile from "../../assets/arrow-mobile.png"

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto w-full">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <button className="px-5 py-1 text-secondary-text text-sm font-light border pointer-events-none border-secondary-text/20 rounded-full bg-brand-muted/30">
                        How It Works
                    </button>
                    <h2 className="text-3xl md:text-4xl font-semibold mt-2 md:mt-4 mb-10 md:mb-3 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        Simple. Powerful.
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-0 mt-1 md:mt-20">
                    
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center w-full max-w-xs">
                        <img src={Step1} alt="Upload" className="w-44 md:mb-10 mb-5" />
                        <button className="px-5 py-1 mb-5 text-primary-text text-xl font-light border border-secondary-text/20 rounded-lg bg-step-btn">
                            Upload
                        </button>
                        <p className="text-primary-text text-lg font-light">
                            Drop your PDFs into <br /> the dashboard.
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <img src={ArrowIcon} alt="arrow" className="w-96 rotate-360" />
                    </div>
                    {/* Mobile arrow (down) */}
                    <div className="block md:hidden">
                        <img src={ArrowIconMobile} alt="arrow" className="h-4 rotate-90" />
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center w-full max-w-xs">
                        <img src={Step2} alt="Process" className="w-44 md:mb-10 mb-5" />
                        <button className="px-5 py-1 mb-5 text-primary-text text-xl font-light border border-secondary-text/20 rounded-lg bg-step-btn">
                            Process
                        </button>
                        <p className="text-primary-text text-lg font-light">
                            Our Neural Engine <br /> maps the context.
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <img src={ArrowIcon} alt="arrow" className="w-96 rotate-360" />
                    </div>
                    {/* Mobile arrow (down) */}
                    <div className="block md:hidden">
                        <img src={ArrowIconMobile} alt="arrow" className="h-4 rotate-90" />
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center w-full max-w-xs">
                        <img src={Step3} alt="Chat" className="w-44 md:mb-10 mb-5" />
                        <button className="px-5 py-1 mb-5 text-primary-text text-xl font-light border border-secondary-text/20 rounded-lg bg-step-btn">
                            Chat
                        </button>
                        <p className="text-primary-text text-lg font-light">
                            Ask complex questions <br /> and get answers.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;