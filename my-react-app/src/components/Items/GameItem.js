import React from 'react';
import { Link } from 'react-router-dom';

const GameItem = ({ game, onDelete }) => {
  const itemStyle = {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const infoStyle = {
    flex: '1'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '10px'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${game.name}"?`)) {
      onDelete(game.id, game.name);
    }
  };

  return (
    <div style={itemStyle}>
      <div style={infoStyle}>
        <h5 style={{ margin: '0 0 10px 0' }}>{game.name}</h5>
        <p style={{ margin: '5px 0' }}><strong>Platform:</strong> {game.platform}</p>
        <p style={{ margin: '5px 0' }}><strong>Released:</strong> {formatDate(game.released)}</p>
        <p style={{ margin: '5px 0' }}><strong>ID:</strong> {game.id}</p>
      </div>
      <div style={buttonGroupStyle}>
        <Link to={`/detail/${game.id}`} className="btn btn-info btn-sm">
          View Details
        </Link>
        <Link to={`/update/${game.id}`} className="btn btn-warning btn-sm">
          Edit
        </Link>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default GameItem;