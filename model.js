const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://web4200:de53zYlMC2bg5lHh@cluster0.8fyqb.mongodb.net/tracker?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const intakeSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['dairy', 'protein', 'vegetables', 'fruits', 'grains']
  },
  food: {
    type: String,
    required: true
  },
  serving: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
});

const Intake = mongoose.model('Intake', intakeSchema);

module.exports = {
  Intake: Intake,
};
