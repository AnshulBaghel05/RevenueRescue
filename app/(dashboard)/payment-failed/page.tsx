'use client';

import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Failed
          </h1>
          <p className="text-gray-400 mb-6">
            We couldn't process your payment. Please try again or contact support if the issue persists.
          </p>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              Common Issues
            </h3>
            <ul className="text-left text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Card limit exceeded</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Card declined by your bank</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Incorrect card details</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/pricing')}
              className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 border-2 border-gray-700 hover:border-primary text-gray-300 hover:text-primary font-semibold rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Need help? <a href="mailto:support@revenuerescue.com" className="text-primary hover:text-primary-light">Contact Support</a>
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
