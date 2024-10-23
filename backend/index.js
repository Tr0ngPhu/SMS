const bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const db = require('./config/db');
  
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const classRoute = require('./routes/class');
const semesterRoute = require('./routes/semester');
const subjectRoute = require('./routes/subject');
const scoreRoute = require('./routes/score');
const facultyRoute= require('./routes/faculty');
const majorRoute = require('./routes/major');
const classRoomRoute = require('./routes/classRoom')
const courseClassRoute = require('./routes/courseClass')

const app = express();
dotenv.config();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

db.connect();

//ROUTES
app.use(bodyParser.json()) ;
app.use('/v1/auth',authRoute);
app.use('/v1/user',userRoute);
app.use('/v1/class',classRoute);
app.use('/v1/semester',semesterRoute);
app.use('/v1/subject',subjectRoute);
app.use('/v1/score',scoreRoute);
app.use('/v1/faculty',facultyRoute);
app.use('/v1/major',majorRoute);
app.use('/v1/classroom',classRoomRoute);
app.use('/v1/courseclass',courseClassRoute);

app.listen(3000,() =>{
    console.log('server is running')
})