const FacultyContronller = require('../controllers/facultyContronller');
const middlewareContronller = require('../controllers/middlewareContronller')
const router = require('express').Router();

router.get('/',  middlewareContronller.vertifyToken,FacultyContronller.getFaculty);
router.post('/create',  middlewareContronller.vertifyToken,FacultyContronller.createFaculty);
router.delete('/:id',  middlewareContronller.vertifyToken,FacultyContronller.deleteFaculty);
module.exports= router;