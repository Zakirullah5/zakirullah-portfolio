import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { ServiceRate } from '../../../types/index.ts';
import { DollarSign, Save, Plus, Trash2, CheckCircle, Clock, Sparkles } from 'lucide-react';

export const PricingManagerView: React.FC = () => {
  const { data, updateRates, isSaving } = useData();
  const [rates, setRates] = useState<ServiceRate[]>(() => data?.rates || []);
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'PKR'>('USD');

  const handleRateChange = (id: string, field: keyof ServiceRate, val: any) => {
    setRates((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleAddNewRate = () => {
    const newRate: ServiceRate = {
      id: 'rate_' + Date.now(),
      serviceName: 'Custom Service',
      category: 'Design',
      rateUSD: 20,
      ratePKR: 5600,
      deliveryTime: '24 Hours',
      revisionLimit: 'Unlimited',
      popular: false
    };
    setRates([...rates, newRate]);
  };

  const handleDeleteRate = (id: string) => {
    setRates(rates.filter((r) => r.id !== id));
  };

  const handleSave = async () => {
    await updateRates(rates);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Dynamic Pricing & Rates Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Set rates in PKR and USD for Logo Design, 3D Logos, AI Videos, Ads, Banners, CVs, and Editing. Updates live portfolio instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Currency Toggle */}
          <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => setCurrencyMode('USD')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currencyMode === 'USD' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrencyMode('PKR')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currencyMode === 'PKR' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'
              }`}
            >
              PKR (Rs)
            </button>
          </div>

          <button
            onClick={handleAddNewRate}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Rate Item</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Rates</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rates.map((rate) => (
          <div
            key={rate.id}
            className="p-5 rounded-3xl bg-[#090e24]/90 border border-blue-500/20 hover:border-emerald-500/40 shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={rate.serviceName}
                  onChange={(e) => handleRateChange(rate.id, 'serviceName', e.target.value)}
                  className="font-display font-bold text-white text-base bg-transparent border-b border-transparent focus:border-blue-400 focus:outline-none w-full mr-2"
                />
                <button
                  onClick={() => handleDeleteRate(rate.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">USD Rate ($)</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm font-bold text-emerald-400">$</span>
                    <input
                      type="number"
                      value={rate.rateUSD}
                      onChange={(e) => handleRateChange(rate.id, 'rateUSD', Number(e.target.value))}
                      className="w-full bg-transparent text-lg font-display font-black text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">PKR Rate (Rs)</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-bold text-amber-400">Rs</span>
                    <input
                      type="number"
                      value={rate.ratePKR}
                      onChange={(e) => handleRateChange(rate.id, 'ratePKR', Number(e.target.value))}
                      className="w-full bg-transparent text-lg font-display font-black text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Details & Delivery */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase">Delivery Time</label>
                  <input
                    type="text"
                    value={rate.deliveryTime}
                    onChange={(e) => handleRateChange(rate.id, 'deliveryTime', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase">Revisions</label>
                  <input
                    type="text"
                    value={rate.revisionLimit}
                    onChange={(e) => handleRateChange(rate.id, 'revisionLimit', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={rate.popular ?? false}
                  onChange={(e) => handleRateChange(rate.id, 'popular', e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <span className="text-[11px]">Featured / Best Seller</span>
              </label>

              <span className="text-[10px] text-slate-500 font-mono">
                Category: {rate.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
