import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameItem from '../Items/GameItem';
import { apiService } from '../Services/apiService';

const ListPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  };

  const contentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  const headerStyle = {
    color: '#333',
    textAlign: 'center',
    marginBottom: '30px'
  };

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoading(true);
    setMessage({ text: 'Loading games...', type: 'loading' });

    try {
      const gamesData = await apiService.getAllGames();
      setGames(gamesData);
      setMessage({ text: `Successfully loaded ${gamesData.length} games`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: `Error loading games: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (id, name) => {
    try {
      await apiService.deleteGame(id);
      setMessage({ text: `Successfully deleted game: ${name}`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      loadGames();
    } catch (error) {
      setMessage({ text: `Error deleting game: ${error.message}`, type: 'error' });
    }
  };

  const renderMessage = () => {
    if (!message.text) return null;

    let className = '';
    if (message.type === 'error') {
      className = 'alert alert-danger';
    } else if (message.type === 'success') {
      className = 'alert alert-success';
    } else if (message.type === 'loading') {
      className = 'alert alert-info';
    }

    return (
      <div className={className} role="alert">
        {message.text}
      </div>
    );
  };

  const renderGamesList = () => {
    if (loading) {
      return <div className="text-center text-muted fst-italic">Loading games...</div>;
    }

    if (games.length === 0) {
      return <div className="text-center text-muted fst-italic">No games found</div>;
    }

    return (
      <div>
        <h3>Games List ({games.length} games):</h3>
        {games.map(game => (
          <GameItem
            key={game.id}
            game={game}
            onDelete={handleDeleteGame}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={headerStyle}>Game Database - List</h1>

        {renderMessage()}

        <div className="text-center mb-4">
          <Link to="/create" className="btn btn-primary btn-lg me-3">
            Add New Game
          </Link>
          <button
            type="button"
            className="btn btn-info btn-lg"
            onClick={loadGames}
          >
            Refresh List
          </button>
        </div>

        <div style={{ marginTop: '30px' }}>
          {renderGamesList()}
        </div>
      </div>
    </div>
  );
};

export default ListPage;