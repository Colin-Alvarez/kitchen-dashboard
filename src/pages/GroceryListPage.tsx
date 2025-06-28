// src/pages/GroceryListPage.tsx
import React from 'react';
import GroceryListEditor from '../components/GroceryListEditor';
import GroceryListExport from '../components/GroceryListExport';

const GroceryListPage = () => {
  return (
    <div className="w-full h-full bg-gray-100 text-black font-sans overflow-auto p-6">
      <h1 className="text-3xl font-bold mb-4">🛒 Full Grocery List</h1>

      <div className="mb-6">
        <GroceryListExport />
      </div>

      <GroceryListEditor />
    </div>
  );
};

export default GroceryListPage;
