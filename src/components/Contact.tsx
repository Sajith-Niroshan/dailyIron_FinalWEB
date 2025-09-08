import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, MessageSquare } from 'lucide-react';

interface ContactProps {
  openCallOptionModal: (phone: string) => void;
}

const Contact: React.FC<ContactProps> = ({ openCallOptionModal }) => {
  const phoneNumber = '(778) 743-7737';

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Always show modal for this button, as it's a primary CTA
    openCallOptionModal(phoneNumber);
  };

  return (
    <section className="py-16 text-white" style={{ backgroundColor: '#2C3E50' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get Started Today</h2>
            <p className="text-xl opacity-80">
              Contact us to schedule your first pickup or ask any questions
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-animation">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:scale-110 transition-transform duration-300">
                  <Phone className="w-8 h-8 text-white icon-hover" />
                </div>
                <h4 className="font-semibold mb-2">Phone</h4>
                <p className="opacity-80 mb-1">{phoneNumber}</p>
                <p className="text-sm opacity-60">Call or text anytime</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:scale-110 transition-transform duration-300">
                  <Mail className="w-8 h-8 text-white icon-hover" />
                </div>
                <h4 className="font-semibold mb-2">Email</h4>
                <p className="opacity-80 mb-1">hello@dailyironing.ca</p>
                <p className="text-sm opacity-60">We respond within 2 hours</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white icon-hover" />
                </div>
                <h4 className="font-semibold mb-2">Business Hours</h4>
                <div className="opacity-80 text-sm">
                  <p>Mon-Fri: 7:00 AM - 7:00 PM</p>
                  <p>Sat: 8:00 AM - 6:00 PM</p>
                  <p>Sun: 10:00 AM - 4:00 PM</p>
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-8 h-8 text-white icon-hover" />
                </div>
                <h4 className="font-semibold mb-2">Quick Response</h4>
                <p className="opacity-80 mb-1">Text us for fastest response</p>
                <p className="text-sm opacity-60">Usually reply within 30 minutes</p>
              </div>
            </div>

            <div className="mt-12 text-center rounded-2xl p-8" style={{ backgroundColor: '#1a252f' }}>
              <h3 className="text-2xl font-bold mb-4">
                Ready to Get Started?
              </h3>
              <p className="opacity-90 mb-6 text-lg">
                Call us at <strong>{phoneNumber}</strong> or email <strong>hello@dailyironing.ca</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#"
                  onClick={handleCallClick}
                  className="px-8 py-3 rounded-lg font-medium button-hover-effect text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Call: {phoneNumber}
                </a>
                <a
                  href="mailto:hello@dailyironing.ca"
                  className="px-8 py-3 rounded-lg font-medium border-2 border-white text-white hover:bg-white hover:text-gray-800 transition-all duration-300 button-hover-effect hover:scale-105"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;