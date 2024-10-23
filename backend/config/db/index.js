const mongoose = require('mongoose');

async function connect(){
    try {
        await mongoose.connect( process.env.MONGODB_URL,{
        });
        console.log('connect sucessfully!!!')
    } catch (error) {
        console.log('connect fail!!!')
    }
}

module.exports = {connect};

// process.env.MONGODB_URL
// 'mongodb://localhost:27017/students-management'