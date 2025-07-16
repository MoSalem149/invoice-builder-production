// components/Landing/FAQs.tsx
import React, { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";

const FAQs: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const faqs = [
    {
      question: t("faqs.paymentMethods"),
      answer: t("faqs.paymentAnswer"),
    },
    {
      question: t("faqs.testDrives"),
      answer: t("faqs.testDrivesAnswer"),
    },
    {
      question: t("faqs.returnPolicy"),
      answer: t("faqs.returnPolicyAnswer"),
    },
    {
      question: t("faqs.vehicleHistory"),
      answer: t("faqs.vehicleHistoryAnswer"),
    },
    {
      question: t("faqs.tradeIn"),
      answer: t("faqs.tradeInAnswer"),
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold">{t("faqs.title")}</h1>
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
