'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

// Types
type Player = {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  inventory: string[];
  progress: any;
};

type GameObject = {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  interactable: boolean;
};

type GameState = {
  player: Player | null;
  objects: GameObject[];
  loading: boolean;
  error: string | null;
};

const GamePage = () => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    player: null,
    objects: [],
    loading: true,
    error: null,
  });
  const [info, setInfo] = useState<string>('');

  // Example: get JWT from cookies for api headers if needed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jwt = document.cookie
        .split('; ')
        .find(row => row.startsWith('jwt='))
        ?.split('=')[1];
      setToken(jwt || null);

      // Optionally get user info from backend
      if (jwt) {
        // Replace with user info endpoint if available
        setUser({ username: 'Player' });
      }
    }
  }, [isAuthenticated]);

  // Fetch player state from backend
  const fetchPlayerState = useCallback(async () => {
    if (!token) return;
    setGameState(prev => ({ ...prev, loading: true }));
    try {
      const res = await api.get('/game/state', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGameState({
        player: res.data.player,
        objects: res.data.objects,
        loading: false,
        error: null,
      });
    } catch {
      setGameState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load game state',
      }));
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchPlayerState();
  }, [token, fetchPlayerState]);

  // Handler: Move player
  const movePlayer = async (dx: number, dz: number) => {
    if (!gameState.player || !token) return;
    try {
      const newPos = {
        ...gameState.player.position,
        x: gameState.player.position.x + dx,
        z: gameState.player.position.z + dz,
      };
      await api.post(
        '/game/move',
        { position: newPos },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGameState(prev =>
        prev.player
          ? {
              ...prev,
              player: { ...prev.player, position: newPos },
              error: null,
            }
          : prev
      );
      setInfo('Player moved!');
    } catch {
      setGameState(prev => ({ ...prev, error: 'Failed to move player' }));
      setInfo('');
    }
  };

  // Handler: Interact with object
  const interactWithObject = async (objectId: string) => {
    if (!token) return;
    try {
      const res = await api.post(
        '/game/interact',
        { object_id: objectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInfo(res.data.message || 'Interaction complete!');
      fetchPlayerState();
    } catch {
      setGameState(prev => ({ ...prev, error: 'Interaction failed' }));
      setInfo('');
    }
  };

  // Handler: Pickup Item
  const pickupItem = async (itemId: string) => {
    if (!token) return;
    try {
      await api.post(
        '/game/pickup',
        { item_id: itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInfo('Item picked up!');
      fetchPlayerState();
    } catch {
      setGameState(prev => ({ ...prev, error: 'Could not pick up item' }));
      setInfo('');
    }
  };

  // Handler: Save progress
  const saveProgress = async () => {
    if (!token) return;
    try {
      await api.post(
        '/game/save',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInfo('Progress saved!');
    } catch {
      setGameState(prev => ({
        ...prev,
        error: 'Could not save progress',
      }));
      setInfo('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center">
        <h2>Please login to play</h2>
      </div>
    );
  }

  if (gameState.loading) {
    return <div>Loading game...</div>;
  }

  return (
    <div>
      <h1>3D Adventure Game</h1>
      <p>Welcome, {user ? user.username : ''}!</p>
      <div>
        <button onClick={() => movePlayer(1, 0)}>Move Right</button>
        <button onClick={() => movePlayer(-1, 0)}>Move Left</button>
        <button onClick={() => movePlayer(0, 1)}>Move Forward</button>
        <button onClick={() => movePlayer(0, -1)}>Move Backward</button>
        <button onClick={saveProgress}>Save Progress</button>
      </div>
      <div>
        <h2>Inventory</h2>
        <ul>
          {gameState.player?.inventory.map((itemId) => (
            <li key={itemId}>
              {itemId}
              <button onClick={() => pickupItem(itemId)}>
                Pick Up
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Nearby Objects</h2>
        <ul>
          {gameState.objects.map((obj) => (
            <li key={obj.id}>
              {obj.name}
              {obj.interactable && (
                <button onClick={() => interactWithObject(obj.id)}>
                  Interact
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Player Position:</strong> X: {gameState.player?.position.x} Y: {gameState.player?.position.y} Z: {gameState.player?.position.z}
      </div>
      {info && <div style={{ color: 'green' }}>{info}</div>}
      {gameState.error && <div style={{ color: 'red' }}>{gameState.error}</div>}
    </div>
  );
};

export default GamePage;
