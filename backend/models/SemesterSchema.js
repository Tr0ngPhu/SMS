const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const SemesterSchema = new mongoose.Schema({
    semester_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    semester_name: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: false,
        default: null
    },
    end_date: {
        type: Date,
        required: false,
        default: null
    }, 
    academic_year: { type: String, required: true },  // Ví dụ: '2024-2025'
});



module.exports = mongoose.model('Semester', SemesterSchema);
