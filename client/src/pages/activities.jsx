import { useState, useEffect } from 'react';
import { getActivities, createActivity, deleteActivity } from '../api/activities.api';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { Plus, Trash2, Phone, Mail, Users, FileText, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const TYPES = ['call', 'email', 'meeting', 'note', 'task'];
const icons = { call: Phone, email: Mail, meeting: Users, note: FileText, task: CheckSquare };
const colors = {
  call:    'bg-blue-100 text-blue-600',
  email:   'bg-purple-100 text-purple-600',
  meeting: 'bg-green-100 text-green-600',
  note:    'bg-yellow-100 text-yellow-600',
  task:    'bg-gray-100 text-gray-600',
};
const empty = { type: 'call', title: '', description: '', outcome: '' };

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [form, setForm]             = useState(empty);
  const [saving, setSaving]         = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try { const res = await getActivities(); setActivities(res.data.data); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await createActivity(form);
      toast.success('Activity logged');
      setModal(false); setForm(empty); fetchActivities();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete activity?')) return;
    try { await deleteActivity(id); toast.success('Deleted'); fetchActivities(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Activity Log</h2>
          <p className="text-gray-500 text-sm">{activities.length} total activities</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Log Activity
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((act, i) => {
            const Icon = icons[act.type] || FileText;
            return (
              <div
                key={act._id}
                className="card p-4 flex items-start gap-4 hover:shadow-md transition-all animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[act.type]}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900">{act.title}</p>
                      {act.description && <p className="text-sm text-gray-500 mt-0.5">{act.description}</p>}
                      {act.outcome && <p className="text-sm text-green-600 mt-1">Outcome: {act.outcome}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge label={act.type} />
                      <button onClick={() => handleDelete(act._id)} className="btn-ghost p-1.5 text-red-500 hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>by {act.createdBy?.name || 'Unknown'}</span>
                    <span>·</span>
                    <span>{formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {activities.length === 0 && (
            <div className="card p-10 text-center">
              <p className="text-gray-400">No activities logged yet</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Log Activity">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Type</label>
            <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="label">Title *</label><input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Called John about proposal" /></div>
          <div><label className="label">Description</label><textarea className="input-field h-20 resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div><label className="label">Outcome</label><input className="input-field" value={form.outcome} onChange={e => setForm({ ...form, outcome: e.target.value })} placeholder="What was the result?" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Log Activity'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}