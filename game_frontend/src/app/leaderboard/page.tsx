'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

type LeaderboardEntry = {
  username: string;
  score: number;
};

const LeaderboardPage = () => {
  const { isAuthenticated } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      // Replace with real endpoint
      const res = await api.get('/leaderboard');
      setEntries(res.data.leaderboard);
      setError(null);
    } catch {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (!isAuthenticated) {
    return <div>Please log in to see the leaderboard.</div>;
  }

  return (
    <div>
      <h1>Leaderboard</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ol>
        {entries.map((entry, idx) => (
          <li key={entry.username}>
            #{idx + 1} {entry.username}: {entry.score}
          </li>
        ))}
      </ol>
      <button onClick={fetchLeaderboard}>Refresh Leaderboard</button>
    </div>
  );
};

export default LeaderboardPage;
