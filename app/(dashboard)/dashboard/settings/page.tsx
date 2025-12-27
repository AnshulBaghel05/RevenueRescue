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

interface ScheduledAudit {
  id: string;
  store_url: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string;
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

  // Scheduled audits state
  const [scheduledAudits, setScheduledAudits] = useState<ScheduledAudit[]>([]);
  const [showAddScheduled, setShowAddScheduled] = useState(false);
  const [newScheduledUrl, setNewScheduledUrl] = useState('');
  const [newScheduledFrequency, setNewScheduledFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

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

        // Fetch scheduled audits for Starter/Pro users
        if (data.subscription_tier !== 'free') {
          fetchScheduledAudits();
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledAudits = async () => {
    try {
      const response = await fetch('/api/scheduled-audits');
      const data = await response.json();

      if (data.success) {
        setScheduledAudits(data.scheduledAudits);
      }
    } catch (error) {
      console.error('Error fetching scheduled audits:', error);
    }
  };

  const handleAddScheduledAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/scheduled-audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_url: newScheduledUrl,
          frequency: newScheduledFrequency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule audit');
      }

      setMessage({ type: 'success', text: data.message });
      setNewScheduledUrl('');
      setNewScheduledFrequency('weekly');
      setShowAddScheduled(false);
      await fetchScheduledAudits();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to schedule audit',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleScheduledAudit = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/scheduled-audits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !isActive }),
      });

      if (response.ok) {
        await fetchScheduledAudits();
        setMessage({
          type: 'success',
          text: `Scheduled audit ${!isActive ? 'activated' : 'paused'}`,
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update scheduled audit' });
    }
  };

  const handleDeleteScheduledAudit = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scheduled audit?')) {
      return;
    }

    try {
      const response = await fetch(`/api/scheduled-audits?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchScheduledAudits();
        setMessage({ type: 'success', text: 'Scheduled audit deleted' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete scheduled audit' });
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

        {/* Scheduled Audits (Starter & Pro only) */}
        {(profile.subscription_tier === 'starter' || profile.subscription_tier === 'pro') && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Scheduled Audits</h2>
                <p className="text-sm text-gray-400">
                  Automatically run audits on your stores at regular intervals
                </p>
              </div>
              {!showAddScheduled && (
                <button
                  onClick={() => setShowAddScheduled(true)}
                  className="px-4 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
                >
                  + Add Schedule
                </button>
              )}
            </div>

            {/* Add New Scheduled Audit Form */}
            {showAddScheduled && (
              <form onSubmit={handleAddScheduledAudit} className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <h3 className="font-semibold text-white mb-4">Schedule New Audit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Store URL
                    </label>
                    <input
                      type="url"
                      value={newScheduledUrl}
                      onChange={(e) => setNewScheduledUrl(e.target.value)}
                      placeholder="https://yourstore.myshopify.com"
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Frequency
                    </label>
                    <select
                      value={newScheduledFrequency}
                      onChange={(e) => setNewScheduledFrequency(e.target.value as any)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Schedule Audit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddScheduled(false);
                      setNewScheduledUrl('');
                      setNewScheduledFrequency('weekly');
                    }}
                    className="px-6 py-2 border border-gray-600 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {profile.subscription_tier === 'starter' && 'Starter plan: Up to 3 scheduled audits'}
                  {profile.subscription_tier === 'pro' && 'Pro plan: Up to 10 scheduled audits'}
                </p>
              </form>
            )}

            {/* Scheduled Audits List */}
            {scheduledAudits.length === 0 ? (
              <div className="text-center py-12 bg-gray-700/30 rounded-lg border border-gray-600/50">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="text-lg font-semibold text-white mb-2">No Scheduled Audits</h3>
                <p className="text-gray-400 mb-4">
                  Set up automatic audits to monitor your stores continuously
                </p>
                {!showAddScheduled && (
                  <button
                    onClick={() => setShowAddScheduled(true)}
                    className="px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
                  >
                    Schedule Your First Audit
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledAudits.map((audit) => (
                  <div
                    key={audit.id}
                    className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-white">{audit.store_url}</h4>
                        <Badge
                          variant={audit.is_active ? 'success' : 'warning'}
                          size="sm"
                        >
                          {audit.is_active ? 'Active' : 'Paused'}
                        </Badge>
                        <Badge variant="info" size="sm">
                          {audit.frequency.charAt(0).toUpperCase() + audit.frequency.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        {audit.last_run_at ? (
                          <>Last run: {new Date(audit.last_run_at).toLocaleDateString()}</>
                        ) : (
                          <>Never run yet</>
                        )}
                        {' • '}
                        Next run: {new Date(audit.next_run_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleScheduledAudit(audit.id, audit.is_active)}
                        className="px-3 py-2 text-sm border border-gray-600 text-gray-300 hover:bg-gray-700 rounded transition-colors"
                        title={audit.is_active ? 'Pause' : 'Activate'}
                      >
                        {audit.is_active ? '⏸️ Pause' : '▶️ Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteScheduledAudit(audit.id)}
                        className="px-3 py-2 text-sm border border-red-600 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

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
                {profile.subscription_tier === 'pro' && (
                  <Badge variant="success" size="sm" className="ml-2">
                    Pro Feature
                  </Badge>
                )}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter your company name (optional)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              />
              {profile.subscription_tier === 'pro' && (
                <p className="text-xs text-green-400 mt-1">
                  ✓ Your company name will appear on PDF reports instead of "RevenueRescue"
                </p>
              )}
              {profile.subscription_tier !== 'pro' && companyName && (
                <p className="text-xs text-gray-500 mt-1">
                  Custom branding on PDF reports is available for Pro users
                </p>
              )}
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

        {/* Subscription Management */}
        {(profile.subscription_tier === 'starter' || profile.subscription_tier === 'pro') && (
          <Card className="mt-6 border-yellow-500/30">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Subscription Management</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg">
                <div>
                  <h3 className="font-semibold text-white mb-1">Cancel Subscription</h3>
                  <p className="text-sm text-gray-400">
                    Your subscription will remain active until the end of your billing period
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to cancel your subscription?')) {
                      setSaving(true);
                      try {
                        const response = await fetch('/api/payments/cancel', {
                          method: 'POST',
                        });
                        const data = await response.json();
                        if (data.success) {
                          setMessage({ type: 'success', text: 'Subscription cancelled successfully. Access until ' + new Date(data.cancelsAt).toLocaleDateString() });
                          await fetchProfile();
                        } else {
                          throw new Error(data.error);
                        }
                      } catch (error) {
                        setMessage({ type: 'error', text: 'Failed to cancel subscription' });
                      } finally {
                        setSaving(false);
                      }
                    }
                  }}
                  disabled={saving}
                  className="px-6 py-3 border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white font-semibold rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </Card>
        )}

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
