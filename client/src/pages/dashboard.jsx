import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api/dashboard.api';
import { Users, TrendingUp, UserCheck, Activity, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Badge from '../components/common/Badge';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#6b7280'];

export default function Dashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Leads',     value: data?.stats?.totalLeads     || 0, icon: Users,       color: 'blue' },
    { label: 'Total Deals',     value: data?.stats?.totalDeals     || 0, icon: TrendingUp,  color: 'purple' },
    { label: 'Customers',       value: data?.stats?.totalCustomers || 0, icon: UserCheck,   color: 'green' },
    { label: 'Activities',      value: data?.stats?.totalActivities|| 0, icon: Activity,    color: 'yellow' },
    { label: 'Total Revenue',   value: `$${(data?.stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'emerald' },
  ];

  const colorMap = {
    blue:    'bg-blue-50 text-blue-600',
    purple:  'bg-purple-50 text-purple-600',
    green:   'bg-green-50 text-green-600',
    yellow:  'bg-yellow-50 text-yellow-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  const pieData = (data?.leadsByStatus || []).map(item => ({
    name: item._id,
    value: item.count
  }));

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Overview</h2>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }, i) => (
          <div
            key={label}
            className="card p-5 hover:shadow-md transition-shadow duration-200"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`w-10 h-10 rounded-lg ${colorMap[color]} flex items-center justify-center mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Leads by Status</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {(data?.recentActivities || []).slice(0, 6).map((act, i) => (
              <div key={act._id} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{act.title}</p>
                  <p className="text-xs text-gray-400">{act.createdBy?.name} · {act.type}</p>
                </div>
              </div>
            ))}
            {(data?.recentActivities || []).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No activities yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Recent Leads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Company</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(data?.recentLeads || []).map(lead => (
                <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-5 py-3 text-gray-500">{lead.company || '—'}</td>
                  <td className="px-5 py-3"><Badge label={lead.status} /></td>
                  <td className="px-5 py-3 text-gray-700">${lead.value?.toLocaleString() || 0}</td>
                </tr>
              ))}
              {(data?.recentLeads || []).length === 0 && (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No leads yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}