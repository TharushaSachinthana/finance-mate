import { useState } from 'react';
import { Calendar, DollarSign, CheckCircle, Clock, Plus, Trash2, X } from 'lucide-react';

interface RecurringItem {
  id: string;
  name: string;
  amount: number;
  nextDueDate: string;
  status: 'active' | 'paid';
  icon: string;
}

interface RecurringExpensesProps {
  items: RecurringItem[];
  onAdd: (item: Omit<RecurringItem, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function RecurringExpenses({ items, onAdd, onDelete }: RecurringExpensesProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newIcon, setNewIcon] = useState('📅');

  const totalMonthly = items.reduce((sum, item) => sum + item.amount, 0);
  const activeItems = items.filter(item => item.status === 'active');
  const paidItems = items.filter(item => item.status === 'paid');

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dueDate: string) => {
    const daysRemaining = getDaysRemaining(dueDate);
    if (daysRemaining < 0) return 'Overdue';
    if (daysRemaining === 0) return 'Due today';
    if (daysRemaining === 1) return 'Due tomorrow';
    return `${daysRemaining} days left`;
  };

  const handleAdd = () => {
    if (newName && newAmount && newDate) {
      onAdd({
        name: newName,
        amount: parseFloat(newAmount),
        nextDueDate: newDate,
        status: 'active',
        icon: newIcon
      });
      setShowAddModal(false);
      setNewName('');
      setNewAmount('');
      setNewDate('');
      setNewIcon('📅');
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A2332] rounded-3xl p-6 w-full max-w-sm border border-white/10 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl mb-6">New Recurring Bill</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Bill Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00D9FF]"
                  placeholder="e.g. Netflix"
                />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1 block">Amount</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00D9FF]"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1 block">Next Due Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00D9FF] text-white"
                />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1 block">Icon</label>
                <input
                  type="text"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00D9FF]"
                  placeholder="e.g. 🎬"
                />
              </div>

              <button
                onClick={handleAdd}
                disabled={!newName || !newAmount || !newDate}
                className={`w-full py-4 rounded-xl font-medium transition-all ${newName && newAmount && newDate
                    ? 'bg-gradient-to-r from-[#00D9FF] to-[#A855F7] shadow-lg shadow-[#00D9FF]/25'
                    : 'bg-white/10 text-white/40'
                  }`}
              >
                Add Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Recurring Bills</h1>
          <p className="text-white/60 text-sm mt-1">Monthly subscriptions & fixed costs</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Total Summary */}
      <div className="bg-gradient-to-br from-[#FF5252]/20 to-[#EC4899]/20 backdrop-blur-xl rounded-3xl p-6 border border-[#FF5252]/30 shadow-2xl shadow-[#FF5252]/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm mb-1">Total Monthly Cost</p>
            <h2 className="text-4xl">${totalMonthly.toFixed(2)}</h2>
            <p className="text-sm text-white/60 mt-2">{items.length} recurring bills</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-[#FF5252]/30 flex items-center justify-center">
            <DollarSign size={32} />
          </div>
        </div>
      </div>

      {/* Active Bills */}
      {activeItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#FFB800]" />
            <h3 className="text-sm text-white/60">Active ({activeItems.length})</h3>
          </div>

          {activeItems.map(item => {
            const daysRemaining = getDaysRemaining(item.nextDueDate);
            const isUrgent = daysRemaining <= 3 && daysRemaining >= 0;

            return (
              <div
                key={item.id}
                className={`bg-white/5 backdrop-blur-xl rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] ${isUrgent
                    ? 'border-[#FFB800]/50 shadow-lg shadow-[#FFB800]/20'
                    : 'border-white/10'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D9FF]/20 to-[#A855F7]/20 flex items-center justify-center text-2xl border border-white/10">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="mb-1">{item.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar size={14} />
                        <span>{formatDueDate(item.nextDueDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl text-[#FF5252]">${item.amount.toFixed(2)}</p>
                      {isUrgent && (
                        <span className="text-xs text-[#FFB800] mt-1 block">⚠ Due soon</span>
                      )}
                    </div>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paid Bills */}
      {paidItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-[#00E676]" />
            <h3 className="text-sm text-white/60">Paid ({paidItems.length})</h3>
          </div>

          {paidItems.map(item => (
            <div
              key={item.id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 opacity-70"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#00E676]/10 flex items-center justify-center text-2xl border border-[#00E676]/30">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="mb-1">{item.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <CheckCircle size={14} className="text-[#00E676]" />
                      <span>Paid this month</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl line-through text-white/40">${item.amount.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <Calendar size={32} className="text-white/40" />
          </div>
          <h3 className="text-lg mb-2">No recurring bills yet</h3>
          <p className="text-white/60 text-sm">Add your subscriptions and monthly bills to track them here</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-1">This Month</p>
          <p className="text-2xl text-[#FF5252]">${totalMonthly.toFixed(2)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Annual Cost</p>
          <p className="text-2xl text-[#A855F7]">${(totalMonthly * 12).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
