import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Tag, Plus, CheckCircle, ShieldAlert, DollarSign, Percent, RefreshCw } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SubscriptionPlan {
  id: string;
  plan_name: string;
  target_role: 'driver' | 'courier_agent' | 'enterprise_admin';
  price_zar: number;
  price_usd: number;
  duration_days: number;
  discount_percentage: number;
  is_active: boolean;
}

export default function AdminSubscriptionPanel() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [planName, setPlanName] = useState('');
  const [targetRole, setTargetRole] = useState<'driver' | 'courier_agent' | 'enterprise_admin'>('driver');
  const [priceZar, setPriceZar] = useState(100);
  const [priceUsd, setPriceUsd] = useState(7);
  const [durationDays, setDurationDays] = useState(30);
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    setLoading(true);
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching plans:', error);
    else setPlans(data || []);
    setLoading(false);
  }

  async function handleCreatePlan(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('subscription_plans').insert([
      {
        plan_name: planName,
        target_role: targetRole,
        price_zar: priceZar,
        price_usd: priceUsd,
        duration_days: durationDays,
        discount_percentage: discountPercent,
        is_active: true,
      },
    ]);

    if (error) {
      alert(`Failed to create plan: ${error.message}`);
    } else {
      alert('Subscription plan created successfully!');
      setIsCreating(false);
      fetchPlans();
    }
  }

  async function togglePlanStatus(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('subscription_plans')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) alert(`Error toggling plan: ${error.message}`);
    else fetchPlans();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-900 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-400">
            JIT Subscription & Billing Admin
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage African transport plans, dynamic pricing, and promotional association discounts.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={18} /> {isCreating ? 'Close Form' : 'New Pricing Plan'}
        </button>
      </div>

      {/* CREATE PLAN FORM MODAL / EXPANDABLE */}
      {isCreating && (
        <form onSubmit={handleCreatePlan} className="bg-slate-800 border border-slate-700 p-6 rounded-xl mb-8 space-y-4">
          <h3 className="text-xl font-semibold text-emerald-300 mb-4">Configure New Subscription Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Plan Name</label>
              <input
                type="text"
                required
                placeholder="e.g. SANTACO Long Distance Promo"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-md text-white focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Sector Role</label>
              <select
                value={targetRole}
                onChange={(e: any) => setTargetRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-md text-white focus:outline-emerald-500"
              >
                <option value="driver">Taxi / Transit Driver</option>
                <option value="courier_agent">Courier & Van Partner</option>
                <option value="enterprise_admin">Enterprise Fleet Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Duration (Days)</label>
              <input
                type="number"
                required
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-md text-white focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Price (ZAR - R)</label>
              <input
                type="number"
                required
                value={priceZar}
                onChange={(e) => setPriceZar(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-md text-white focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Price (USD - $)</label>
              <input
                type="number"
                required
                value={priceUsd}
                onChange={(e) => setPriceUsd(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-md text-white focus:outline-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Promo Discount (%)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 p-2.5 rounded-md text-white focus:outline-emerald-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 font-semibold py-3 rounded-lg mt-4 transition"
          >
            Save & Publish Plan
          </button>
        </form>
      )}

      {/* ACTIVE PLANS TABLE */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-850 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-200">Active Subscription Tiers</h2>
          <button onClick={fetchPlans} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
            <RefreshCw size={16} />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading plan configs...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/50 text-slate-400 text-xs uppercase">
                <th className="p-4">Plan Name</th>
                <th className="p-4">Target Sector</th>
                <th className="p-4">Billing Cycle</th>
                <th className="p-4">Price (ZAR / USD)</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-sm">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-750 transition">
                  <td className="p-4 font-medium text-slate-100">{plan.plan_name}</td>
                  <td className="p-4 text-slate-300 capitalize">{plan.target_role.replace('_', ' ')}</td>
                  <td className="p-4 text-slate-300">{plan.duration_days} Days</td>
                  <td className="p-4 font-semibold text-emerald-400">
                    R {plan.price_zar} / ${plan.price_usd}
                  </td>
                  <td className="p-4 text-amber-400">
                    {plan.discount_percentage > 0 ? `${plan.discount_percentage}% OFF` : 'Standard'}
                  </td>
                  <td className="p-4">
                    {plan.is_active ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                        <CheckCircle size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full">
                        <ShieldAlert size={12} /> Disabled
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => togglePlanStatus(plan.id, plan.is_active)}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
                        plan.is_active
                          ? 'bg-red-600/20 text-red-300 hover:bg-red-600/30'
                          : 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30'
                      }`}
                    >
                      {plan.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}