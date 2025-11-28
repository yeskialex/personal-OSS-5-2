import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../Services/apiService';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
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
    loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      const gameData = await apiService.getGameById(id);
      setGame(gameData);
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
    if (window.confirm(`Are you sure you want to delete "${game.name}"?`)) {
      try {
        await apiService.deleteGame(id);
        alert(`Successfully deleted game: ${game.name}`);
        navigate('/list');
      } catch (error) {
        alert(`Error deleting game: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div className="text-center text-muted fst-italic">Loading game details...</div>
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

  if (!game) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div className="alert alert-warning" role="alert">
            Game not found
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

        <div style={detailStyle}>
          <h2 className="mb-4">{game.name}</h2>

          <div className="mb-3">
            <strong>Game ID:</strong>
            <p className="ms-3">{game.id}</p>
          </div>

          <div className="mb-3">
            <strong>Platform:</strong>
            <p className="ms-3">{game.platform}</p>
          </div>

          <div className="mb-3">
            <strong>Release Date:</strong>
            <p className="ms-3">{formatDate(game.released)}</p>
          </div>

          {game.genre && (
            <div className="mb-3">
              <strong>Genre:</strong>
              <p className="ms-3">{game.genre}</p>
            </div>
          )}

          {game.developer && (
            <div className="mb-3">
              <strong>Developer:</strong>
              <p className="ms-3">{game.developer}</p>
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          <Link to="/list" className="btn btn-secondary me-2">
            Back to List
          </Link>
          <Link to={`/update/${game.id}`} className="btn btn-warning me-2">
            Edit Game
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;