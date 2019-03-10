const fs = require('fs-extra');
const multer = require('multer');
const config = require('../config.json');
const User = require('../models/User');
const File = require('../models/File');

const baseDir = 'uploads';

fs.ensureDir(baseDir).catch((e) => {
	console.error(e);
	process.exit(1);
});

const {
	UnknownObjectError, AdminRequiredError,
} = require('../common/errors');


exports.storage = multer.diskStorage({
	destination: (req, file, callback) => callback(null, baseDir),
	filename: async (req, recvFile, callback) => {
		const file = await File.create({ name: recvFile.originalname, createdBy: req.session.userId, mimeType: recvFile.mimetype });
		callback(null, file._id.toString());
	},
});

exports.handleUpload = async (req, res, next) => {
	try {
		await Promise.all(req.files.map(file => File.findByIdAndUpdate(file.filename, { $set: { size: file.size } })));
		return res.sendStatus(204);
	} catch (e) {
		return next(e);
	}
};

exports.getImageFilesData = async (req, res, next) => {
	try {
		const files = await File.find({ mimeType: { $regex: /image.*/ } }).sort('-uploadDate').populate('createdBy', '_id name');
		return res.status(200).send({ files });
	} catch (e) {
		return next(e);
	}
};

exports.getFilesData = async (req, res, next) => {
	try {
		const files = await File.find({}).sort('-uploadDate').populate('createdBy', '_id name');
		return res.status(200).send({ files });
	} catch (e) {
		return next(e);
	}
};

exports.getFileData = async (req, res, next) => {
	try {
		const file = await File.findById(req.params.fileId).populate('createdBy', '_id name');
		return res.status(200).send({ file });
	} catch (e) {
		return next(e);
	}
};

exports.getFile = async (req, res, next) => {
	try {
		const file = await File.findById(req.params.fileId);
		if (!file) throw new UnknownObjectError('File');

		return res.status(200).sendFile(`${file._id}`, { root: baseDir });
	} catch (e) {
		return next(e);
	}
};

exports.downloadFile = async (req, res, next) => {
	try {
		const file = await File.findById(req.params.fileId);
		if (!file) throw new UnknownObjectError('File');

		return res.status(200).download(`${baseDir}/${file._id}`, file.name);
	} catch (e) {
		return next(e);
	}
};

exports.removeFile = async (req, res, next) => {
	try {
		const file = await File.findById(req.params.fileId);
		if (!file) throw new UnknownObjectError('File');

		const user = await User.findById(req.session.userId);
		if (!user.roles.includes(config.adminRole) && req.session.userId !== file.createdBy.toString()) throw new AdminRequiredError();

		await fs.remove(`${baseDir}/${file._id}`);
		await File.findByIdAndRemove(req.params.fileId);

		return res.sendStatus(204);
	} catch (e) {
		return next(e);
	}
};
