const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const { webhookCheckout } = require('./controllers/bookingController');

// Start Express App
const app = express();

app.enable('trust proxy');

// Express app settings to set view engine as pug and watch the views folder
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
  'https://unpkg.com/',
  'https://js.stripe.com',
  'https://m.stripe.network',
  'https://*.cloudflare.com',
  'https://*.mapbox.com',
];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://fonts.googleapis.com/',
  'https://*.mapbox.com',
];
const connectSrcUrls = [
  'https://unpkg.com',
  'https://*.stripe.com',
  'https://bundle.js:*',
  'ws://127.0.0.1:3000/',
  'http://127.0.0.1:3000/',
  'ws://localhost:3000/',
  'https://*.cloudflare.com/',
  'https://*.mapbox.com',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'blob:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:', ...fontSrcUrls],
      scriptSrc: [
        "'self'",
        'https:',
        'http:',
        'blob:',
        'https://*.cloudflare.com',
        'https://*.mapbox.com',
        ...scriptSrcUrls,
      ],
      frameSrc: ["'self'", 'https://js.stripe.com'],
      objectSrc: ["'none'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https:',
        'http:',
        ...styleSrcUrls,
      ],
      workerSrc: ["'self'", 'blob:', 'https://m.stripe.network'],
      childSrc: ["'self'", 'blob:'],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:', 'http:'],
      formAction: ["'self'"],
      connectSrc: [
        "'self'",
        "'unsafe-inline'",
        'data:',
        'blob:',
        'https:',
        'http:',
        ...connectSrcUrls,
      ],
      upgradeInsecureRequests: [],
    },
  })
);

// Global Middlewares
// Implementing CORS
app.use(cors()); //works for simple get and post requests
// Access-Control-Allow-Origin headers are sent

// Ex: if api at - api.natours.com and frontend at natours.com
// app.use(cors({
//   origin:'https://www.natours.com'
// })) // this will allow only access to api from the above mentioned origin

app.options('*', cors());

//for non-simple requests like PATCH,PUT,DELETE or requests that send cookirs or use non-standard headers
// Non-simple requests require a so called preflight phase
// Whenever there is a preflight phase The browser sends an OPTIONS request (before the real request actually happens to figure out if the incoming request is safe)
// So we need to respond to that options request

// app.options('/api/v1/tours/:id',cors());

// for a http options request -

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers

// Develpoment Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit requests from same IP
const limiter = rateLimit({
  max: 100, //adapt the limit as per use case
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// need this raw - not in json :: so here

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

app.use('/api', limiter); //our app cannot crash in this window otherwise it will reset all these limits as well

// Body parser, reading data from body into req.body
// Limiting body payload
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
