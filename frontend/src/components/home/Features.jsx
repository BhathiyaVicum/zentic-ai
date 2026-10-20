import ImgFeat1 from "../../assets/feat-1.png";
import ImgFeat2 from "../../assets/feat-2.png";
import ImgFeat3 from "../../assets/feat-3.png";

const Features = () => {
    const features = [
        {
            id: 1,
            icon: ImgFeat1,
            title: "Vector Search",
            description: "Finds semantic meaning, not just keywords. Understands context like a human.",
            tag: "Search"
        },
        {
            id: 2,
            icon: ImgFeat2,
            title: "Page Citations",
            description: "Every answer includes exact page numbers. Verify sources instantly.",
            tag: "Accuracy"
        },
        {
            id: 3,
            icon: ImgFeat3,
            title: "Cross-Document Chat",
            description: "Upload multiple PDFs and ask questions across all of them simultaneously.",
            tag: "Multi-doc"
        }
    ];

    return (
        <section id="features" className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto w-full">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <button className="px-5 py-1 text-secondary-text text-sm font-light border pointer-events-none border-secondary-text/20 rounded-full bg-brand-muted/30">
                        Features
                    </button>
                    
                    <h2 className="text-3xl md:text-4xl font-semibold mt-2 md:mt-4 mb-10 md:mb-3 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        Core Capabilities
                    </h2>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-1 md:mt-20">
                    {features.map((feature) => (
                        <div 
                            key={feature.id}
                            className=" flex flex-col items-center text-center group bg-gradient-to-b from-brand-muted/50 to-brand-dark/30 border border-brand-light/10 rounded-2xl px-10 py-16 hover:border-brand-light/30 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Icon */}
                            <div className="w-28 h-28 mb-6">
                                <img src={feature.icon} alt={feature.title} className="w-full h-full object-contain" />
                            </div>
                            
                            {/* Title */}
                            <h3 className="text-2xl font-medium text-primary-text mb-3">
                                {feature.title}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-secondary-text text-md font-light leading-relaxed mb-5">
                                {feature.description}
                            </p>
                            
                            {/* Tag */}
                            <button className="px-4 py-1.5 text-primary-text text-sm font-light border border-secondary-text/20 rounded-full bg-brand-muted/30 hover:bg-secondary-text/10 transition">
                                {feature.tag}
                            </button>
                        </div>
                    ))}
                </div>
                
            </div>
        </section>
    );
}

export default Features;