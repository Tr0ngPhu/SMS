const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ScoresTableSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    scores: [{
        type: ObjectId,
        ref: 'Score'
    }],
    semester: {
        type: ObjectId,
        ref: 'Semester',
        required: true
    },
    status: [String]
});



module.exports = mongoose.model('ScoreTable', ScoresTableSchema);
