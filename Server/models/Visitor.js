import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;