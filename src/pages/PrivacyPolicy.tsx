import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, FileText } from 'lucide-react';
import { usePageMetadata } from '../hooks/usePageMetadata';

const PrivacyPolicy: React.FC = () => {
  usePageMetadata({
    title: 'Privacy Policy | Daily Ironing Service',
    description: 'Learn how Daily Ironing Service collects, uses, and protects your personal information. Our commitment to privacy and data security.',
    keywords: 'privacy policy, data protection, personal information, Daily Ironing Service'
  });

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
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2C3E50' }}>
              Privacy Policy
            </h1>
            <p className="text-xl" style={{ color: '#2C3E50' }}>
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm mt-4 opacity-70" style={{ color: '#2C3E50' }}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none blog-content">
            
            <h2>1. Information We Collect</h2>
            
            <h3>Personal Information</h3>
            <p>When you use our ironing services, we collect the following personal information:</p>
            <ul>
              <li><strong>Contact Information:</strong> Full name, email address, phone number</li>
              <li><strong>Address Information:</strong> Pickup and delivery addresses, unit numbers, postal codes</li>
              <li><strong>Service Information:</strong> Clothing items, special instructions, pickup/delivery preferences</li>
              <li><strong>Payment Information:</strong> Payment method details (processed securely through Stripe)</li>
              <li><strong>Communication Records:</strong> SMS messages, emails, and call logs related to your service</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>We may automatically collect certain information when you visit our website:</p>
            <ul>
              <li>IP address and approximate location</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Website usage patterns and preferences</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            
            <p>We use your personal information for the following purposes:</p>
            <ul>
              <li><strong>Service Delivery:</strong> Processing orders, scheduling pickups and deliveries, providing 24-hour express service</li>
              <li><strong>Communication:</strong> Sending order confirmations, pickup reminders, delivery notifications via SMS and email</li>
              <li><strong>Payment Processing:</strong> Securely processing payments through our payment processor</li>
              <li><strong>Customer Support:</strong> Responding to inquiries, resolving issues, and providing assistance</li>
              <li><strong>Service Improvement:</strong> Analyzing usage patterns to improve our services and website</li>
              <li><strong>Marketing:</strong> Sending promotional offers and service updates (with your consent)</li>
              <li><strong>Legal Compliance:</strong> Meeting legal obligations and protecting our rights</li>
            </ul>

            <h2>3. Information Sharing and Disclosure</h2>
            
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:</p>
            
            <h3>Service Providers</h3>
            <ul>
              <li><strong>Payment Processing:</strong> Stripe for secure payment processing</li>
              <li><strong>Communication Services:</strong> SMS and email service providers for notifications</li>
              <li><strong>Website Hosting:</strong> Cloud hosting providers for website operation</li>
              <li><strong>Analytics:</strong> Website analytics services to improve user experience</li>
            </ul>

            <h3>Legal Requirements</h3>
            <p>We may disclose your information when required by law or to:</p>
            <ul>
              <li>Comply with legal processes or government requests</li>
              <li>Protect our rights, property, or safety</li>
              <li>Protect the rights, property, or safety of our customers or others</li>
              <li>Investigate fraud or security issues</li>
            </ul>

            <h2>4. Data Security</h2>
            
            <p>We implement appropriate technical and organizational security measures to protect your personal information:</p>
            <ul>
              <li><strong>Encryption:</strong> All sensitive data is encrypted in transit and at rest</li>
              <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
              <li><strong>Secure Payment Processing:</strong> PCI DSS compliant payment processing through Stripe</li>
              <li><strong>Regular Security Updates:</strong> Ongoing security monitoring and updates</li>
              <li><strong>Data Backup:</strong> Regular secure backups to prevent data loss</li>
            </ul>

            <p>However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.</p>

            <h2>5. Data Retention</h2>
            
            <p>We retain your personal information for as long as necessary to:</p>
            <ul>
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Improve our services</li>
            </ul>

            <p>Typically, we retain customer information for:</p>
            <ul>
              <li><strong>Active Customers:</strong> For the duration of the service relationship</li>
              <li><strong>Inactive Customers:</strong> Up to 7 years for tax and legal compliance</li>
              <li><strong>Marketing Communications:</strong> Until you unsubscribe or withdraw consent</li>
            </ul>

            <h2>6. Your Rights and Choices</h2>
            
            <p>You have the following rights regarding your personal information:</p>
            
            <h3>Access and Correction</h3>
            <ul>
              <li>Request access to your personal information</li>
              <li>Request correction of inaccurate or incomplete information</li>
              <li>Update your contact preferences</li>
            </ul>

            <h3>Data Portability and Deletion</h3>
            <ul>
              <li>Request a copy of your personal information in a portable format</li>
              <li>Request deletion of your personal information (subject to legal requirements)</li>
            </ul>

            <h3>Communication Preferences</h3>
            <ul>
              <li>Opt out of marketing communications at any time</li>
              <li>Choose your preferred communication methods (SMS, email)</li>
              <li>Unsubscribe from promotional emails using the link provided</li>
            </ul>

            <h2>7. Cookies and Tracking Technologies</h2>
            
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Improve website functionality and user experience</li>
              <li>Provide personalized content and recommendations</li>
            </ul>

            <p>You can control cookies through your browser settings, but disabling cookies may affect website functionality.</p>

            <h2>8. Third-Party Links</h2>
            
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.</p>

            <h2>9. Children's Privacy</h2>
            
            <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.</p>

            <h2>10. International Data Transfers</h2>
            
            <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.</p>

            <h2>11. Changes to This Privacy Policy</h2>
            
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by:</p>
            <ul>
              <li>Posting the updated policy on our website</li>
              <li>Sending email notifications to registered customers</li>
              <li>Updating the "Last updated" date at the top of this policy</li>
            </ul>

            <p>Your continued use of our services after any changes constitutes acceptance of the updated Privacy Policy.</p>

            <h2>12. Contact Information</h2>
            
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
            
            <div className="bg-gray-50 p-6 rounded-lg mt-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#2C3E50' }}>Daily Ironing Service</h3>
              <div className="space-y-2" style={{ color: '#2C3E50' }}>
                <p><strong>Email:</strong> privacy@dailyironing.ca</p>
                <p><strong>Phone:</strong> (778) 743-7737</p>
                <p><strong>Address:</strong> South Surrey, BC, Canada</p>
                <p><strong>Business Hours:</strong> Monday-Friday 7:00 AM - 7:00 PM</p>
              </div>
            </div>

            <p className="mt-8 text-sm opacity-70">
              We are committed to protecting your privacy and will respond to your inquiries within 30 days.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;