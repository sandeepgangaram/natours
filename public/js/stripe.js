/* eslint-disable */

import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51L1BmbSHKJBwFjNoLsz3IDSBzJaWvHpcvI9VGRnZaeIWiNyb5YYMGWlWYVfwsH3sakaZHX1lbh0VfjZJvHYMt6nj00uAkNabjL'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    showAlert('error', error);
  }
};
