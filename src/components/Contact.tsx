import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, Clock } from 'lucide-react';

interface ContactProps {
  openCallOptionModal: (phone: string) => void;
}

const Contact: React.FC<ContactProps> = ({ openCallOptionModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const phoneNumber = '(778) 743-7737';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openCallOptionModal(phoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1000);
  };

  return (
    <section className="py-16" style={{ backgroundColor: '#2C3E50' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Get in <span style={{ color: '#E87461' }}>Touch</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to experience professional ironing service? Contact us today for a free quote 
              or to schedule your first pickup.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E87461' }}>
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Phone</h4>
                      <a
                        href="#"
                        onClick={handleCallClick}
                        className="text-gray-300 hover:text-white transition-colors text-lg"
                      >
                        {phoneNumber}
                      </a>
                      <p className="text-sm text-gray-400 mt-1">Available 7 days a week</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4285F4' }}>
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Email</h4>
                      <a
                        href="mailto:hello@dailyironing.ca"
                        className="text-gray-300 hover:text-white transition-colors text-lg"
                      >
                        hello@dailyironing.ca
                      </a>
                      <p className="text-sm text-gray-400 mt-1">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F4A261' }}>
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Service Areas</h4>
                      <p className="text-gray-300 text-lg">
                        South Surrey, Surrey, Delta,<br />
                        Langley & White Rock
                      </p>
                      <p className="text-sm text-gray-400 mt-1">Free pickup & delivery</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-6 h-6" style={{ color: '#E87461' }} />
                  <h3 className="text-xl font-bold" style={{ color: '#2C3E50' }}>
                    Business Hours
                  </h3>
                </div>
                <div className="space-y-2 text-sm" style={{ color: '#2C3E50' }}>
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday:</span>
                    <span>7:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday:</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#2C3E50' }}>
                Send us a Message
              </h3>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-medium">
                      Thank you! Your message has been sent successfully.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                      style={{ borderColor: '#E5E7EB', '--tw-ring-color': '#E87461' }}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                      style={{ borderColor: '#E5E7EB', '--tw-ring-color': '#E87461' }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                    style={{ borderColor: '#E5E7EB', '--tw-ring-color': '#E87461' }}
                    placeholder="(778) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:border-transparent transition-colors resize-none"
                    style={{ borderColor: '#E5E7EB', '--tw-ring-color': '#E87461' }}
                    placeholder="Tell us about your ironing needs or ask any questions..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;