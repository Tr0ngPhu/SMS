const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ScoreSchema = new mongoose.Schema({
    score: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    },
    subject: {
        type: ObjectId,
        ref: 'Subject',
        required: true
    },
});

module.exports = mongoose.model('Score', ScoreSchema);
