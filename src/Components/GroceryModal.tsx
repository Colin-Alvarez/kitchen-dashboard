import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { XCircle, Trash2, CheckCircle } from 'lucide-react';

interface GroceryItem {
  id: number;
  name: string;
  quantity: string | null;
  checked: boolean;
}

const GroceryModal = ({ onClose }: { onClose: () => void }) => {
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchGroceries = async () => {
      const { data, error } = await supabase
        .from('grocery_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) console.error('❌ Supabase fetch error:', error.message);
      else setGroceries(data as GroceryItem[]);
    };

    fetchGroceries();
    setVisible(true);
  }, []);

  const addItem = async () => {
    if (!newName.trim()) return;

    const { data, error } = await supabase
      .from('grocery_items')
      .insert([{ name: newName, quantity: newQty, checked: false }])
      .select();

    if (error) return console.error('❌ Add error:', error.message);
    if (data) setGroceries([...groceries, data[0]]);

    setNewName('');
    setNewQty('');
  };

  const toggleChecked = async (item: GroceryItem) => {
    const updated = { ...item, checked: !item.checked };

    const { error } = await supabase
      .from('grocery_items')
      .update({ checked: updated.checked })
      .eq('id', item.id);

    if (error) return console.error('❌ Update error:', error.message);

    setGroceries((prev) =>
      prev.map((g) => (g.id === item.id ? updated : g))
    );
  };

  const removeItem = async (id: number) => {
    const { error } = await supabase
      .from('grocery_items')
      .delete()
      .eq('id', id);

    if (error) return console.error('❌ Delete error:', error.message);

    setGroceries((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {/* Blurred Backdrop */}
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

      {/* Modal Panel */}
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
            Grocery Command Center
          </h2>

          <div className="w-full flex flex-col items-center gap-6 mb-16">
            <div className="flex flex-wrap justify-center gap-8 w-full max-w-4xl">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Item"
                className="flex-1 min-w-[220px] px-6 py-6 rounded-2xl border border-gray-400 text-4xl bg-white text-center shadow-inner"
              />
              <input
                type="text"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
                placeholder="Qty"
                className="w-[150px] px-6 py-6 rounded-2xl border border-gray-400 text-4xl bg-white text-center shadow-inner"
              />
              <button
                onClick={addItem}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold px-10 py-6 rounded-2xl shadow-lg text-4xl transition-all"
              >
                Add
              </button>
            </div>
          </div>

          <ul className="space-y-6">
            {groceries.map((item) => (
              <li
                key={item.id}
                className={`flex justify-between items-center px-10 py-6 rounded-2xl shadow-xl transition-all ${
                  item.checked
                    ? 'bg-green-200 line-through text-gray-500'
                    : 'bg-white text-black'
                }`}
                style={{
                  border: item.checked ? '3px solid #22c55e' : '3px solid #ccc',
                }}
              >
                <div>
                  <span className="text-4xl font-bold">{item.name}</span>
                  {item.quantity && (
                    <span className="block text-2xl italic text-gray-600 mt-1">
                      Qty: {item.quantity}
                    </span>
                  )}
                </div>
                <div className="flex gap-6 items-center">
                  <button
                    onClick={() => toggleChecked(item)}
                    className={`transition-all ${
                      item.checked ? 'text-green-700' : 'text-gray-400 hover:text-green-600'
                    }`}
                  >
                    <CheckCircle size={42} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
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

export default GroceryModal;
