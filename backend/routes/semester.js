const middlewareContronller = require('../controllers/middlewareContronller');
const semesterContronler = require('../controllers/semesterContronler');
const router = require('express').Router();

router.get('/', middlewareContronller.vertifyToken, semesterContronler.getSemester)

router.post('/add', middlewareContronller.vertifyToken,semesterContronler.addSemester);
// router.get('/semesterId', middlewareContronller.vertifyToken, semesterContronler.findSemesterById)

module.exports = router;