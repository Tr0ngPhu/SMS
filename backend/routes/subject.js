const router = require('express').Router();
const middlewareContronller = require('../controllers/middlewareContronller');
const subjectContronler = require('../controllers/subjectContronler');
const semesterContronler = require('../controllers/semesterContronler');
const FacultyContronller = require('../controllers/facultyContronller');
const MajorContronller = require('../controllers/majorContronller');

router.post('/', middlewareContronller.vertifyToken,FacultyContronller.checkFacultyExisted,subjectContronler.getSubjectByFaculty)
router.post('/curriculum',FacultyContronller.checkFacultyExisted,MajorContronller.findMajorById, subjectContronler.getCurriculum);
router.post('/create', middlewareContronller.vertifyToken, FacultyContronller.checkFacultyExisted, subjectContronler.createSubject);
router.post('/add',semesterContronler.findSemesterById,FacultyContronller.checkFacultyExisted,MajorContronller.findMajorById,
    subjectContronler.findSubjectById ,subjectContronler.checkAddSubject, subjectContronler.addSubject);
router.post('/update/:id',middlewareContronller.vertifyToken,middlewareContronller.vertifyTokenAdmin,subjectContronler.updateSubject);
router.post('/curriculum/semester/add',semesterContronler.findSemesterById,FacultyContronller.checkFacultyExisted,MajorContronller.findMajorById,
    subjectContronler.addSemesterToCurriculum);
router.delete('/delete/:id', middlewareContronller.vertifyToken, middlewareContronller.vertifyTokenAdmin, subjectContronler.deleteSubject);
router.delete('/curriculum/:curriculumId/:subjectId', subjectContronler.removeCurriculumSubject);
module.exports = router;
    