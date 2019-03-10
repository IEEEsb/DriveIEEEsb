const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
	authId: { type: String, index: { unique: true, dropDups: true } },
	name: { type: String, required: true },
	roles: [{ type: String }],
});

module.exports = mongoose.model('User', User);
