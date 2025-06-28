import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

interface GroceryItem {
  id: number;
  name: string;
  quantity: string;
  created_at: string;
  checked: boolean;
}

const GroceryListPanel = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const fetchItems = async () => {
    const { data, error } = await supabase.from('grocery_items').select('*').order('created_at', { ascending: true });
    if (error) console.error('❌ Error fetching items:', error);
    else setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from('grocery_items').insert({ name, quantity, checked: false });
    if (error) console.error('❌ Error adding item:', error);
    setName('');
    setQuantity('');
    fetchItems();
  };

  const toggleChecked = async (id: number, checked: boolean) => {
    const { error } = await supabase.from('grocery_items').update({ checked: !checked }).eq('id', id);
    if (error) console.error('❌ Error updating item:', error);
    fetchItems();
  };

  const deleteItem = async (id: number) => {
    const { error } = await supabase.from('grocery_items').delete().eq('id', id);
    if (error) console.error('❌ Error deleting item:', error);
    fetchItems();
  };

  return (
    <div className="p-4 w-full h-full bg-zinc-100 rounded-2xl shadow-inner overflow-y-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">🛒 Grocery List</h2>

      <div className="flex gap-2 mb-4 justify-center">
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 rounded-md border w-1/3"
        />
        <input
          type="text"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="px-3 py-2 rounded-md border w-1/6"
        />
        <button
          onClick={addItem}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <motion.li
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-lg shadow-sm ${item.checked ? 'bg-green-100 line-through' : 'bg-white'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleChecked(item.id, item.checked)}
              />
              <span className="font-medium text-lg">{item.name}</span>
              {item.quantity && <span className="text-sm text-gray-500">({item.quantity})</span>}
            </div>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryListPanel;
