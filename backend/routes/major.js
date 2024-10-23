const FacultyContronller = require('../controllers/facultyContronller');
const MajorContronller = require('../controllers/majorContronller');

const router = require('express').Router();

router.get('/', MajorContronller.getMajorsByFaculty);
router.post('/facultyid', FacultyContronller.checkFacultyExisted, MajorContronller.getMajorsByFacultyId)
router.post('/create',FacultyContronller.checkFacultyExisted, MajorContronller.createMajor);
router.delete('/:id', MajorContronller.deleteMajor);

module.exports= router;