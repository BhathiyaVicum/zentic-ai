import heroImg from "../../assets/hero-img.png";
import heroImgSm from "../../assets/hero-img-sm.png"

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center px-6 pt-32">
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

                    <button className="mt-6 px-5 py-2 text-lg font-normal bg-btn-primary rounded-xl text-primary-text hover:opacity-80 transition duration-300 shadow-lg">
                        Get Started For Free
                    </button>
                </div>

                <div className="mt-2 flex justify-center">
                    <div className="relative">
                        <img src={heroImg} className="w-full max-w-3xl mx-auto hidden lg:inline"
                        />
                        <img src={heroImgSm} className="w-full  mx-auto md:hidden" alt="" />
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Hero;