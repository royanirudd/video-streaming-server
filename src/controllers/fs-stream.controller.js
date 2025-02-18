const fs = require('fs');
const { getVideoPath, validateVideoFile } = require('../utils/video-utils');

const streamVideo = async (req, res) => {
	try {
		const { filename } = req.params;
		validateVideoFile(filename);

		const videoPath = getVideoPath(filename);
		const stat = await fs.promises.stat(videoPath);
		const fileSize = stat.size;
		const range = req.headers.range;

		if (range) {
			// Parse Range
			// Example: "bytes=32324-"
			const parts = range.replace(/bytes=/, '').split('-');
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
			const chunksize = (end - start) + 1;
			const file = fs.createReadStream(videoPath, { start, end });
			const head = {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize,
				'Content-Type': 'video/mp4',
			};

			res.writeHead(206, head);
			file.pipe(res);
		} else {
			// No Range header - send entire file
			const head = {
				'Content-Length': fileSize,
				'Content-Type': 'video/mp4',
			};
			res.writeHead(200, head);
			fs.createReadStream(videoPath).pipe(res);
		}
	} catch (error) {
		console.error('Error:', error.message);
		res.status(error.message.includes('Invalid video') ? 400 : 500)
			.json({ error: error.message });
	}
};

module.exports = {
	streamVideo
};
