"use client";

import { useState } from "react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <div key={faq.id} className="border-b border-zinc-150 pb-3 last:border-b-0">
          <button
            type="button"
            onClick={() => toggleFaq(faq.id)}
            className="w-full text-left font-bold text-zinc-800 hover:text-[#E61E32] flex justify-between items-center py-2 text-sm transition-colors cursor-pointer"
          >
            <span>{faq.question}</span>
            <svg
              className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                expandedId === faq.id ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {expandedId === faq.id && (
            <p className="text-zinc-600 font-normal mt-2 leading-relaxed bg-zinc-50 p-4 rounded-lg text-xs border border-zinc-100 animate-in slide-in-from-top-1 duration-150">
              {faq.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
