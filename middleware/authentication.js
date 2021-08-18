const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Middleware function to protect routes from access wihtout admin account
exports.protectRoute = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route (admin only)', 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route (admin only)', 401));
    }
});
// Middleware function to authorize admin to access route (could be used in case we had more than one user role)
// Commented out since there are no other type aside from admin
// exports.authorizeRoute = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user?.role)) {
//             return next(
//                 new ErrorResponse(
//                     `User role ${req.user?.role} is not authorized to access this route`,
//                     403
//                 )
//             );
//         }
//         next();
//     };
// };
