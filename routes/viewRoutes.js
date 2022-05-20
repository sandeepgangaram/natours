const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getAccount,
  updateUserData,
  getMyTours,
} = require('../controllers/viewsController');
const { protect, isLoggedIn } = require('../controllers/authController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

router.get('/signup', getSignupForm);

router.get('/me', protect, getAccount);
router.post('/submit-user-data', protect, updateUserData);
router.get('/my-tours', protect, getMyTours);

router.use(isLoggedIn);
router.get('/', createBookingCheckout, getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);
router.get('/login', getLoginForm);

module.exports = router;
