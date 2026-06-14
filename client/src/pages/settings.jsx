import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Bell, Shield, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const TABS = [
  { id: 'profile',   label: 'Profile',        icon: User },
  { id: 'password',  label: 'Change Password', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'roles',     label: 'Roles & Access',  icon: Shield },
];

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const [profile, setProfile] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
  });

  // Password form
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new:     false,
    confirm: false,
  });

  const [saving, setSaving] = useState(false);

  // ── Profile Save ──────────────────────────────
  const handleProfileSave = async () => {
    if (!profile.name || !profile.email) {
      toast.error('Name aur email required hai');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/users/${user.id}`, {
        name:  profile.name,
        email: profile.email,
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Password Save ─────────────────────────────
  const handlePasswordSave = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error('Saare fields fill karo');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords match nahi kar rahe');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password kam se kam 6 characters ka hona chahiye');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/users/${user.id}`, {
        password: passwords.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Notifications State ───────────────────────
  const [notifications, setNotifications] = useState({
    emailLeads:      true,
    emailDeals:      true,
    emailActivities: false,
    browserAlerts:   true,
  });

  const handleNotifSave = () => {
    toast.success('Notification preferences saved');
  };

  return (
    <div className="space-y-6 page-enter">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          Account settings aur preferences manage karo
        </p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">

        {/* Sidebar Tabs */}
        <div className="w-full lg:w-52 flex-shrink-0">
          <div className="card p-2 space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div className="card p-6 animate-fade-up">
              <h3 className="text-base font-semibold text-gray-900 mb-5">
                Profile Information
              </h3>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    className="input-field"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Apna naam likho"
                  />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="label">Role</label>
                  <input
                    className="input-field bg-gray-50 cursor-not-allowed"
                    value={user?.role || ''}
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Role sirf Admin change kar sakta hai
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleProfileSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={15} />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          )}

          {/* ── PASSWORD TAB ── */}
          {activeTab === 'password' && (
            <div className="card p-6 animate-fade-up">
              <h3 className="text-base font-semibold text-gray-900 mb-5">
                Change Password
              </h3>

              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="label">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPass.current ? 'text' : 'password'}
                      className="input-field pr-10"
                      value={passwords.currentPassword}
                      onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="label">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass.new ? 'text' : 'password'}
                      className="input-field pr-10"
                      value={passwords.newPassword}
                      onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="label">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPass.confirm ? 'text' : 'password'}
                      className="input-field pr-10"
                      value={passwords.confirmPassword}
                      onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Password strength hint */}
                {passwords.newPassword && (
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          passwords.newPassword.length >= i * 3
                            ? passwords.newPassword.length >= 10
                              ? 'bg-green-500'
                              : 'bg-yellow-400'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handlePasswordSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={15} />
                  {saving ? 'Saving...' : 'Change Password'}
                </button>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS TAB ── */}
          {activeTab === 'notifications' && (
            <div className="card p-6 animate-fade-up">
              <h3 className="text-base font-semibold text-gray-900 mb-5">
                Notification Preferences
              </h3>

              <div className="space-y-4">
                {[
                  { key: 'emailLeads',      label: 'New Lead Assigned',     desc: 'Jab koi lead assign ho' },
                  { key: 'emailDeals',      label: 'Deal Stage Changed',    desc: 'Jab deal ka stage badle' },
                  { key: 'emailActivities', label: 'Activity Reminders',    desc: 'Upcoming tasks ki reminder' },
                  { key: 'browserAlerts',   label: 'Browser Notifications', desc: 'Real-time browser alerts' },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                        notifications[key] ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        notifications[key] ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNotifSave}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save size={15} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* ── ROLES TAB ── */}
          {activeTab === 'roles' && (
            <div className="card p-6 animate-fade-up">
              <h3 className="text-base font-semibold text-gray-900 mb-5">
                Roles & Access Control
              </h3>

              <div className="space-y-3">
                {[
                  {
                    role: 'Admin',
                    color: 'bg-red-100 text-red-700 border-red-200',
                    dot: 'bg-red-500',
                    permissions: ['Saab kuch kar sakta hai', 'Users manage kar sakta hai', 'Delete access', 'Settings change kar sakta hai'],
                  },
                  {
                    role: 'Manager',
                    color: 'bg-blue-100 text-blue-700 border-blue-200',
                    dot: 'bg-blue-500',
                    permissions: ['Leads + Deals + Customers dekh sakta hai', 'Reports access', 'Team ke leads assign kar sakta hai', 'Delete nahi kar sakta'],
                  },
                  {
                    role: 'Sales',
                    color: 'bg-green-100 text-green-700 border-green-200',
                    dot: 'bg-green-500',
                    permissions: ['Apne leads manage kar sakta hai', 'Activities log kar sakta hai', 'Deals update kar sakta hai', 'Doosron ke data nahi dekh sakta'],
                  },
                  {
                    role: 'Viewer',
                    color: 'bg-gray-100 text-gray-700 border-gray-200',
                    dot: 'bg-gray-400',
                    permissions: ['Sirf read access', 'Kuch bhi edit nahi kar sakta', 'Reports dekh sakta hai', 'Activities nahi kar sakta'],
                  },
                ].map(({ role, color, dot, permissions }) => (
                  <div
                    key={role}
                    className={`border rounded-xl p-4 ${color}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                      <span className="font-semibold text-sm">{role}</span>
                      {user?.role === role.toLowerCase() && (
                        <span className="ml-auto text-xs font-medium bg-white bg-opacity-70 px-2 py-0.5 rounded-full">
                          Tumhara role
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {permissions.map((p, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs opacity-80">
                          <span>•</span> {p}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}