const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { getVideoPath, validateVideoFile } = require('../utils/video-utils');

const SEGMENT_DURATION = 10;

const getHLSDirectory = (filename) => {
	const basename = path.basename(filename, path.extname(filename));
	return path.join(__dirname, '../../public/hls', basename);
};

const prepareVideo = async (req, res) => {
	try {
		const { filename } = req.params;
		validateVideoFile(filename);

		const videoPath = getVideoPath(filename);
		const hlsDir = getHLSDirectory(filename);

		if (!fs.existsSync(hlsDir)) {
			fs.mkdirSync(hlsDir, { recursive: true });
		}

		const qualities = [
			{ resolution: '640x360', bitrate: '800k', name: '360p' },
			{ resolution: '842x480', bitrate: '1400k', name: '480p' },
			{ resolution: '1280x720', bitrate: '2800k', name: '720p' }
		];

		let masterPlaylist = '#EXTM3U\n#EXT-X-VERSION:3\n';

		const transcodePromises = qualities.map((quality) => {
			return new Promise((resolve, reject) => {
				const outputPath = path.join(hlsDir, `${quality.name}`);

				ffmpeg(videoPath)
					.outputOptions([
						'-profile:v baseline',
						'-codec:v libx264',
						'-codec:a aac',
						'-ar 44100',
						'-ac 2',
						'-f hls',
						`-hls_time ${SEGMENT_DURATION}`,
						'-hls_list_size 0',
						'-hls_segment_filename', `${outputPath}_%03d.ts`,
						`-vf scale=${quality.resolution}`,
						`-b:v ${quality.bitrate}`,
						'-preset fast'
					])
					.output(`${outputPath}.m3u8`)
					.on('end', () => {
						masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(quality.bitrate)}000,RESOLUTION=${quality.resolution}\n`;
						masterPlaylist += `${quality.name}.m3u8\n`;
						resolve();
					})
					.on('error', reject)
					.run();
			});
		});

		await Promise.all(transcodePromises);

		fs.writeFileSync(path.join(hlsDir, 'master.m3u8'), masterPlaylist);

		res.json({
			message: 'HLS transcoding completed',
			playlistUrl: `/hls/${path.basename(hlsDir)}/master.m3u8`
		});

	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: error.message });
	}
};

const getManifest = async (req, res) => {
	try {
		const { filename } = req.params;
		const hlsDir = getHLSDirectory(filename);
		const manifestPath = path.join(hlsDir, 'master.m3u8');

		if (!fs.existsSync(manifestPath)) {
			return res.status(404).json({ error: 'Manifest not found. Please prepare the video first.' });
		}

		res.sendFile(manifestPath);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	prepareVideo,
	getManifest
};
