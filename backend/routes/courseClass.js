const classRoomContronller = require('../controllers/classRoomContronller');
const subjectContronler = require('../controllers/subjectContronler');
const CourseClassContronller = require('../controllers/courseClassContronller');
const userContronller = require('../controllers/userContronller');
const middlewareContronller = require('../controllers/middlewareContronller');
const FacultyContronller = require('../controllers/facultyContronller');
const semesterContronler = require('../controllers/semesterContronler');

const router = require('express').Router();

router.post('/', middlewareContronller.vertifyToken,subjectContronler.findSubjectById,CourseClassContronller.getCourseClass);

router.post('/create', classRoomContronller.findClassRoomById, subjectContronler.findSubjectById,
            userContronller.findTeacherById,CourseClassContronller.createCourseClass)

router.post('/registration-setting', CourseClassContronller.setRegistration);
             
router.post('/curriculum',middlewareContronller.vertifyToken,CourseClassContronller.checkRigistrationSettting,
             semesterContronler.findSemesterById,subjectContronler.getCurriculumBySemester);

router.delete('/:id', CourseClassContronller.deleteCourseClass);

router.post('/register', middlewareContronller.vertifyToken, subjectContronler.findSubjectById,
    semesterContronler.findSemesterById, CourseClassContronller.checkRegisterCourse, CourseClassContronller.registerCourseClass
);
router.get('/students/:courseClassId', CourseClassContronller.findCourseClassById,CourseClassContronller.getStudentByCourseClass)
 

router.post('/get-courses-registered', middlewareContronller.vertifyToken,semesterContronler.findSemesterById, 
    CourseClassContronller.getRegisteredCourses)
    
router.delete('/register/:id', CourseClassContronller.cancelCourseClass);
module.exports= router

router.post('/schedule',middlewareContronller.vertifyToken,semesterContronler.findSemesterById,CourseClassContronller.getSchedule)

