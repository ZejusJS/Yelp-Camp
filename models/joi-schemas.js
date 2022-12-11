const baseJoi = require('joi');
const { sanitizeFilter } = require('mongoose');
const sanitizeHtml = require('sanitize-html');

const custom = (joi) => { // takhle budu moct využívat .escapeHTML() v Joi shématech
    return {
        type: 'string',
        base: joi.string(),
        messages: {
            'string.escapeHTML': '{{#label}} must not include HTML',
        },
        rules: {
            escapeHTML: {
                alias: 'html',
                validate(value, helpers) {
                    const clean = sanitizeHtml(value, {
                        allowedTags: [],
                        allowedAttributes: {}
                    })
                    if (clean !== value) return helpers.error('string.escapeHTML', { value })
                }
            }
        }
    };
};

const Joi = baseJoi.extend(custom); // extenduju Joi costumem

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({

        title: Joi.string()
            .min(3)
            .max(40)
            .escapeHTML()
            .required(),

        price: Joi.number()
            .min(0)
            .required(),

        description: Joi.string()
            .min(10)
            .max(1000)
            .escapeHTML()
            .required(),

        location: Joi.string()
            .min(4)
            .max(60)
            .escapeHTML()
            .required()

    }).required(),
    deleteImages: Joi.array().max(100)
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({

        body: Joi.string()
            .min(15)
            .max(1800)
            .required(),

        rating: Joi.number()
            .min(1)
            .max(5)
            .required()

    }).required()
});

module.exports.registerSchema =
    Joi.object({
        username: Joi.string().min(5).max(24).escapeHTML().required(),
        email: Joi.string().email().max(70).escapeHTML().required(),
        password: Joi.string().min(5).max(40).required()
    });

module.exports.loginSchema =
    Joi.object({
        email: Joi.string().email().escapeHTML().required(),
        password: Joi.string().min(5).max(40).required()
    });

module.exports.commentSchema =
    Joi.object({
        text: Joi.string().min(1).max(2000).required().escapeHTML()
    }).required()