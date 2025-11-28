import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../Services/apiService';

const CreatePage = () => {
  const navigate = useNavigate();

  // useState for form handling
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    released: '',
    genre: '',
    developer: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // useRef for validation
  const nameRef = useRef(null);
  const platformRef = useRef(null);
  const releasedRef = useRef(null);
  const genreRef = useRef(null);
  const developerRef = useRef(null);

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!nameRef.current.value.trim()) {
      newErrors.name = 'Game name is required';
      nameRef.current.style.borderColor = 'red';
      nameRef.current.focus();
      isValid = false;
    } else {
      nameRef.current.style.borderColor = '';
    }

    if (!platformRef.current.value.trim()) {
      newErrors.platform = 'Platform is required';
      platformRef.current.style.borderColor = 'red';
      if (isValid) platformRef.current.focus();
      isValid = false;
    } else {
      platformRef.current.style.borderColor = '';
    }

    if (!releasedRef.current.value) {
      newErrors.released = 'Release date is required';
      releasedRef.current.style.borderColor = 'red';
      if (isValid) releasedRef.current.focus();
      isValid = false;
    } else {
      releasedRef.current.style.borderColor = '';
    }

    if (genreRef.current.value && genreRef.current.value.length < 2) {
      newErrors.genre = 'Genre must be at least 2 characters';
      genreRef.current.style.borderColor = 'red';
      if (isValid) genreRef.current.focus();
      isValid = false;
    } else {
      genreRef.current.style.borderColor = '';
    }

    if (developerRef.current.value && developerRef.current.value.length < 2) {
      newErrors.developer = 'Developer must be at least 2 characters';
      developerRef.current.style.borderColor = 'red';
      if (isValid) developerRef.current.focus();
      isValid = false;
    } else {
      developerRef.current.style.borderColor = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const gameData = {
        ...formData,
        released: new Date(formData.released).toISOString()
      };

      await apiService.addGame(gameData);
      alert(`Successfully added game: ${formData.name}`);
      navigate('/list');
    } catch (error) {
      alert(`Error adding game: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={headerStyle}>Add New Game</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Game Name *</label>
            <input
              ref={nameRef}
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter game name"
            />
            {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Platform *</label>
            <select
              ref={platformRef}
              className="form-select"
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
            >
              <option value="">Select Platform</option>
              <option value="PC">PC</option>
              <option value="PlayStation">PlayStation</option>
              <option value="Xbox">Xbox</option>
              <option value="Nintendo Switch">Nintendo Switch</option>
              <option value="Mobile">Mobile</option>
            </select>
            {errors.platform && <div className="text-danger small mt-1">{errors.platform}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Release Date *</label>
            <input
              ref={releasedRef}
              type="date"
              className="form-control"
              name="released"
              value={formData.released}
              onChange={handleInputChange}
            />
            {errors.released && <div className="text-danger small mt-1">{errors.released}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Genre (Optional)</label>
            <input
              ref={genreRef}
              type="text"
              className="form-control"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              placeholder="Enter genre (e.g., Action, RPG, Strategy)"
            />
            {errors.genre && <div className="text-danger small mt-1">{errors.genre}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Developer (Optional)</label>
            <input
              ref={developerRef}
              type="text"
              className="form-control"
              name="developer"
              value={formData.developer}
              onChange={handleInputChange}
              placeholder="Enter developer name"
            />
            {errors.developer && <div className="text-danger small mt-1">{errors.developer}</div>}
          </div>

          <div className="text-center mt-4">
            <Link to="/list" className="btn btn-secondary me-2">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;