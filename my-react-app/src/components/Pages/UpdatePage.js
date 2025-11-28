import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../Services/apiService';

const UpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    released: '',
    genre: '',
    developer: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [changeCount, setChangeCount] = useState(0); // Track total changes
  const [lastSaved, setLastSaved] = useState('');
  const [errors, setErrors] = useState({});


  const nameRef = useRef(null);
  const platformRef = useRef(null);
  const releasedRef = useRef(null);
  const genreRef = useRef(null);
  const developerRef = useRef(null);

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '700px',
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
    loadGame();
  }, [id]);

  const loadGame = async () => {
    try {
      const gameData = await apiService.getGameById(id);
      const formattedDate = gameData.released
        ? new Date(gameData.released).toISOString().split('T')[0]
        : '';

      setFormData({
        name: gameData.name || '',
        platform: gameData.platform || '',
        released: formattedDate,
        genre: gameData.genre || '',
        developer: gameData.developer || ''
      });
      setLoading(false);
    } catch (error) {
      setError(`Error loading game: ${error.message}`);
      setLoading(false);
    }
  };

  const validateField = (fieldName, value) => {
    let isValid = true;
    const newErrors = { ...errors };

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Game name is required';
          nameRef.current.style.borderColor = 'red';
          isValid = false;
        } else {
          delete newErrors.name;
          nameRef.current.style.borderColor = '';
        }
        break;

      case 'platform':
        if (!value.trim()) {
          newErrors.platform = 'Platform is required';
          platformRef.current.style.borderColor = 'red';
          isValid = false;
        } else {
          delete newErrors.platform;
          platformRef.current.style.borderColor = '';
        }
        break;

      case 'released':
        if (!value) {
          newErrors.released = 'Release date is required';
          releasedRef.current.style.borderColor = 'red';
          isValid = false;
        } else {
          delete newErrors.released;
          releasedRef.current.style.borderColor = '';
        }
        break;

      case 'genre':
        if (value && value.length > 0 && value.length < 2) {
          newErrors.genre = 'Genre must be at least 2 characters';
          genreRef.current.style.borderColor = 'red';
          isValid = false;
        } else {
          delete newErrors.genre;
          if (genreRef.current) genreRef.current.style.borderColor = '';
        }
        break;

      case 'developer':
        if (value && value.length > 0 && value.length < 2) {
          newErrors.developer = 'Developer must be at least 2 characters';
          developerRef.current.style.borderColor = 'red';
          isValid = false;
        } else {
          delete newErrors.developer;
          if (developerRef.current) developerRef.current.style.borderColor = '';
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Auto-save on change - immediate API call without submit button
  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    // Update local state immediately
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate the field
    const isValid = validateField(name, value);

    // Only save if validation passes
    if (isValid) {
      setSaving(true);

      try {
        // Prepare update data
        const updateData = { [name]: value };

        // Special handling for date field
        if (name === 'released') {
          updateData.released = new Date(value).toISOString();
        }

        // Auto-save: immediate PUT request
        await apiService.updateGame(id, updateData);

        // Update tracking
        setChangeCount(prev => prev + 1);
        setLastSaved(`Field "${name}" saved at ${new Date().toLocaleTimeString()}`);

        // Clear save message after 2 seconds
        setTimeout(() => setLastSaved(''), 2000);
      } catch (error) {
        alert(`Error saving ${name}: ${error.message}`);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleFullUpdate = async () => {
    // Validate all fields
    let isValid = true;
    ['name', 'platform', 'released'].forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    if (!isValid) {
      alert('Please fix validation errors before saving all changes');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        released: new Date(formData.released).toISOString()
      };

      await apiService.updateGame(id, updateData);
      alert('All changes saved successfully!');
      navigate('/list');
    } catch (error) {
      alert(`Error updating game: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div className="text-center text-muted fst-italic">Loading game data...</div>
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
        <h1 style={headerStyle}>Update Game</h1>

        <div className="alert alert-primary mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <span><strong>Game ID:</strong> {id}</span>
            <span className="text-primary"><strong>Total Changes Made:</strong> {changeCount}</span>
          </div>
          {lastSaved && (
            <div className="text-success mt-2 small">
              {lastSaved}
            </div>
          )}
          {saving && (
            <div className="text-info mt-2">
              <span className="spinner-border spinner-border-sm me-2"></span>
              Saving...
            </div>
          )}
        </div>

        <div className="alert alert-info mb-4" role="alert">
          <strong>Auto-Save Enabled:</strong> Changes are saved automatically when you modify any field. No submit button needed!
        </div>

        <form>
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
              disabled={saving}
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
              disabled={saving}
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
              disabled={saving}
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
              placeholder="Enter genre"
              disabled={saving}
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
              placeholder="Enter developer"
              disabled={saving}
            />
            {errors.developer && <div className="text-danger small mt-1">{errors.developer}</div>}
          </div>

          <div className="text-center mt-4">
            <Link to="/list" className="btn btn-secondary me-2">
              Back to List
            </Link>
            <Link to={`/detail/${id}`} className="btn btn-info me-2">
              View Details
            </Link>
            <button
              type="button"
              onClick={handleFullUpdate}
              className="btn btn-success"
              disabled={saving}
            >
              Save All & Exit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePage;