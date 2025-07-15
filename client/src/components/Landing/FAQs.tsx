// components/Landing/FAQs.tsx
import React, { useState } from "react";

const FAQs: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept cash, bank transfers, and all major credit cards. Financing options are also available through our partner banks.",
    },
    {
      question: "Do you offer test drives?",
      answer:
        "Yes, we encourage all potential buyers to test drive vehicles. Simply contact us to schedule an appointment.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 7-day money-back guarantee on all vehicles, subject to certain conditions and mileage limits.",
    },
    {
      question: "Do you provide vehicle history reports?",
      answer:
        "Yes, we provide free Carfax reports for all pre-owned vehicles in our inventory.",
    },
    {
      question: "Can I trade in my current vehicle?",
      answer:
        "Absolutely! We offer competitive trade-in valuations. Bring your vehicle for an appraisal or send us details online.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 last:border-b-0">
            <button
              className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50"
              onClick={() => toggleFAQ(index)}
            >
              <h2 className="text-lg font-semibold">{faq.question}</h2>
              <span className="text-gray-500">
                {activeIndex === index ? "−" : "+"}
              </span>
            </button>
            {activeIndex === index && (
              <div className="p-6 pt-0 text-gray-600">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
