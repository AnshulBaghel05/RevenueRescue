import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/audits',
    description: 'List all audits for authenticated user',
    auth: true,
  },
  {
    method: 'POST',
    path: '/api/v1/audits',
    description: 'Create a new audit',
    auth: true,
  },
  {
    method: 'GET',
    path: '/api/v1/audits/:id',
    description: 'Get detailed audit results',
    auth: true,
  },
  {
    method: 'GET',
    path: '/api/v1/stats',
    description: 'Get account statistics',
    auth: true,
  },
  {
    method: 'POST',
    path: '/api/v1/webhooks',
    description: 'Configure webhook endpoints',
    auth: true,
  },
];

const rateLimits = [
  { plan: 'Free', requests: '100/hour', burst: '20/min' },
  { plan: 'Starter', requests: '500/hour', burst: '50/min' },
  { plan: 'Pro', requests: '2,000/hour', burst: '100/min' },
];

const features = [
  {
    title: 'RESTful API',
    icon: '🔌',
    description: 'Clean, predictable REST endpoints with JSON responses',
  },
  {
    title: 'API Keys',
    icon: '🔑',
    description: 'Secure authentication with API key management',
  },
  {
    title: 'Rate Limiting',
    icon: '⏱️',
    description: 'Fair usage limits that scale with your plan',
  },
  {
    title: 'Webhooks',
    icon: '📡',
    description: 'Real-time notifications for audit completion',
  },
  {
    title: 'Documentation',
    icon: '📚',
    description: 'Comprehensive guides and code examples',
  },
  {
    title: 'CORS Support',
    icon: '🌐',
    description: 'Build client-side applications with ease',
  },
];

export default function APIInfoPage() {
  return (
    <>
      <Header />
      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="info" size="lg" className="mb-6">
                API
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  RevenueRescue API
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Integrate RevenueRescue audits into your workflow with our powerful REST API
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/docs"
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-glow-primary"
                >
                  Read Documentation
                </a>
                <a
                  href="/signup"
                  className="px-8 py-4 border-2 border-gray-700 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-lg transition-all"
                >
                  Get API Key
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">API Features</h2>
                <p className="text-gray-400">Everything you need to build powerful integrations</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, idx) => (
                  <Card key={idx} hover>
                    <div className="text-4xl mb-3">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-20 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Quick Start</h2>
                <p className="text-gray-400">Get started with the API in minutes</p>
              </div>

              <div className="space-y-6">
                <Card>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">Get Your API Key</h3>
                      <p className="text-gray-400 mb-3">
                        Sign up or log in to your account and navigate to Settings → API Keys to generate a new key.
                      </p>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 font-mono text-sm text-gray-300">
                        Settings → API Keys → Generate New Key
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">Make Your First Request</h3>
                      <p className="text-gray-400 mb-3">
                        Use your API key to authenticate requests. Include it in the Authorization header.
                      </p>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 overflow-x-auto">
                        <pre className="font-mono text-sm text-gray-300">
{`curl -X GET https://api.revenuerescue.com/v1/audits \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">Handle the Response</h3>
                      <p className="text-gray-400 mb-3">
                        All responses are in JSON format with consistent structure.
                      </p>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 overflow-x-auto">
                        <pre className="font-mono text-sm text-gray-300">
{`{
  "success": true,
  "data": {
    "audits": [...],
    "total": 42
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">API Endpoints</h2>
                <p className="text-gray-400">Core endpoints for common operations</p>
              </div>

              <div className="space-y-4">
                {endpoints.map((endpoint, idx) => (
                  <Card key={idx} hover>
                    <div className="flex items-start gap-4">
                      <Badge
                        variant={
                          endpoint.method === 'GET'
                            ? 'info'
                            : endpoint.method === 'POST'
                            ? 'success'
                            : 'warning'
                        }
                        size="sm"
                        className="flex-shrink-0"
                      >
                        {endpoint.method}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <code className="text-white font-mono text-sm">{endpoint.path}</code>
                          {endpoint.auth && (
                            <Badge variant="neutral" size="sm">
                              Auth Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{endpoint.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <a
                  href="/docs"
                  className="text-primary hover:text-primary-light font-semibold"
                >
                  View Complete API Reference →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="py-20 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Rate Limits</h2>
                <p className="text-gray-400">Fair usage limits by subscription plan</p>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left text-gray-400 font-semibold pb-4 pr-4">Plan</th>
                        <th className="text-left text-gray-400 font-semibold pb-4 pr-4">Hourly Limit</th>
                        <th className="text-left text-gray-400 font-semibold pb-4">Burst Limit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rateLimits.map((limit, idx) => (
                        <tr key={idx} className="border-b border-gray-800 last:border-0">
                          <td className="py-4 pr-4">
                            <Badge variant={limit.plan === 'Pro' ? 'success' : 'neutral'}>
                              {limit.plan}
                            </Badge>
                          </td>
                          <td className="py-4 pr-4 text-white font-semibold">{limit.requests}</td>
                          <td className="py-4 text-gray-400">{limit.burst}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    <strong className="text-white">Rate Limit Headers:</strong> Every API response includes
                    <code className="mx-1 px-2 py-1 bg-gray-900 rounded text-xs">X-RateLimit-Remaining</code>
                    and
                    <code className="mx-1 px-2 py-1 bg-gray-900 rounded text-xs">X-RateLimit-Reset</code>
                    headers to help you track your usage.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Webhooks */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Webhooks</h2>
                <p className="text-gray-400">Get real-time notifications when audits complete</p>
              </div>

              <Card className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">How Webhooks Work</h3>
                <div className="space-y-3 text-gray-300">
                  <p>
                    Configure a webhook URL in your account settings to receive POST requests when events occur.
                  </p>
                  <p>
                    We'll send a JSON payload to your endpoint with details about the event.
                  </p>
                </div>

                <div className="mt-6 bg-gray-900 p-4 rounded-lg border border-gray-700 overflow-x-auto">
                  <p className="text-xs text-gray-500 mb-2">Example Webhook Payload:</p>
                  <pre className="font-mono text-sm text-gray-300">
{`{
  "event": "audit.completed",
  "timestamp": "2024-12-25T10:30:00Z",
  "data": {
    "audit_id": "aud_1234567890",
    "health_score": 87,
    "grade": "B",
    "issues_found": 12
  }
}`}
                  </pre>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card hover>
                  <h3 className="text-lg font-semibold text-white mb-2">Supported Events</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• audit.completed</li>
                    <li>• audit.failed</li>
                    <li>• subscription.updated</li>
                    <li>• limit.reached</li>
                  </ul>
                </Card>

                <Card hover>
                  <h3 className="text-lg font-semibold text-white mb-2">Security</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• HTTPS required</li>
                    <li>• Signed payloads</li>
                    <li>• Retry logic (3 attempts)</li>
                    <li>• Timeout: 10 seconds</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="py-20 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Need Help with the API?</h2>
                <p className="text-gray-300 mb-6">
                  Our team is here to help you build amazing integrations
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/docs"
                    className="px-8 py-4 border-2 border-gray-700 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-lg transition-all"
                  >
                    Read Full Docs
                  </a>
                  <a
                    href="/contact"
                    className="px-8 py-4 border-2 border-gray-700 text-gray-300 hover:border-primary hover:text-primary font-semibold rounded-lg transition-all"
                  >
                    Contact Support
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hover className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">System Status</h3>
                  <p className="text-gray-400 text-sm mb-3">Check API uptime and performance</p>
                  <a href="/status" className="text-primary hover:text-primary-light">
                    View status →
                  </a>
                </Card>

                <Card hover className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Changelog</h3>
                  <p className="text-gray-400 text-sm mb-3">Latest API updates and changes</p>
                  <a href="/docs" className="text-primary hover:text-primary-light">
                    View changelog →
                  </a>
                </Card>

                <Card hover className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Code Examples</h3>
                  <p className="text-gray-400 text-sm mb-3">Sample code in multiple languages</p>
                  <a href="/docs" className="text-primary hover:text-primary-light">
                    Browse examples →
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
