const express = require('express');
const multer = require('multer');
const authController = require('./controllers/authController');
const filesController = require('./controllers/filesController');
const config = require('./config.json');

const upload = multer({ storage: filesController.storage });

const {
	validators, validate,
} = require('./controllers/validators');

function selfUser(req, res, next) {
	req.params.userId = req.session.userId;
	next();
}

const authRouter = express.Router();

authRouter.get('/', authController.getServiceData);

const userRouter = express.Router();

userRouter.post('/login', validate(validators.login), authController.login);

// Endpoints that require authentication
userRouter.use(authController.authRequired);

userRouter.get('/self', selfUser, authController.getUser);
userRouter.post('/logout', authController.logout);

// Endpoints limited to administrators
userRouter.use(authController.adminRequired);

userRouter.get('/all', authController.getAllUsers);
userRouter.get('/:userId', authController.getUser);
userRouter.post('/:userId/addRole', validate(validators.addRole), authController.addRole);

const fileRouter = express.Router();

fileRouter.get('/:fileId', filesController.getFile);
fileRouter.get('/:fileId/download', filesController.downloadFile);

// Endpoints that require authentication
fileRouter.use(authController.roleRequired(config.editRole));

fileRouter.get('/all/data', filesController.getFilesData);
fileRouter.get('/:fileId/data', filesController.getFileData);
fileRouter.get('/all/image/data', filesController.getImageFilesData);
fileRouter.post('/upload', upload.array('file'), filesController.handleUpload);
fileRouter.delete('/:fileId', filesController.removeFile);

const router = express.Router();

router.use('/api/auth', authRouter);
router.use('/api/user', userRouter);
router.use('/api/file', fileRouter);

module.exports = router;
