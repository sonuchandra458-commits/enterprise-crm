import { useState, useEffect } from 'react';
import { getDeals, createDeal, updateDeal, deleteDeal } from '../api/deals.api';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const STAGES = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
const empty  = { title: '', value: 0, stage: 'prospecting', probability: 0, description: '' };

export default function Deals() {
  const [deals,   setDeals]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(empty);
  const [saving,  setSaving]  = useState(false);

  const fetchDeals = async () => {
    setLoading(true);
    try { const res = await getDeals(); setDeals(res.data.data); }
    catch { toast.error('Failed to fetch deals'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDeals(); }, []);

  const openAdd  = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (deal) => { setEditing(deal); setForm({ ...deal }); setModal(true); };
  const close    = () => { setModal(false); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editing ? await updateDeal(editing._id, form) : await createDeal(form);
      toast.success(editing ? 'Deal updated' : 'Deal created');
      close(); fetchDeals();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this deal?')) return;
    try { await deleteDeal(id); toast.success('Deleted'); fetchDeals(); }
    catch { toast.error('Failed to delete'); }
  };

  // Group by stage for kanban
  const byStage = STAGES.reduce((acc, s) => {
    acc[s] = deals.filter(d => d.stage === s);
    return acc;
  }, {});

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Deal Pipeline</h2>
          <p className="text-gray-500 text-sm">{deals.length} active deals</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Deal
        </button>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => (
            <div key={stage} className="flex-shrink-0 w-64">
              <div className="flex items-center justify-between mb-3">
                <Badge label={stage} />
                <span className="text-xs text-gray-400">{byStage[stage].length}</span>
              </div>
              <div className="space-y-3">
                {byStage[stage].map((deal, i) => (
                  <div
                    key={deal._id}
                    className="card p-4 hover:shadow-md transition-all duration-200 animate-fade-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <p className="font-medium text-gray-900 text-sm mb-1">{deal.title}</p>
                    <p className="text-blue-600 font-semibold text-sm">${deal.value?.toLocaleString()}</p>
                    {deal.probability > 0 && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Probability</span>
                          <span>{deal.probability}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${deal.probability}%` }} />
                        </div>
                      </div>
                    )}
                    <div className="flex gap-1 mt-3">
                      <button onClick={() => openEdit(deal)} className="btn-ghost p-1 text-blue-600 hover:bg-blue-50 text-xs flex items-center gap-1">
                        <Edit2 size={12} /> Edit
                      </button>
                      <button onClick={() => handleDelete(deal._id)} className="btn-ghost p-1 text-red-500 hover:bg-red-50 text-xs flex items-center gap-1">
                        <Trash2 size={12} /> Del
                      </button>
                    </div>
                  </div>
                ))}
                {byStage[stage].length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <p className="text-xs text-gray-400">No deals</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modal} onClose={close} title={editing ? 'Edit Deal' : 'Add Deal'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label">Title *</label><input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Value ($)</label><input type="number" className="input-field" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} /></div>
            <div><label className="label">Probability (%)</label><input type="number" min={0} max={100} className="input-field" value={form.probability} onChange={e => setForm({ ...form, probability: e.target.value })} /></div>
          </div>
          <div>
            <label className="label">Stage</label>
            <select className="input-field" value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })}>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="label">Description</label><textarea className="input-field h-20 resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={close} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}