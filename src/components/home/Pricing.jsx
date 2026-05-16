const Pricing = () => {

    return (
        <section id="pricing" className="relative py-24 px-6">
            {/* Changed: max-w-7xl mx-auto (same as Features) */}
            <div className="max-w-7xl mx-auto w-full">

                {/* Section Header */}
                {/* Changed: max-w-3xl (same as Features) */}
                <div className="text-center max-w-3xl mx-auto">
                    <button className="px-5 py-1 text-secondary-text text-sm font-light border pointer-events-none border-secondary-text/20 rounded-full bg-brand-muted/30">
                        Pricing
                    </button>

                    <h2 className="text-3xl md:text-4xl font-semibold mt-2 md:mt-4 mb-10 md:mb-3 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        Plans for every researcher.
                    </h2>
                </div>

                {/* Pricing Grid*/}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-1 md:mt-20">
                    
                    {/* Card 1*/}
                    <div className="flex flex-col bg-gradient-to-b from-brand-muted/50 to-brand-dark/30 border border-brand-light/10 rounded-2xl px-6 py-6 md:min-h-[430px] hover:border-brand-light/30 transition-all duration-300 hover:-translate-y-1">
                        <h3 className="text-2xl font-medium text-primary-text mb-3">
                            Free Plan
                        </h3>
                        <p className="text-3xl font-bold text-secondary-text mb-6">$0<span className="text-sm text-gray-400">/mo</span></p>
                        <ul className="text-left space-y-2 mb-6 flex-grow">
                            <li className="text-gray-300">✓ 3 Documents</li>
                            <li className="text-gray-300">✓ 50 Queries/mo</li>
                            <li className="text-gray-300">✓ Basic Search</li>
                        </ul>
                        <button className="w-full bg-secondary-text px-3 py-2 rounded text-brand-muted font-semibold hover:opacity-80 transition">
                            Get Started
                        </button>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col bg-gradient-to-b from-brand-muted/50 to-brand-dark/30 border-2 border-secondary-text rounded-2xl px-6 py-6 md:min-h-[430px] hover:border-brand-light/30 transition-all duration-300 hover:-translate-y-1 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary-text text-brand-dark px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                            Most Popular
                        </div>
                        <h3 className="text-2xl font-medium text-primary-text mb-3 mt-2">
                            Pro Plan
                        </h3>
                        <p className="text-3xl font-bold text-secondary-text mb-6">$19<span className="text-sm text-gray-400">/mo</span></p>
                        <ul className="text-left space-y-2 mb-6 flex-grow">
                            <li className="text-gray-300">✓ 50 Documents</li>
                            <li className="text-gray-300">✓ 1000 Queries/mo</li>
                            <li className="text-gray-300">✓ Advanced Search</li>
                            <li className="text-gray-300">✓ Page Citations</li>
                        </ul>
                        <button className="w-full bg-btn-primary px-3 py-2 rounded text-primary-text font-semibold hover:opacity-80 transition">
                            Go Pro
                        </button>
                    </div>

                    {/* Card 3*/}
                    <div className="flex flex-col bg-gradient-to-b from-brand-muted/50 to-brand-dark/30 border border-brand-light/10 rounded-2xl px-6 py-6 md:min-h-[430px] hover:border-brand-light/30 transition-all duration-300 hover:-translate-y-1">
                        <h3 className="text-2xl font-medium text-primary-text mb-3">
                            Team Plan
                        </h3>
                        <p className="text-3xl font-bold text-secondary-text mb-6">$49<span className="text-sm text-gray-400">/mo</span></p>
                        <ul className="text-left space-y-2 mb-6 flex-grow">
                            <li className="text-gray-300">✓ Unlimited Documents</li>
                            <li className="text-gray-300">✓ Unlimited Queries</li>
                            <li className="text-gray-300">✓ Team Collaboration</li>
                            <li className="text-gray-300">✓ Priority Support</li>
                        </ul>
                        <button className="w-full bg-secondary-text px-3 py-2 rounded text-brand-muted font-semibold hover:opacity-80 transition">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Pricing;