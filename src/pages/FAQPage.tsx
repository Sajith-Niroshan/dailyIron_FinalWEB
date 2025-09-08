import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { usePageMetadata } from '../hooks/usePageMetadata';

interface FAQPageProps {
}

const FAQPage: React.FC<FAQPageProps> = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [showAllFaqs, setShowAllFaqs] = useState(true); // Show all FAQs by default on dedicated page
  const phoneNumber = '(778) 743-7737';

  usePageMetadata({
    title: 'FAQ | Frequently Asked Questions - Daily Ironing Service',
    description: 'Get answers to common questions about Daily Ironing Service. Learn about pricing, pickup & delivery, service areas, and our professional ironing process.',
    keywords: 'ironing service FAQ, daily ironing questions, pickup delivery questions, ironing service pricing, South Surrey ironing FAQ, Langley ironing FAQ, White Rock ironing FAQ',
    ogImage: '/Untitled (1920 x 780 px) (1).png'
  });

  const faqs = [
    {
      question: "What kind of items do you iron?",
      answer: "We specialize in hand-ironing everyday clothing and household items. This includes men's and women's shirts, blouses, pants, uniforms, dresses, skirts, and small household linens like pillowcases, tea towels, and tablecloths."
    },
    {
      question: "Do you offer folding or hanging options?",
      answer: "Yes! You can choose between:\n• Folded: Neatly folded for drawer storage\n• Hanged: Returned on hangers for closet-ready garments\n\nLet us know your preference when you place your order."
    },
    {
      question: "Do you do laundry or washing?",
      answer: "No, we are strictly an ironing-only service. All items must be clean and dry before we pick them up."
    },
    {
      question: "How does pickup and delivery work?",
      answer: "Simple and convenient:\n1. You schedule a pickup time.\n2. We collect your clean clothes from your doorstep.\n3. We hand-iron everything at our home studio.\n4. We deliver the pressed items back—folded or hanged—within 24–48 hours."
    },
    {
      question: "What areas do you serve?",
      answer: "We currently serve:\n• South Surrey\n• Surrey\n• Delta\n• Langley\n• White Rock\n\nIf you're nearby and unsure, send us a message — we may be able to help!"
    },
    {
      question: "How much does it cost?",
      answer: "Prices vary per item. You can use our Instant Quote Tool to calculate your total based on the number and type of items. No hidden fees—what you see is what you pay."
    },
    {
      question: "Is there a minimum order amount?",
      answer: "Yes, we have a $15 minimum per order to cover pickup and delivery. Orders over $35 qualify for free pickup and delivery."
    },
    {
      question: "Do you offer express or same-day service?",
      answer: "Yes! We offer limited same-day or next-day return slots at a small additional fee. Availability depends on our current schedule — just ask when you book!"
    },
    {
      question: "Can I schedule weekly pickups?",
      answer: "Absolutely. We offer recurring weekly or bi-weekly pickups for busy households and professionals. Contact us to set up a regular schedule."
    },
    {
      question: "How do I pay?",
      answer: "We accept:\n• E-transfer\n• Credit/debit card (online)\n• Cash on delivery (optional)\n\nYou'll receive an invoice or confirmation with your quote."
    },
    {
      question: "What if I need to reschedule my pickup or delivery?",
      answer: "No problem! Contact us at least 2 hours before your scheduled time to reschedule without any fees. We understand that plans can change."
    },
    {
      question: "Do you provide garment bags or protective covers?",
      answer: "Yes! We collect your clothes in protective garment covers to shield them from weather and dust during transport, ensuring they're handled safely from start to finish."
    },
    {
      question: "What happens if an item gets damaged?",
      answer: "While rare, if damage occurs during our care, we will compensate up to the fair market value of the item. We inspect all items before processing and note any existing damage."
    },
    {
      question: "Can you handle delicate or expensive items?",
      answer: "Absolutely! We have experience with delicate fabrics and expensive garments. Please let us know about any special care requirements when booking."
    },
    {
      question: "Do you offer bulk or commercial services?",
      answer: "Yes, we provide services for small businesses, hotels, and other commercial clients. Contact us to discuss your specific needs and volume pricing."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const formatAnswer = (answer: string) => {
    return answer.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < answer.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-8" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="container mx-auto px-4">
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 mb-6 hover:opacity-70 transition-colors"
            style={{ color: '#E87461' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500">
              <HelpCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2C3E50' }}>
              Frequently Asked Questions
            </h1>
            <p className="text-xl" style={{ color: '#2C3E50' }}>
              Everything you need to know about our ironing service
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <div className="space-y-4 mb-12">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold pr-4" style={{ color: '#2C3E50' }}>
                    {faq.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: '#E87461' }} />
                  ) : (
                    <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: '#E87461' }} />
                  )}
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-5 accordion-content">
                    <div className="border-t pt-4">
                      <p className="text-base leading-relaxed" style={{ color: '#2C3E50' }}>
                        {formatAnswer(faq.answer)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="text-center rounded-2xl p-8" style={{ backgroundColor: '#FFF8F0' }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#2C3E50' }}>
              Still Have Questions?
            </h3>
            <p className="text-lg mb-6" style={{ color: '#2C3E50' }}>
              We're here to help! Contact us directly for any additional questions about our service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${phoneNumber.replace(/\D/g, '')}`}
                className="px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Call: {phoneNumber}
              </a>
              <a
                href="mailto:hello@dailyironing.ca?subject=Question%20about%20Daily%20Ironing%20Service&body=Hi%20Daily%20Ironing%20Team,%0A%0AI%20have%20a%20question%20about%20your%20service:%0A%0A"
                className="px-6 py-3 rounded-lg font-medium border-2 text-gray-800 border-gray-800 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Email Us
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FAQPage;