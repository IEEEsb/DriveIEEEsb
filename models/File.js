const mongoose = require('mongoose');

const { Schema } = mongoose;

const File = new Schema({
	name: { type: String, required: true },
	uploadDate: { type: Date, default: Date.now },
	createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	mimeType: { type: String, required: true },
	size: { type: Number, default: 0 },
});

module.exports = mongoose.model('File', File);
