import React, { useState } from 'react';
import { useData } from '../../../context/DataContext.tsx';
import { ListOrdered, Search, Activity, User, Clock, Shield } from 'lucide-react';

export const ActivityLogsView: React.FC = () => {
  const { data } = useData();
  const activities = data?.activities || [];
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  const categories = ['All', 'Portfolio', 'Services', 'Pricing', 'Media Library', 'Content Control', 'Authentication', 'Security', 'System'];

  const filtered = activities.filter((act) => {
    const matchesSearch =
      act.action.toLowerCase().includes(search.toLowerCase()) ||
      act.details.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'All' || act.category === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#090e24]/90 border border-blue-500/20">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-blue-400" />
            Admin Activity & Audit Logs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time chronological record of content edits, uploads, password updates, and publish events.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold">
          {activities.length} Recorded Events
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterCat === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search activity records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* Activities Table */}
      <div className="rounded-3xl bg-[#090e24]/90 border border-blue-500/20 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Event Action</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((act) => (
                <tr key={act.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{act.action}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-purple-300 font-medium">
                      {act.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {act.details}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-amber-400" />
                    <span>{act.user}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">
                    {act.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
