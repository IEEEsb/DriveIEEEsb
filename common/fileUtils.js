const fs = require('fs').promises;

const {
	DirNotExistsError,
} = require('../common/errors');

exports.ensureExists = async (path) => {
	try {
		const result = await fs.access(path, fs.constants.F_OK);
		if (!result) return false;
		await fs.mkdir(path, { recursive: true });
		return true;
	} catch (e) {
		return false;
	}
};

exports.listFiles = async (path) => {
	try {

	} catch (e) {
		return false;
	}
	return new Promise(function (resolve, reject) {
		exports.ensureExists(path).then(function () {
			fs.readdir(path, function (err, files) {
				if (err) return reject(err);
				else return resolve(files);
			});
		}, function (err) {
			return reject(err);
		});
	});
};

exports.deleteFile = function (path) {
	return new Promise(function (resolve, reject) {
		fs.unlink(path, function (err) {
			if (err) {
				if (err.code == 'ENOENT') return resolve();
				else return reject(err);
			}
			else return resolve();
		});
	});
};

exports.rmdirAsync = function (path) {
	return new Promise(function (resolve, reject) {
		rimraf(path, function (err) {
			if (err) return reject(err);
			else return resolve();
		})
	})
}

exports.writeFile = function (data, path) {
	return new Promise(function (resolve, reject) {
		exports.ensureExists(path).then(function () {
			fs.writeFile(data, path, function (err) {
				if (err) return reject(err);
				else return resolve();
			})
		}, function (err) {
			if (err) return reject(err);
		});
	})
}

exports.access = function(path) {
	return new Promise((resolve, reject) =>{
		fs.access(path, (err) => {
			if(err) return reject(err);
			else return resolve();
		})
	});
}

exports.init = function () {
	return exports.ensureExists('./logs').then(() => { return exports.ensureExists('./uploaded') });
}
