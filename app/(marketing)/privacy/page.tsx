import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

export default function PrivacyPage() {
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
                  Privacy Policy
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
                    <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>
                        RevenueRescue ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                      </p>
                      <p>
                        By using RevenueRescue, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, do not use our service.
                      </p>
                    </div>
                  </div>

                  {/* Information We Collect */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                    <div className="text-gray-300 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">2.1 Personal Information</h3>
                        <p className="mb-2">We collect the following personal information:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Name and email address (for account creation)</li>
                          <li>Shopify store URL and credentials</li>
                          <li>Payment information (processed securely by Razorpay)</li>
                          <li>Communication preferences</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">2.2 Store Data</h3>
                        <p className="mb-2">When you authorize our app, we collect:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Store performance metrics (page load times, conversion rates)</li>
                          <li>Product and checkout data</li>
                          <li>Customer behavior analytics (anonymized)</li>
                          <li>Technical performance data</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">2.3 Usage Data</h3>
                        <p className="mb-2">We automatically collect:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>IP address and browser type</li>
                          <li>Device information</li>
                          <li>Pages visited and features used</li>
                          <li>Time spent on the service</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* How We Use Your Information */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                    <div className="text-gray-300 space-y-2">
                      <p>We use collected information for:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Providing and maintaining our service</li>
                        <li>Generating store audits and insights</li>
                        <li>Processing payments and subscriptions</li>
                        <li>Sending service updates and notifications</li>
                        <li>Improving our algorithms and features</li>
                        <li>Detecting and preventing fraud</li>
                        <li>Complying with legal obligations</li>
                        <li>Marketing (with your consent, opt-out available)</li>
                      </ul>
                    </div>
                  </div>

                  {/* Data Sharing */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Disclosure</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>We may share your information with:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Service Providers:</strong> Shopify (store data), Razorpay (payments), AWS (hosting)</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        <li><strong>Business Transfers:</strong> In case of merger, sale, or acquisition</li>
                        <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
                      </ul>
                      <p className="mt-3">
                        <strong>We NEVER sell your personal data to third parties.</strong>
                      </p>
                    </div>
                  </div>

                  {/* Data Security */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>We implement industry-standard security measures:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>SSL/TLS encryption for data in transit</li>
                        <li>AES-256 encryption for data at rest</li>
                        <li>Regular security audits and penetration testing</li>
                        <li>Restricted access to personal data</li>
                        <li>Secure cloud infrastructure (AWS)</li>
                        <li>Regular backups and disaster recovery</li>
                      </ul>
                      <p className="mt-3">
                        However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                      </p>
                    </div>
                  </div>

                  {/* Data Retention */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>We retain your data as follows:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Account Data:</strong> Until you delete your account, plus 30 days</li>
                        <li><strong>Audit Data:</strong> For the duration of your subscription, plus 90 days</li>
                        <li><strong>Payment Records:</strong> 7 years (legal requirement)</li>
                        <li><strong>Marketing Data:</strong> Until you unsubscribe</li>
                      </ul>
                      <p className="mt-3">
                        You can request deletion of your data at any time by contacting support@revenuerescue.com.
                      </p>
                    </div>
                  </div>

                  {/* Your Rights (GDPR) */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">7. Your Privacy Rights</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>Under GDPR and other privacy laws, you have the right to:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                        <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
                        <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                        <li><strong>Restriction:</strong> Limit how we process your data</li>
                        <li><strong>Objection:</strong> Object to processing for marketing purposes</li>
                        <li><strong>Withdraw Consent:</strong> Opt-out of data collection at any time</li>
                      </ul>
                      <p className="mt-3">
                        To exercise these rights, email <a href="mailto:privacy@revenuerescue.com" className="text-primary hover:text-primary-light">privacy@revenuerescue.com</a> or visit our <a href="/gdpr" className="text-primary hover:text-primary-light">GDPR page</a>.
                      </p>
                    </div>
                  </div>

                  {/* Cookies */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>We use cookies and similar technologies to:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Maintain your session and preferences</li>
                        <li>Analyze usage patterns</li>
                        <li>Improve user experience</li>
                        <li>Provide personalized content</li>
                      </ul>
                      <p className="mt-3">
                        You can control cookies through your browser settings. See our <a href="/cookies" className="text-primary hover:text-primary-light">Cookie Policy</a> for details.
                      </p>
                    </div>
                  </div>

                  {/* International Transfers */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>
                        Your data may be transferred to and processed in countries outside your own. We ensure appropriate safeguards are in place, including:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Standard Contractual Clauses (SCCs) approved by the EU</li>
                        <li>Data Processing Agreements with all vendors</li>
                        <li>Compliance with Privacy Shield principles (where applicable)</li>
                      </ul>
                    </div>
                  </div>

                  {/* Children's Privacy */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>
                        RevenueRescue is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.
                      </p>
                    </div>
                  </div>

                  {/* Changes to Policy */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Policy</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>
                        We may update this Privacy Policy from time to time. We will notify you of significant changes via:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Email notification</li>
                        <li>Prominent notice on our website</li>
                        <li>In-app notification</li>
                      </ul>
                      <p className="mt-3">
                        Continued use of the service after changes constitutes acceptance of the updated policy.
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
                    <div className="text-gray-300 space-y-3">
                      <p>For privacy-related questions or concerns:</p>
                      <ul className="list-none space-y-2 mt-3">
                        <li><strong>Email:</strong> <a href="mailto:privacy@revenuerescue.com" className="text-primary hover:text-primary-light">privacy@revenuerescue.com</a></li>
                        <li><strong>Mail:</strong> RevenueRescue, 123 Market Street, Suite 400, San Francisco, CA 94103</li>
                        <li><strong>GDPR Requests:</strong> <a href="/gdpr" className="text-primary hover:text-primary-light">/gdpr</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Links */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <Card hover className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Terms of Service</h3>
                  <a href="/terms" className="text-primary hover:text-primary-light">
                    Read our terms →
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
