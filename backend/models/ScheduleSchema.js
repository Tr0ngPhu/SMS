const mongoose = require('mongoose');
const ObjectId =  mongoose.Types.ObjectId

const ScheduleSchema = new mongoose.Schema({
    user:{
        type:ObjectId,
        ref: 'User',
        required: true
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
    }
});

module.exports= mongoose.model('Schedule', ScheduleSchema);