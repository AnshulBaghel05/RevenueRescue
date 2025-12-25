'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const cookieTypes = [
  {
    type: 'Essential Cookies',
    purpose: 'Required for the website to function',
    required: true,
    examples: [
      { name: 'session_id', duration: 'Session', purpose: 'Maintains your login session' },
      { name: 'csrf_token', duration: 'Session', purpose: 'Security protection against CSRF attacks' },
      { name: 'cookie_consent', duration: '1 year', purpose: 'Remembers your cookie preferences' },
    ],
  },
  {
    type: 'Functional Cookies',
    purpose: 'Enable enhanced functionality and personalization',
    required: false,
    examples: [
      { name: 'user_preferences', duration: '1 year', purpose: 'Stores your dashboard preferences' },
      { name: 'theme', duration: '1 year', purpose: 'Remembers your theme selection' },
      { name: 'language', duration: '1 year', purpose: 'Stores your language preference' },
    ],
  },
  {
    type: 'Analytics Cookies',
    purpose: 'Help us understand how visitors use our website',
    required: false,
    examples: [
      { name: '_ga', duration: '2 years', purpose: 'Google Analytics - distinguishes users' },
      { name: '_gid', duration: '24 hours', purpose: 'Google Analytics - distinguishes users' },
      { name: 'analytics_session', duration: '30 minutes', purpose: 'Tracks session duration and pages visited' },
    ],
  },
  {
    type: 'Marketing Cookies',
    purpose: 'Track your visits and show relevant ads',
    required: false,
    examples: [
      { name: 'utm_source', duration: '6 months', purpose: 'Tracks marketing campaign source' },
      { name: 'referral', duration: '30 days', purpose: 'Tracks referral source' },
    ],
  },
];

export default function CookiesPage() {
  const lastUpdated = 'December 25, 2024';
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    analytics: true,
    marketing: false,
  });

  const handleSavePreferences = () => {
    // Save cookie preferences
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
    alert('Your cookie preferences have been saved.');
  };

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
                  Cookie Policy
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
              <Card className="mb-12">
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies?</h2>
                    <p>
                      Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, keeping you logged in, and understanding how you use our service.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">How We Use Cookies</h2>
                    <p className="mb-3">We use cookies for:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Keeping you signed in to your account</li>
                      <li>Remembering your preferences and settings</li>
                      <li>Understanding how you use RevenueRescue</li>
                      <li>Improving our service and user experience</li>
                      <li>Analyzing traffic and usage patterns</li>
                      <li>Providing personalized content and features</li>
                      <li>Measuring the effectiveness of our marketing</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Cookie Types */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6">Types of Cookies We Use</h2>
                <div className="space-y-6">
                  {cookieTypes.map((category, idx) => (
                    <Card key={idx}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{category.type}</h3>
                          <p className="text-gray-400">{category.purpose}</p>
                        </div>
                        {category.required && (
                          <Badge variant="info" size="sm">
                            Required
                          </Badge>
                        )}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="text-left text-gray-400 font-semibold pb-3 pr-4">Cookie Name</th>
                              <th className="text-left text-gray-400 font-semibold pb-3 pr-4">Duration</th>
                              <th className="text-left text-gray-400 font-semibold pb-3">Purpose</th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.examples.map((cookie, cookieIdx) => (
                              <tr key={cookieIdx} className="border-b border-gray-800 last:border-0">
                                <td className="py-3 pr-4 text-white font-mono text-xs">{cookie.name}</td>
                                <td className="py-3 pr-4 text-gray-400">{cookie.duration}</td>
                                <td className="py-3 text-gray-400">{cookie.purpose}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Cookie Preferences */}
              <Card className="mb-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <h2 className="text-2xl font-bold text-white mb-6">Manage Your Cookie Preferences</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Essential Cookies</h3>
                      <p className="text-gray-400 text-sm">Required for the website to function</p>
                    </div>
                    <Badge variant="neutral">Always Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Functional Cookies</h3>
                      <p className="text-gray-400 text-sm">Enhanced functionality and personalization</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Analytics Cookies</h3>
                      <p className="text-gray-400 text-sm">Help us improve our service</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div>
                      <h3 className="text-white font-semibold mb-1">Marketing Cookies</h3>
                      <p className="text-gray-400 text-sm">Personalized ads and campaigns</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSavePreferences}
                  className="w-full px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-glow-primary"
                >
                  Save Preferences
                </button>
              </Card>

              {/* Additional Info */}
              <Card>
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Third-Party Cookies</h2>
                    <p className="mb-3">
                      We use services from trusted third parties that may set their own cookies:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Google Analytics:</strong> Website analytics and usage tracking</li>
                      <li><strong>Shopify:</strong> E-commerce platform integration</li>
                      <li><strong>Razorpay:</strong> Payment processing</li>
                    </ul>
                    <p className="mt-3">
                      These third parties have their own privacy policies. We recommend reviewing them.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Managing Cookies in Your Browser</h2>
                    <p className="mb-3">
                      You can control cookies through your browser settings. Here's how:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                      <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                      <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                      <li><strong>Edge:</strong> Settings → Privacy → Cookies</li>
                    </ul>
                    <p className="mt-3">
                      Note: Disabling essential cookies may affect website functionality.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Do Not Track</h2>
                    <p>
                      We respect Do Not Track (DNT) signals. When DNT is enabled, we will not track your browsing for advertising purposes. However, essential cookies are still required for the service to function.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Updates to This Policy</h2>
                    <p>
                      We may update this Cookie Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting a notice on our website or via email.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                    <p>
                      Questions about our use of cookies? Contact us at <a href="mailto:privacy@revenuerescue.com" className="text-primary hover:text-primary-light">privacy@revenuerescue.com</a>
                    </p>
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
