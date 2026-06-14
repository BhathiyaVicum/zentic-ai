import { useState } from "react";

const FAQ = () => {

    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How is this different from ChatGPT?",
            answer: "ChatGPT doesn't know YOUR documents. ZenticAI only answers from your uploaded files with page citations. You get verified answers from your own knowledge base."
        },
        {
            question: "What file formats do you support?",
            answer: "Currently we support PDF. DOCX, TXT, Markdown files and EPUB support coming soon. Maximum file size is 50MB per document."
        },
        {
            question: "Is my data private and secure?",
            answer: "Yes! Your documents are encrypted at rest and in transit. We never train our AI on your data. You can delete everything anytime."
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Absolutely. No questions asked. You can cancel from your dashboard and your data will be available until the end of your billing period."
        },
        {
            question: "Do you offer student discounts?",
            answer: "Yes! Students get 50% off Pro plan with valid .edu email. Contact support with your student ID."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="relative py-24 px-6">

            <div className="max-w-7xl mx-auto w-full">

                <div className="text-center max-w-3xl mx-auto">
                    <button className="px-5 py-1 text-secondary-text text-sm font-light border pointer-events-none border-secondary-text/20 rounded-full bg-brand-muted/30">
                        FAQ
                    </button>

                    <h2 className="text-3xl md:text-4xl font-semibold mt-2 md:mt-4 mb-10 md:mb-3 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        Common Questions
                    </h2>
                </div>

                <div className="space-y-3 mt-1 md:mt-16">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-b from-brand-muted/30 to-brand-dark/20 border border-brand-light/10 rounded-2xl overflow-hidden hover:border-brand-light/30 transition-all duration-300"
                        >
                            {/* Question Button */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center px-6 py-5 text-left"
                            >
                                <span className="text-lg md:text-xl font-normal text-primary-text">
                                    {faq.question}
                                </span>
                                <span className="text-secondary-text text-2xl ml-4">
                                    {openIndex === index ? "−" : "+"}
                                </span>
                            </button>

                            {/* Answer */}
                            <div className={`transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 pb-5" : "max-h-0"} overflow-hidden`}>
                                <p className="text-gray-100 font-normal text-left px-6 pb-4 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQ;