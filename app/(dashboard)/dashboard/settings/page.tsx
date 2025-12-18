'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import Loader from '@/components/shared/Loader';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  subscription_tier: 'free' | 'starter' | 'pro';
  audits_used: number;
  audits_limit: number;
  created_at: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          ...data,
          email: user!.email!,
        });
        setFullName(data.full_name || '');
        setCompanyName(data.company_name || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName || null,
          company_name: companyName || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const getTierBadgeVariant = (tier: string): 'info' | 'success' | 'warning' => {
    if (tier === 'pro') return 'success';
    if (tier === 'starter') return 'warning';
    return 'info';
  };

  const getTierDisplay = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader size="lg" />
            <p className="text-gray-400 mt-4">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-2">Profile Not Found</h3>
          <p className="text-gray-400">Unable to load your profile information</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your account and subscription preferences</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Subscription Overview */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Subscription</h2>
            <Badge variant={getTierBadgeVariant(profile.subscription_tier)} size="lg">
              {getTierDisplay(profile.subscription_tier)} Plan
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Audits Used</div>
              <div className="text-2xl font-bold text-white">
                {profile.audits_used} / {profile.audits_limit}
              </div>
              <div className="text-xs text-gray-500 mt-1">This month</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Audits Remaining</div>
              <div className="text-2xl font-bold text-green-400">
                {profile.audits_limit - profile.audits_used}
              </div>
              <div className="text-xs text-gray-500 mt-1">Available now</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Member Since</div>
              <div className="text-lg font-semibold text-white">
                {new Date(profile.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Usage</span>
              <span>
                {Math.round((profile.audits_used / profile.audits_limit) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width: `${Math.min((profile.audits_used / profile.audits_limit) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {profile.subscription_tier === 'free' && (
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">Upgrade for More Audits</h3>
                  <p className="text-sm text-gray-400">
                    Get unlimited audits and advanced features with a Pro plan
                  </p>
                </div>
                <button
                  onClick={() => router.push('/pricing')}
                  className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  View Plans
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Profile Information */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name (optional)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Save Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader size="sm" />
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFullName(profile.full_name || '');
                  setCompanyName(profile.company_name || '');
                  setMessage(null);
                }}
                className="px-6 py-3 border border-gray-600 text-gray-400 hover:bg-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card className="mt-6 border-red-500/30">
          <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg">
              <div>
                <h3 className="font-semibold text-white mb-1">Delete Account</h3>
                <p className="text-sm text-gray-400">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    alert('Account deletion feature coming soon. Please contact support.');
                  }
                }}
                className="px-6 py-3 border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Delete Account
              </button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
