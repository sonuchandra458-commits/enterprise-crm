import { useState, useEffect, useCallback } from 'react';
import { getLeads, createLead, updateLead, deleteLead } from '../api/leads.api';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
const SOURCES  = ['website', 'referral', 'cold-call', 'social', 'email', 'other'];

const emptyForm = { name: '', email: '', phone: '', company: '', source: 'other', status: 'new', value: 0, notes: '' };

export default function Leads() {
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('');
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(emptyForm);
  const [saving,  setSaving]  = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLeads({ search, status: filter });
      setLeads(res.data.data);
    } catch { toast.error('Failed to fetch leads'); }
    finally { setLoading(false); }
  }, [search, filter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (lead) => { setEditing(lead); setForm({ ...lead }); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateLead(editing._id, form);
        toast.success('Lead updated');
      } else {
        await createLead(form);
        toast.success('Lead created');
      }
      closeModal();
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving lead');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await deleteLead(id);
      toast.success('Lead deleted');
      fetchLeads();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-5 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Leads</h2>
          <p className="text-gray-500 text-sm">{leads.length} total leads</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            className="input-field pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field w-auto"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {['Name', 'Email', 'Company', 'Status', 'Value', 'Source', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead, i) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                    <td className="px-4 py-3 text-gray-500">{lead.email}</td>
                    <td className="px-4 py-3 text-gray-500">{lead.company || '—'}</td>
                    <td className="px-4 py-3"><Badge label={lead.status} /></td>
                    <td className="px-4 py-3 text-gray-700">${lead.value?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{lead.source}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(lead)} className="btn-ghost p-1.5 text-blue-600 hover:bg-blue-50">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(lead._id)} className="btn-ghost p-1.5 text-red-600 hover:bg-red-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-gray-400">No leads found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modal} onClose={closeModal} title={editing ? 'Edit Lead' : 'Add New Lead'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Name *</label><input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label className="label">Email *</label><input type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            <div><label className="label">Phone</label><input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="label">Company</label><input className="input-field" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
            <div>
              <label className="label">Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Source</label>
              <select className="input-field" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="label">Value ($)</label><input type="number" className="input-field" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} /></div>
          </div>
          <div><label className="label">Notes</label><textarea className="input-field h-20 resize-none" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}