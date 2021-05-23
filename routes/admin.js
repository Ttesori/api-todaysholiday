const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const passport = require('passport');
const { isLoggedIn, isLoggedOut, currMonth } = require('../middleware/auth');

router.get('/', isLoggedOut, adminController.getAdminIndex);
router.get('/logout', adminController.logoutAdmin);
router.post('/login', passport.authenticate('local', {
  successRedirect: `/admin/${currMonth()}`,
  failureRedirect: `/admin/?error=true`
}), adminController.loginAdmin);
router.get('/tags', isLoggedIn, adminController.manageTags);
router.get('/:month', isLoggedIn, adminController.getHolidaysByMonth);


module.exports = router;