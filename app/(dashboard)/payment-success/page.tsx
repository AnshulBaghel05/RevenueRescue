'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-400 mb-6">
            Your subscription has been activated. You now have access to all premium features.
          </p>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              What's Next?
            </h3>
            <ul className="text-left text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Your audit limit has been increased</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Premium features are now unlocked</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>You can start running more audits immediately</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/dashboard/new')}
              className="px-6 py-3 border-2 border-gray-700 hover:border-primary text-gray-300 hover:text-primary font-semibold rounded-lg transition-colors"
            >
              Run New Audit
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Redirecting to dashboard in 5 seconds...
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
