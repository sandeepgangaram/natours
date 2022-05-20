// const Tour = require('../models/tourModel');

// exports.aliasTopTours = (req, res, next) => {
//   req.query.limit = '5';
//   req.query.sort = '-ratingsAverage,price';
//   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//   next();
// };

// class APIFeatures {
//   constructor(query, queryStr) {
//     this.query = query;
//     this.queryStr = queryStr;
//   }

//   filter() {
//     const queryObj = { ...this.queryStr };

//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach((el) => delete queryObj[el]);

//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//     this.query = this.query.find(JSON.parse(queryStr));

//     return this;
//   }

//   sort() {
//     if (this.queryStr.sort) {
//       const sortBy = this.queryStr.sort.split(',').join(' ');
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort({ _id: -1 });
//     }
//     return this;
//   }

//   limitFields() {
//     if (this.queryStr.fields) {
//       const fields = this.queryStr.fields.split(',').join(' ');
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select('-__v');
//     }
//     return this;
//   }

//   paginate() {
//     const page = this.queryStr.page * 1 || 1;
//     const limit = this.queryStr.limit * 1 || 5;
//     const skip = (page - 1) * limit;
//     this.query = this.query.skip(skip).limit(limit);

//     return this;
//   }
// }

// exports.getAllTours = async (req, res) => {
//   try {
//     // console.log(req.query);
//     //   Build Query
//     //   1a-Filtering
//     // const queryObj = { ...req.query };
//     // const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     // excludedFields.forEach((el) => delete queryObj[el]);

//     // //   1b-Advanced Filtering
//     // //   Convert
//     // //  this {difficulty:'easy', duration:{$gte:5}}
//     // // to { difficulty: 'easy', duration: { gte: '5' } }
//     // // for - gte,gt,lte,lt
//     // let queryStr = JSON.stringify(queryObj);
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     // //   /\b(gte?|lte?)\b/g         ------------> Shorter Regular Expression
//     // //   The ? sign means that the previous character, in this case the 'e' letter could or not exists.

//     // let query = Tour.find(JSON.parse(queryStr));

//     // //   2) - Sorting
//     // if (req.query.sort) {
//     //   const sortBy = req.query.sort.split(',').join(' ');
//     //   query = query.sort(sortBy);
//     //   // sort('price ratingsAverage') -- for filtering based on two criterion
//     // } else {
//     //   query = query.sort({ _id: -1 });
//     //   // query.sort('-createdAt) -- both give latest first
//     // }

//     // //   3)Field Limiting
//     // if (req.query.fields) {
//     //   const fields = req.query.fields.split(',').join(' ');
//     //   query = query.select(fields);
//     //   // query.select('name duration price');
//     //   //   Selecting fields like this to show only those form the database documents is called Projecting
//     // } else {
//     //   query = query.select('-__v');
//     //   // "-__v" --> "-" to remove a field
//     // }

//     // //   4) Pagination
//     // const page = req.query.page * 1 || 1;
//     // const limit = req.query.limit * 1 || 100;
//     // const skip = (page - 1) * limit;
//     // query = query.skip(skip).limit(limit); //skip so many documents -in the existing query order and limit the results to limit

//     // if (req.query.page) {
//     //   const numTours = await Tour.countDocuments();
//     //   if (skip >= numTours) throw new Error('This page does not exist');
//     // }

//     // EXECUTE QUERY
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();

//     const tours = await features.query;

//     // SEND RESPONSE
//     res.status(200).json({
//       status: 'success',
//       data: { tours },
//     });

//     // const tours = await Tour.find()
//     //   .where('duration')
//     //   .equals(5)
//     //   .where('difficulty')
//     //   .equals('easy');
//   } catch (err) {
//     res.status(404).json({ status: 'fail', message: err.message });
//   }
// };

// exports.getTour = async (req, res) => {
//   try {
//     const tour = await Tour.findById(req.params.id); //-->Tour.findOne({_id:req.params.id})
//     // if (!tour) throw new Error('No tour found');
//     res.status(200).json({
//       status: 'success',
//       data: tour,
//     });
//   } catch (err) {
//     res.status(404).json({ status: 'fail', message: err.message });
//   }
// };

// exports.createTour = async (req, res) => {
//   try {
//     const newTour = await Tour.create(req.body);
//     //   const newTour = new Tour()
//     //   newTour.save() ---- under the hood (check docs) methods

//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({ status: 'fail', message: 'Invalid data sent!' });
//   }
// };

// exports.updateTour = async (req, res) => {
//   try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     }); //new:true returns the updated new document which can be showed to the user
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({ status: 'fail', message: err });
//   }
// };

// exports.deleteTour = async (req, res) => {
//   try {
//     await Tour.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   } catch (err) {
//     res.status(404).json({ status: 'fail', message: err });
//   }
// };
