const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/workout_log')
    .then(() => console.log('Connected to local MongoDB (workout_log database)'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const exerciseSchema = new mongoose.Schema({
    exerciseName: { type: String, required: true },
    weight: { type: Number, required: true },
    reps: { type: Number, required: true },
    muscleGroup: { 
        type: String, 
        required: true,
        enum: ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'] 
    }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

app.post('/exercises', async (req, res) => {
    try {
        const exercise = new Exercise(req.body);
        const savedExercise = await exercise.save();
        res.status(201).json(savedExercise);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/exercises', async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/exercises/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedExercise = await Exercise.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!updatedExercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        res.json(updatedExercise);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/exercises/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExercise = await Exercise.findByIdAndDelete(id);

        if (!deletedExercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        res.json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});