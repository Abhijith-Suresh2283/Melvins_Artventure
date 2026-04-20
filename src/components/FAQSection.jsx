import React from 'react';
//follow the format of the faqs array and add the new faqs to the array
const faqs = [
  {
    question: "Do you offer both online and offline art classes?",
    answer: "No! Melvin's Artventure offers only online classes accessible worldwide currently ."
  },
  
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 px-6 bg-[#FDFBF6]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight text-black">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="group bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer"
            >
              <summary className="text-xl font-semibold text-gray-800 list-none flex justify-between items-center">
                {faq.question}
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}