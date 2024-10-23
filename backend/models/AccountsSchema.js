const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const AccoutSchema = new mongoose.Schema({
    user: {
        type: ObjectId ,ref:'User', 
        required: true,
    },

    email_id:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        minlength: 6,
    }
});


module.exports= mongoose.model('Account', AccoutSchema);