const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const CourseRegistrationSchema = new mongoose.Schema({
    student: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    semester:{
        type:ObjectId,
        ref: 'Semester',
        required:true
    },

    course_class:{
        type:ObjectId,
        ref: 'CourseClass',
        required: false
    },
    
    registration_date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('CourseRegistration', CourseRegistrationSchema);
