const express = require('express');
const router = express.Router();
const hlsStreamController = require('../controllers/hls-stream.controller');

router.post('/prepare/:filename', hlsStreamController.prepareVideo);
router.get('/:filename/manifest', hlsStreamController.getManifest);

module.exports = router;
