const Counter = require('./models/Counter');

const getNextSequence = async (counterName) => {
  const updatedCounter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return updatedCounter.sequence_value;
};

module.exports = {
  getNextSequence,
};
