const path = require('path');

const getVideoPath = (filename) => {
	return path.join(__dirname, '../../videos', filename);
};

const validateVideoFile = (filename) => {
	if (!filename.match(/\.(mp4|mov|avi|mkv)$/i)) {
		throw new Error('Invalid video file format');
	}
	return true;
};

module.exports = {
	getVideoPath,
	validateVideoFile
};
