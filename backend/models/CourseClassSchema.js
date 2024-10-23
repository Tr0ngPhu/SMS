const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const CoureseClassSchema = new mongoose.Schema({
  
    course_class_id:{
        type: String,
        require: true,
    },
    day_of_week:{
        type: String,
        require: true,
    },
    class_period:{
        type: Number,
        require: true,
    },
    start_period:{
        type: Number,
        require: true,
    },
    end_period:{
        type: Number,
        require: true,
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
    class_room:{
        type:ObjectId,
        ref: 'ClassRoom',
        require: true,

    },

    max_student:{
        type: Number,
        require: true,
    },
    subject:{
        type:ObjectId,
        ref:'Subject',
        require: true,
    },
    teacher:{
        type:ObjectId,
        ref:'User',
        require: true,
    },
    students: {
        type:[ObjectId], ref:'User'
    }

});

module.exports= mongoose.model('CourseClass', CoureseClassSchema);