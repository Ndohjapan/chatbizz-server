const { validationResult, check } = require('express-validator');
const en = require('../../../locale/en');
const ValidationException = require('../../errors/validation-exception');
const mongoose = require('mongoose');

const validateCreateStoreInput = [
  check('name')
    .notEmpty()
    .withMessage(en['products-name-required'])
    .bail()
    .isString()
    .withMessage(en['store-name-format']),
  check('store')
    .notEmpty()
    .withMessage(en['store-id-required'])
    .bail()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(en['store-id-format']),
  check('description')
    .notEmpty()
    .withMessage(en['description-required'])
    .bail()
    .isString()
    .withMessage(en['description-format']),
  check('features')
    .notEmpty()
    .withMessage(en['features-required'])
    .bail()
    .isString()
    .withMessage(en['features-format']),
  check('price')
    .notEmpty()
    .withMessage(en['price-required'])
    .bail()
    .isNumeric()
    .withMessage(en['price-format']),
  check('currency')
    .notEmpty()
    .withMessage(en['currency-required'])
    .bail()
    .isIn('NGN', 'USD', 'GBP', 'EUR', 'CAD')
    .withMessage(en['currency-not-supported']),
  check('stock').optional().isNumeric().withMessage(en['stock-format']),
  check('stockUnit')
    .optional()
    .isIn('Cartons', 'Palletes', 'Packets', 'Boxes')
    .withMessage(en['stock-unit-not-supported']),
  check('weight').optional().isNumeric().withMessage(en['weight-format']),
  check('weightUnit')
    .optional()
    .isIn('Kgs', 'Lbs')
    .withMessage(en['weight-not-supported']),
  check('dimensions').optional().isString().withMessage(en['dimension-format']),
  check('users')
    .optional()
    .isIn('Children', 'Adults', 'All')
    .withMessage(en['users-not-supported']),
  check('sex')
    .optional()
    .isIn('Male', 'Female')
    .withMessage(en['sex-not-supported']),
  check('images')
    .optional()
    .custom((images) => {
      if (!Array.isArray(images)) {
        throw new Error(en['image-array']);
      }

      images.forEach((image) => {
        if (
          !/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(
            image,
          )
        ) {
          throw new Error(en['image-url-format']);
        }
      });

      return true;
    })
    .withMessage(en['image-url-format']),
  check('colors')
    .optional()
    .custom((colors) => {
      if (!Array.isArray(colors)) {
        throw new Error(en['colors-array']);
      }

      colors.forEach((color) => {
        if (typeof color !== 'string') {
          throw new Error(en['colors-fomrat']);
        }
      });

      return true;
    }),
  check('sizes')
    .optional()
    .custom((sizes) => {
      if (!Array.isArray(sizes)) {
        throw new Error(en['sizes-array']);
      }

      sizes.forEach((size) => {
        if (typeof size !== 'string') {
          throw new Error(en['sizes-format']);
        }
      });

      return true;
    }),
  check('videos')
    .optional()
    .custom((videos) => {
      if (!Array.isArray(videos)) {
        throw new Error('Videos must be an array');
      }

      videos.forEach((video) => {
        if (
          !/^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}$/.test(video)
        ) {
          throw new Error(en['video-url-format']);
        }
      });

      return true;
    })
    .withMessage(en['video-url-format']),

  check('variants')
    .optional()
    .custom((variants) => {
      if (!Array.isArray(variants)) {
        throw new Error('Variants must be an array');
      }

      variants.forEach((variant) => {
        check('variant.name')
          .notEmpty()
          .withMessage(en['products-name-required'])
          .bail()
          .isString()
          .withMessage(en['store-name-format']),
        check('variant.product')
          .notEmpty()
          .notEmpty()
          .withMessage(en['product-id-required'])
          .bail()
          .custom((value) => mongoose.Types.ObjectId.isValid(value))
          .withMessage(en['product-id-format']),
        check('variant.description')
          .notEmpty()
          .withMessage(en['description-required'])
          .bail()
          .isString()
          .withMessage(en['description-format']),
        check('variants.features')
          .notEmpty()
          .withMessage(en['features-required'])
          .bail()
          .isString()
          .withMessage(en['features-format']),
        check('variants.colors')
          .optional()
          .custom((colors) => {
            if (!Array.isArray(colors)) {
              throw new Error(en['colors-array']);
            }

            colors.forEach((color) => {
              if (typeof color !== 'string') {
                throw new Error(en['colors-fomrat']);
              }
            });

            return true;
          }),
        check('variants.sizes')
          .optional()
          .custom((sizes) => {
            if (!Array.isArray(sizes)) {
              throw new Error(en['sizes-array']);
            }

            sizes.forEach((size) => {
              if (typeof size !== 'string') {
                throw new Error(en['sizes-format']);
              }
            });

            return true;
          }),
        check('variants.price')
          .notEmpty()
          .withMessage(en['price-required'])
          .bail()
          .isNumeric()
          .withMessage(en['price-format']),
        check('varainats.currency')
          .notEmpty()
          .withMessage(en['currency-required'])
          .bail()
          .isIn('NGN', 'USD', 'GBP', 'EUR', 'CAD')
          .withMessage(en['currency-not-supported']),
        check('variants.weight').optional().isNumeric().withMessage(en['weight-format']),
        check('variants.weightUnit')
          .optional()
          .isIn('Kgs', 'Lbs')
          .withMessage(en['weight-not-supported']),
        check('variants.stock').optional().isNumeric().withMessage(en['stock-format']),
        check('variants.stockUnit')
          .optional()
          .isIn('Cartons', 'Palletes', 'Packets', 'Boxes')
          .withMessage(en['stock-unit-not-supported']),
        check('variants.dimensions').optional().isString().withMessage(en['dimension-format']),
        check('variants.users')
          .optional()
          .isIn('Children', 'Adults', 'All')
          .withMessage(en['users-not-supported']),
        check('variants.sex')
          .optional()
          .isIn('Male', 'Female')
          .withMessage(en['sex-not-supported']),
        check('variants.images')
          .optional()
          .custom((images) => {
            if (!Array.isArray(images)) {
              throw new Error(en['image-array']);
            }

            images.forEach((image) => {
              if (
                !/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(
                  image,
                )
              ) {
                throw new Error(en['image-url-format']);
              }
            });

            return true;
          })
          .withMessage(en['image-url-format']);
      });

      return true;
    })
    .withMessage('Variants validation failed'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

module.exports = { validateCreateStoreInput };
