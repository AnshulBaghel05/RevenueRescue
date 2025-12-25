import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

export default function TermsPage() {
  const lastUpdated = 'December 25, 2024';

  return (
    <>
      <Header />
      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="info" size="lg" className="mb-6">
                Legal
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Terms of Service
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="prose prose-invert max-w-none">
                <div className="space-y-8">
                  {/* Introduction */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>
                        These Terms of Service ("Terms") govern your access to and use of RevenueRescue's services, website, and applications (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
                      </p>
                      <p>
                        If you do not agree to these Terms, you may not access or use the Service. We reserve the right to modify these Terms at any time.
                      </p>
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Eligibility</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>You must meet the following requirements to use our Service:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Be at least 18 years of age</li>
                        <li>Have the legal capacity to enter into binding contracts</li>
                        <li>Operate a legitimate Shopify store</li>
                        <li>Not be prohibited from using the Service under applicable laws</li>
                        <li>Provide accurate and complete registration information</li>
                      </ul>
                    </div>
                  </div>

                  {/* Account Registration */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Account Registration and Security</h2>
                    <div className="text-gray-300 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">3.1 Account Creation</h3>
                        <p>
                          To use RevenueRescue, you must create an account by providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">3.2 Account Security</h3>
                        <p>You agree to:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Use a strong, unique password</li>
                          <li>Notify us immediately of any unauthorized access</li>
                          <li>Not share your account with others</li>
                          <li>Be responsible for all activities under your account</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Subscription and Billing */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Subscription and Billing</h2>
                    <div className="text-gray-300 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">4.1 Subscription Plans</h3>
                        <p>
                          RevenueRescue offers Free, Starter, and Pro subscription plans. Features and audit limits vary by plan. Current pricing is available at <a href="/pricing" className="text-primary hover:text-primary-light">/pricing</a>.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">4.2 Billing</h3>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Subscriptions are billed monthly in advance</li>
                          <li>All payments are processed through Razorpay</li>
                          <li>Prices are in USD unless otherwise stated</li>
                          <li>You authorize automatic recurring charges</li>
                          <li>Failed payments may result in service suspension</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">4.3 Refunds</h3>
                        <p>
                          We offer a 14-day money-back guarantee for first-time subscribers. After 14 days, all payments are non-refundable. Pro-rated refunds are not provided for mid-cycle cancellations.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">4.4 Cancellation</h3>
                        <p>
                          You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period. You retain access until then.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Acceptable Use */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Acceptable Use Policy</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>You agree NOT to:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Use the Service for any illegal purpose</li>
                        <li>Violate any laws or regulations</li>
                        <li>Infringe on intellectual property rights</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                        <li>Reverse engineer, decompile, or disassemble the Service</li>
                        <li>Use automated systems to scrape or data mine</li>
                        <li>Resell or redistribute the Service without authorization</li>
                        <li>Impersonate others or provide false information</li>
                        <li>Interfere with or disrupt the Service</li>
                        <li>Upload malicious code, viruses, or malware</li>
                      </ul>
                    </div>
                  </div>

                  {/* Intellectual Property */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property Rights</h2>
                    <div className="text-gray-300 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">6.1 Our IP</h3>
                        <p>
                          The Service, including all content, features, functionality, software, and branding, is owned by RevenueRescue and protected by copyright, trademark, and other intellectual property laws.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">6.2 Your Data</h3>
                        <p>
                          You retain all rights to your store data. By using the Service, you grant us a limited license to process your data solely for providing the Service. We do not claim ownership of your data.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">6.3 License to Use</h3>
                        <p>
                          We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your internal business purposes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data and Privacy */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">7. Data and Privacy</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>
                        Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to our collection and use of data as described in our <a href="/privacy" className="text-primary hover:text-primary-light">Privacy Policy</a>.
                      </p>
                      <p>
                        We comply with GDPR, CCPA, and other applicable privacy laws. You have rights regarding your data. See our <a href="/gdpr" className="text-primary hover:text-primary-light">GDPR page</a> for details.
                      </p>
                    </div>
                  </div>

                  {/* Warranties and Disclaimers */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">8. Warranties and Disclaimers</h2>
                    <div className="text-gray-300 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">8.1 Service Availability</h3>
                        <p>
                          We strive for 99.9% uptime but make no guarantees. The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">8.2 No Guarantee of Results</h3>
                        <p>
                          While we provide actionable insights, we do not guarantee specific revenue increases or business outcomes. Results depend on implementation and other factors beyond our control.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">8.3 Disclaimer of Warranties</h3>
                        <p>
                          WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Limitation of Liability */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, REVENUERESCUE SHALL NOT BE LIABLE FOR:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Indirect, incidental, special, or consequential damages</li>
                        <li>Loss of profits, revenue, data, or business opportunities</li>
                        <li>Damages resulting from your use or inability to use the Service</li>
                        <li>Any third-party content or actions</li>
                      </ul>
                      <p className="mt-3">
                        Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
                      </p>
                    </div>
                  </div>

                  {/* Indemnification */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>
                        You agree to indemnify and hold harmless RevenueRescue, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Your use of the Service</li>
                        <li>Your violation of these Terms</li>
                        <li>Your violation of any laws or third-party rights</li>
                        <li>Your store data or content</li>
                      </ul>
                    </div>
                  </div>

                  {/* Termination */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>
                        We may suspend or terminate your access to the Service at any time, with or without cause or notice, including for:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Violation of these Terms</li>
                        <li>Non-payment of fees</li>
                        <li>Fraudulent or illegal activity</li>
                        <li>Extended periods of inactivity</li>
                      </ul>
                      <p className="mt-3">
                        Upon termination, your right to use the Service immediately ceases. We may delete your data after 30 days.
                      </p>
                    </div>
                  </div>

                  {/* Governing Law */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law and Dispute Resolution</h2>
                    <div className="text-gray-300 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">12.1 Governing Law</h3>
                        <p>
                          These Terms are governed by the laws of the State of California, United States, without regard to conflict of law principles.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">12.2 Dispute Resolution</h3>
                        <p>
                          Any disputes shall be resolved through binding arbitration in San Francisco, California, except for claims of intellectual property infringement.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Miscellaneous */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">13. Miscellaneous</h2>
                    <div className="text-gray-300 space-y-3">
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and RevenueRescue</li>
                        <li><strong>Severability:</strong> If any provision is found unenforceable, the rest remains in effect</li>
                        <li><strong>Waiver:</strong> Failure to enforce any right does not waive that right</li>
                        <li><strong>Assignment:</strong> You may not assign these Terms. We may assign them without notice</li>
                        <li><strong>Force Majeure:</strong> We are not liable for delays due to circumstances beyond our control</li>
                      </ul>
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>For questions about these Terms, contact us at:</p>
                      <ul className="list-none space-y-2 mt-3">
                        <li><strong>Email:</strong> <a href="mailto:legal@revenuerescue.com" className="text-primary hover:text-primary-light">legal@revenuerescue.com</a></li>
                        <li><strong>Mail:</strong> RevenueRescue, 123 Market Street, Suite 400, San Francisco, CA 94103</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Links */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hover className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Privacy Policy</h3>
                  <a href="/privacy" className="text-primary hover:text-primary-light">
                    Read privacy policy →
                  </a>
                </Card>
                <Card hover className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Cookie Policy</h3>
                  <a href="/cookies" className="text-primary hover:text-primary-light">
                    Learn about cookies →
                  </a>
                </Card>
                <Card hover className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">GDPR Rights</h3>
                  <a href="/gdpr" className="text-primary hover:text-primary-light">
                    Exercise your rights →
                  </a>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
