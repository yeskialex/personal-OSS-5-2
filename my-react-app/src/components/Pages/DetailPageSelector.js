import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../Services/apiService';

const DetailPageSelector = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
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

  const detailStyle = {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #ddd'
  };

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const gamesData = await apiService.getAllGames();
      setGames(gamesData);
      setLoading(false);
    } catch (error) {
      setError(`Error loading games: ${error.message}`);
      setLoading(false);
    }
  };

  const handleSelectGame = async () => {
    if (!selectedId) {
      alert('Please select a game first');
      return;
    }

    setLoading(true);
    try {
      const gameData = await apiService.getGameById(selectedId);
      setSelectedGame(gameData);
      setLoading(false);
    } catch (error) {
      setError(`Error loading game: ${error.message}`);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${selectedGame.name}"?`)) {
      try {
        await apiService.deleteGame(selectedGame.id);
        alert(`Successfully deleted game: ${selectedGame.name}`);
        setSelectedGame(null);
        setSelectedId('');
        loadGames();
      } catch (error) {
        alert(`Error deleting game: ${error.message}`);
      }
    }
  };

  if (loading && !selectedGame) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div className="text-center text-muted fst-italic">Loading games...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <div className="text-center">
            <Link to="/list" className="btn btn-secondary">Back to List</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={headerStyle}>Game Details</h1>

        {!selectedGame ? (
          <div>
            <div className="alert alert-info" role="alert">
              Select a game to view its details
            </div>

            <div className="mb-3">
              <label className="form-label">Select a Game:</label>
              <select
                className="form-select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                <option value="">-- Choose a game --</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>
                    {game.name} - {game.platform}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center">
              <Link to="/list" className="btn btn-secondary me-2">
                Back to List
              </Link>
              <button
                onClick={handleSelectGame}
                className="btn btn-primary"
                disabled={!selectedId}
              >
                View Details
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={detailStyle}>
              <h2 className="mb-4">{selectedGame.name}</h2>

              <div className="mb-3">
                <strong>Game ID:</strong>
                <p className="ms-3">{selectedGame.id}</p>
              </div>

              <div className="mb-3">
                <strong>Platform:</strong>
                <p className="ms-3">{selectedGame.platform}</p>
              </div>

              <div className="mb-3">
                <strong>Release Date:</strong>
                <p className="ms-3">{formatDate(selectedGame.released)}</p>
              </div>

              {selectedGame.genre && (
                <div className="mb-3">
                  <strong>Genre:</strong>
                  <p className="ms-3">{selectedGame.genre}</p>
                </div>
              )}

              {selectedGame.developer && (
                <div className="mb-3">
                  <strong>Developer:</strong>
                  <p className="ms-3">{selectedGame.developer}</p>
                </div>
              )}
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setSelectedGame(null);
                  setSelectedId('');
                }}
                className="btn btn-secondary me-2"
              >
                Select Another Game
              </button>
              <Link to="/list" className="btn btn-secondary me-2">
                Back to List
              </Link>
              <Link to="/update" className="btn btn-warning me-2">
                Edit Game
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPageSelector;