const Question = require('../models/Question');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { cloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');


//@desc Get all questions
//@route GET /api/v1/questions
//@access Public
exports.getQuestions = async (req, res, next) => {
    res.status(200).json(res.searchWrapper);
}
//@desc Get a single question
//@route GET /api/v1/questions/:id
//@access Public
exports.getQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return next(
                new ErrorResponse(`No question with the id of ${req.params.id}`,
                404
                ));
        }
        res.status(200).json({ success: true, data: question });
    } catch (err) {
        res.status(400).json({ success: false, error: "Wrong request format" });
    }
}



//@desc delete a single question
//@route DELETE /api/v1/questions/:id
//@access Private
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
    let question = await Question.findById(req.params.id);
    if (!question) {
        return next(
            new ErrorResponse(`No question with the id of ${req.params.id}`,
            404
            ));
    }
    await question.remove();
    res.status(200).json({
        success: true,
        data: {}
    })
});

//@desc update a single question
//@route UPDATE /api/v1/questions/:id
//@access Private
exports.updateQuestion = asyncHandler(async (req, res, next) => {
    let question = await Question.findById(req.params.id);
    if (!question) {
        return next(
            new ErrorResponse(`No question with the id of ${req.params.id}`,
            404
            ));
    }
    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: question
    })
});



// @desc      Upload description image for question
// @route     PUT /api/v1/questions/:id/photo
// @access    Private
exports.uploadImageQuestion = asyncHandler(async (req, res, next) => {
    const question = await Question.findById(req.params.id);
    if (!question) {
        return next(
            new ErrorResponse(`Question not found with id of ${req.params.id}`, 404)
        );
    }
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }
    const file = req.files.file;
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }
    file.name = `image_${question._id}${path.parse(file.name).ext}`;
    const filepath = `${process.env.FILE_UPLOAD_PATH}/${file.name}`;
    await file.mv(filepath, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
    });
    cloudinary.uploader.upload(filepath)
        .then(async (result) => {
            let url = result.url;
            await Question.findByIdAndUpdate(req.params.id, { description_image: url });

            try {
                fs.unlinkSync(filepath)
            } catch (err) {
                console.error(err)
            }
            res.status(200).json({
                success: true,
                data: url
            });
        })
        .catch((error) => {
            return next(new ErrorResponse(`Problem with file upload | ${error}`, 500));
        });


});

