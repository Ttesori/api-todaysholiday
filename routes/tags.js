const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tags');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', tagsController.getTags);
router.post('/', isAuthenticated, tagsController.addNewTag);
router.put('/', isAuthenticated, tagsController.updateTag);
router.delete('/', isAuthenticated, tagsController.deleteTag);

module.exports = router;