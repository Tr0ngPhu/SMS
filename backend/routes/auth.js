
const authContronllers = require('../controllers/authContronller');
const router = require('express').Router();
const middlewareContronller = require('../controllers/middlewareContronller')

router.get('/account', middlewareContronller.vertifyToken, middlewareContronller.vertifyTokenAdmin, authContronllers.getAccountController);

router.post('/register', authContronllers.registerUser );

router.post('/login', authContronllers.loginUser);

router.post('/refresh', authContronllers.requestRefreshToken);

router.post('/logout',middlewareContronller.vertifyToken, authContronllers.userLogoutContronller)
module.exports= router;