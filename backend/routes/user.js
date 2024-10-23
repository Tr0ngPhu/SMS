const middlewareContronller = require('../controllers/middlewareContronller');
const userContronller = require('../controllers/userContronller');
const router = require('express').Router();

router.get('/',middlewareContronller.vertifyToken, userContronller.getAllUsers);
router.get('/teacher', middlewareContronller.vertifyToken, middlewareContronller.vertifyTokenAdmin, userContronller.getUserIsTeacher)
router.get('/profile',middlewareContronller.vertifyToken,userContronller.getProfile)
router.post('/profileId', middlewareContronller.vertifyToken, userContronller.getProfileById)
router.delete('/:id',middlewareContronller.vertifyTokenAdmin, userContronller.deleteUser)
router.put('/:id',middlewareContronller.vertifyTokenAdmin, userContronller.updateUser)

module.exports= router;