const classContronller = require('../controllers/classContronller');
const middlewareContronller = require('../controllers/middlewareContronller')
const facultyContronller = require('../controllers/facultyContronller')
const majorContronller = require('../controllers/majorContronller')
const router = require('express').Router();

router.post('/',middlewareContronller.vertifyToken,middlewareContronller.vertifyTokenTeacherOrAdmin,facultyContronller.checkFacultyExisted, classContronller.getClass);
router.post('/create/:teacherId',middlewareContronller.vertifyToken,middlewareContronller.vertifyTokenAdmin,classContronller.findTeacherById,facultyContronller.checkFacultyExisted,majorContronller.findMajorById ,classContronller.createClass)
router.delete('/:classId',middlewareContronller.vertifyToken,middlewareContronller.vertifyTokenAdmin,classContronller.findClassById, classContronller.deleteClass);
router.get('/:classId/',middlewareContronller.vertifyToken,middlewareContronller.vertifyTokenTeacherOrAdmin, classContronller.findClassById, classContronller.getStudentByClass);
router.post('/addStudent/:classId',middlewareContronller.vertifyToken, middlewareContronller.vertifyTokenTeacherOrAdmin ,classContronller.findClassById, classContronller.addStudentToClass);
router.delete('/:classId/:studentId',middlewareContronller.vertifyToken, middlewareContronller.vertifyTokenTeacherOrAdmin,classContronller.findClassById, classContronller.deleteStudent);

module.exports= router;
