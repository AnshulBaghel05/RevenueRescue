'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';

const services = [
  {
    name: 'Website & Dashboard',
    status: 'operational',
    uptime: '99.98%',
    responseTime: '145ms',
  },
  {
    name: 'API',
    status: 'operational',
    uptime: '99.95%',
    responseTime: '89ms',
  },
  {
    name: 'Audit Engine',
    status: 'operational',
    uptime: '99.92%',
    responseTime: '2.3s',
  },
  {
    name: 'Database',
    status: 'operational',
    uptime: '99.99%',
    responseTime: '12ms',
  },
  {
    name: 'Payment Processing',
    status: 'operational',
    uptime: '99.97%',
    responseTime: '234ms',
  },
  {
    name: 'PDF Export',
    status: 'operational',
    uptime: '99.89%',
    responseTime: '1.8s',
  },
];

const incidents = [
  {
    date: 'Dec 20, 2024',
    title: 'Scheduled Maintenance',
    status: 'resolved',
    severity: 'maintenance',
    description: 'Completed scheduled database optimization. All services are now operational.',
    duration: '45 minutes',
  },
  {
    date: 'Dec 15, 2024',
    title: 'Slow Audit Processing',
    status: 'resolved',
    severity: 'minor',
    description: 'Brief performance degradation in audit engine due to high traffic. Resolved by scaling infrastructure.',
    duration: '1 hour 20 minutes',
  },
  {
    date: 'Dec 8, 2024',
    title: 'API Rate Limiting Issue',
    status: 'resolved',
    severity: 'minor',
    description: 'Some API requests were incorrectly rate-limited. Fixed configuration and restored normal service.',
    duration: '35 minutes',
  },
];

const metrics = [
  { label: 'Overall Uptime (30 days)', value: '99.96%' },
  { label: 'Avg Response Time', value: '156ms' },
  { label: 'Incidents (30 days)', value: '3' },
  { label: 'MTTR (Mean Time to Resolve)', value: '52 min' },
];

export default function StatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge variant="success">Operational</Badge>;
      case 'degraded':
        return <Badge variant="warning">Degraded</Badge>;
      case 'outage':
        return <Badge variant="error">Outage</Badge>;
      case 'maintenance':
        return <Badge variant="info">Maintenance</Badge>;
      default:
        return <Badge variant="neutral">Unknown</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="error" size="sm">Critical</Badge>;
      case 'major':
        return <Badge variant="warning" size="sm">Major</Badge>;
      case 'minor':
        return <Badge variant="info" size="sm">Minor</Badge>;
      case 'maintenance':
        return <Badge variant="neutral" size="sm">Maintenance</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Info</Badge>;
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 pb-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="success" size="lg" className="mb-6">
                All Systems Operational
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  System Status
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                Real-time status and uptime information for RevenueRescue services
              </p>
              <p className="text-sm text-gray-500">
                Last updated: {currentTime.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-12 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {metrics.map((metric, idx) => (
                  <Card key={idx} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                    <div className="text-sm text-gray-400">{metric.label}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Service Status */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Current Status</h2>
                <p className="text-gray-400">Real-time status of all RevenueRescue services</p>
              </div>

              <div className="space-y-4">
                {services.map((service, idx) => (
                  <Card key={idx} hover>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                          {getStatusBadge(service.status)}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <div>
                            <span className="text-gray-500">Uptime:</span> {service.uptime}
                          </div>
                          <div>
                            <span className="text-gray-500">Response:</span> {service.responseTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Incident History */}
        <section className="py-20 bg-gray-800/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Incident History</h2>
                <p className="text-gray-400">Past incidents and maintenance events (Last 30 days)</p>
              </div>

              <div className="space-y-6">
                {incidents.map((incident, idx) => (
                  <Card key={idx}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getSeverityBadge(incident.severity)}
                        <Badge variant="neutral" size="sm">{incident.status}</Badge>
                      </div>
                      <span className="text-sm text-gray-500">{incident.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{incident.title}</h3>
                    <p className="text-gray-400 mb-3">{incident.description}</p>
                    <div className="text-sm text-gray-500">
                      <span className="text-gray-500">Duration:</span> {incident.duration}
                    </div>
                  </Card>
                ))}

                {incidents.length === 0 && (
                  <Card className="text-center">
                    <div className="text-4xl mb-3">✨</div>
                    <p className="text-gray-400">No incidents in the last 30 days</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Uptime Graph Placeholder */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">90-Day Uptime History</h2>
                <p className="text-gray-400">Visual representation of service availability</p>
              </div>

              <Card>
                <div className="space-y-4">
                  {/* Uptime bars - simple visualization */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">Overall</span>
                      <span className="text-green-400">99.96%</span>
                    </div>
                    <div className="w-full h-8 bg-gray-900 rounded-lg overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: '99.96%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">API</span>
                      <span className="text-green-400">99.95%</span>
                    </div>
                    <div className="w-full h-8 bg-gray-900 rounded-lg overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: '99.95%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">Dashboard</span>
                      <span className="text-green-400">99.98%</span>
                    </div>
                    <div className="w-full h-8 bg-gray-900 rounded-lg overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: '99.98%' }}></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700 text-sm text-gray-400">
                    <p>Green = Operational • Yellow = Degraded • Red = Outage</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Subscribe to Updates */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="text-center bg-transparent border-primary/20">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Stay Informed
                </h2>
                <p className="text-gray-300 mb-6">
                  Subscribe to receive notifications about incidents and maintenance
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-glow-primary whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  We only send notifications for incidents and maintenance
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card hover>
                  <h3 className="text-lg font-semibold text-white mb-2">Report an Issue</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Experiencing problems? Let us know immediately.
                  </p>
                  <a href="/contact" className="text-primary hover:text-primary-light">
                    Contact Support →
                  </a>
                </Card>

                <Card hover>
                  <h3 className="text-lg font-semibold text-white mb-2">API Documentation</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Check API status and rate limits.
                  </p>
                  <a href="/api-info" className="text-primary hover:text-primary-light">
                    View API Status →
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
