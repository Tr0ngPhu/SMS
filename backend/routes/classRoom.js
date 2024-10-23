const ClassRoomContronller = require('../controllers/classRoomContronller');
const router = require('express').Router();

router.get('/', ClassRoomContronller.getClassRoom);
router.post('/create',ClassRoomContronller.createClassRoom);
router.delete('/:id', ClassRoomContronller.deleteClassRoom);

module.exports= router