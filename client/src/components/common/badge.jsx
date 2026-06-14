const variants = {
  new:          'bg-gray-100 text-gray-700',
  contacted:    'bg-blue-100 text-blue-700',
  qualified:    'bg-yellow-100 text-yellow-700',
  proposal:     'bg-purple-100 text-purple-700',
  won:          'bg-green-100 text-green-700',
  lost:         'bg-red-100 text-red-700',
  prospecting:  'bg-gray-100 text-gray-700',
  qualification:'bg-blue-100 text-blue-700',
  negotiation:  'bg-orange-100 text-orange-700',
  'closed-won': 'bg-green-100 text-green-700',
  'closed-lost':'bg-red-100 text-red-700',
  high:         'bg-red-100 text-red-700',
  medium:       'bg-yellow-100 text-yellow-700',
  low:          'bg-green-100 text-green-700',
  admin:        'bg-purple-100 text-purple-700',
  manager:      'bg-blue-100 text-blue-700',
  sales:        'bg-green-100 text-green-700',
  viewer:       'bg-gray-100 text-gray-700',
};

export default function Badge({ label }) {
  const cls = variants[label] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {label}
    </span>
  );
}