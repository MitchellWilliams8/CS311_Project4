import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5001/exercises';

function App() {
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    exerciseName: '',
    weight: '',
    reps: '',
    muscleGroup: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.exerciseName || !formData.weight || !formData.reps) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        alert('Error saving exercise');
        return;
      }

      setFormData({ exerciseName: '', weight: '', reps: '', muscleGroup: '' });
      setEditingId(null);
      fetchExercises();

    } catch (error) {
      console.error('Error saving exercise:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exercise log?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.status === 404) {
        alert('Exercise not found');
      }

      fetchExercises();
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const handleEdit = (exercise) => {
    setEditingId(exercise._id);
    setFormData({
      exerciseName: exercise.exerciseName,
      weight: exercise.weight,
      reps: exercise.reps,
      muscleGroup: exercise.muscleGroup
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ exerciseName: '', weight: '', reps: '', muscleGroup: '' });
  };

  return (
    <div className="container">
      <h1>Workout Log</h1>

      <div className="workout-form">
        <h3>{editingId ? 'Edit Log' : 'Log New Exercise'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="form-label">Exercise Name:</label>
            <input 
              className="form-input"
              type="text" 
              name="exerciseName" 
              value={formData.exerciseName} 
              onChange={handleChange} 
              placeholder="e.g. Bench Press"
            />
          </div>
          
          <div className="input-group">
            <label className="form-label">Weight (lbs/kg):</label>
            <input 
              className="form-input"
              type="number" 
              name="weight" 
              value={formData.weight} 
              onChange={handleChange} 
              placeholder="0"
            />
          </div>

          <div className="input-group">
            <label className="form-label">Reps:</label>
            <input 
              className="form-input"
              type="number" 
              name="reps" 
              value={formData.reps} 
              onChange={handleChange} 
              placeholder="0"
            />
          </div>

          <div className="input-group">
            <label className="form-label">Muscle Group:</label>
            <select 
              className="form-input"
              name="muscleGroup" 
              value={formData.muscleGroup} 
              onChange={handleChange}
            >
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Legs">Legs</option>
              <option value="Arms">Arms</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Core">Core</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success">
            {editingId ? 'Update Log' : 'Add Log'}
          </button>
          
          {editingId && (
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </form>
      </div>

      <table className="workout-table">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Weight</th>
            <th>Reps</th>
            <th>Muscle Group</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exercises.length > 0 ? (
            exercises.map((ex) => (
              <tr key={ex._id}>
                <td>{ex.exerciseName}</td>
                <td>{ex.weight}</td>
                <td>{ex.reps}</td>
                <td>{ex.muscleGroup}</td>
                <td>
                  <button onClick={() => handleEdit(ex)} className="btn-primary">Edit</button>
                  <button onClick={() => handleDelete(ex._id)} className="btn-danger">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No exercises logged yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;