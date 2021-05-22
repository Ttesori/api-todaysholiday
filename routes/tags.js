const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tags');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', tagsController.getTags);
router.post('/', tagsController.addNewTag);
router.put('/', tagsController.updateTag);

module.exports = router;