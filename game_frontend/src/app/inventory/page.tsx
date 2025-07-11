'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

const InventoryPage = () => {
  const { isAuthenticated } = useAuth();
  const [inventory, setInventory] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      // Replace with real endpoint
      const res = await api.get('/inventory');
      setInventory(res.data.inventory);
      setError(null);
    } catch {
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  if (!isAuthenticated) {
    return <div>Please log in to view your inventory.</div>;
  }

  return (
    <div>
      <h1>Inventory</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <ul>
          {inventory.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      <button onClick={fetchInventory}>Refresh Inventory</button>
    </div>
  );
};

export default InventoryPage;
