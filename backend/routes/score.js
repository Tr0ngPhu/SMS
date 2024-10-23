const middlewareContronller = require('../controllers/middlewareContronller');
const scoreContronler = require('../controllers/scorecontronler');
const userContronller = require('../controllers/userContronller');
const classContronller = require('../controllers/classContronller')
const router = require('express').Router();

router.post('/add',middlewareContronller.vertifyToken,scoreContronler.findStudentById, scoreContronler.checkTargetAddScoreExist, scoreContronler.addScoreToScoreTable);

router.post('/scoreTableClass/:classId',middlewareContronller.vertifyToken,classContronller.findClassById,scoreContronler.findSubjectAndSemester,scoreContronler.getScoreClass)
router.get('/myscores', middlewareContronller.vertifyToken, scoreContronler.getMyScorebyId)
router.post('/scoreStudent', middlewareContronller.vertifyToken,scoreContronler.getScoreStudentById)
module.exports= router;