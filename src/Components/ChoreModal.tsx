import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { XCircle, Trash2, CheckCircle } from 'lucide-react';

interface ChoreItem {
  id: number;
  task: string;
  completed_by: string;
  done: boolean;
}

const ChoreModal = ({ onClose }: { onClose: () => void }) => {
  const [chores, setChores] = useState<ChoreItem[]>([]);
  const [newTask, setNewTask] = useState('');
  const [completedBy, setCompletedBy] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchChores = async () => {
      const { data, error } = await supabase
        .from('chores')
        .select('*')
        .order('completed_by', { ascending: true });

      if (error) console.error('❌ Supabase fetch error:', error.message);
      else setChores(data as ChoreItem[]);
    };

    fetchChores();
    setVisible(true);
  }, []);

  const addChore = async () => {
    if (!newTask.trim()) return;

    const { data, error } = await supabase
      .from('chores')
      .insert([{ task: newTask, completed_by: completedBy, done: false }])
      .select();

    if (error) return console.error('❌ Add error:', error.message);
    if (data) setChores([...chores, data[0]]);

    setNewTask('');
    setCompletedBy('');
  };

  const toggleDone = async (item: ChoreItem) => {
    const updated = { ...item, done: !item.done };

    const { error } = await supabase
      .from('chores')
      .update({ done: updated.done })
      .eq('id', item.id);

    if (error) return console.error('❌ Update error:', error.message);

    setChores((prev) =>
      prev.map((c) => (c.id === item.id ? updated : c))
    );
  };

  const removeChore = async (id: number) => {
    const { error } = await supabase
      .from('chores')
      .delete()
      .eq('id', id);

    if (error) return console.error('❌ Delete error:', error.message);

    setChores((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: visible ? '5%' : '-100%',
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'top 0.4s ease',
          backgroundColor: '#fdf7ec',
          backgroundImage: "url('/maple-wood-texture.jpg')",
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply',
          color: '#000',
          borderRadius: '1.5rem',
          boxShadow: '0 0 30px rgba(0,0,0,0.4)',
          zIndex: 1000,
          width: '88vw',
          maxHeight: '92vh',
          padding: '4rem',
          overflowY: 'auto',
          fontSize: '1.4rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div className="w-full max-w-6xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-yellow-700 hover:text-red-500"
          >
            <XCircle size={40} />
          </button>

          <h2
            className="text-6xl font-bold mb-16 text-center text-black"
            style={{ fontFamily: 'Gloria Hallelujah, cursive', letterSpacing: '1px' }}
          >
            Chore List
          </h2>

          <div className="w-full flex flex-col items-center gap-6 mb-16">
            <div className="flex flex-wrap justify-center gap-8 w-full max-w-4xl">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Chore"
                className="flex-1 min-w-[220px] px-6 py-6 rounded-2xl border border-gray-400 text-4xl bg-white text-center shadow-inner"
              />
              <input
                type="date"
                value={completedBy}
                onChange={(e) => setCompletedBy(e.target.value)}
                className="w-[220px] px-6 py-6 rounded-2xl border border-gray-400 text-4xl bg-white text-center shadow-inner"
              />
              <button
                onClick={addChore}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold px-10 py-6 rounded-2xl shadow-lg text-4xl transition-all"
              >
                Add
              </button>
            </div>
          </div>

          <ul className="space-y-6">
            {chores.map((item) => (
              <li
                key={item.id}
                className={`flex justify-between items-center px-10 py-6 rounded-2xl shadow-xl transition-all ${
                  item.done
                    ? 'bg-green-200 line-through text-gray-500'
                    : 'bg-white text-black'
                }`}
                style={{
                  border: item.done ? '3px solid #22c55e' : '3px solid #ccc',
                }}
              >
                <div>
                  <span className="text-4xl font-bold">{item.task}</span>
                  <span className="block text-2xl italic text-gray-600 mt-1">
                    Due: {new Date(item.completed_by).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-6 items-center">
                  <button
                    onClick={() => toggleDone(item)}
                    className={`transition-all ${
                      item.done ? 'text-green-700' : 'text-gray-400 hover:text-green-600'
                    }`}
                  >
                    <CheckCircle size={42} />
                  </button>
                  <button
                    onClick={() => removeChore(item.id)}
                    className="text-red-500 hover:text-red-700 transition-transform hover:scale-110"
                  >
                    <Trash2 size={38} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ChoreModal;
