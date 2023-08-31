const { validationResult, check, body } = require('express-validator');
const en = require('../../../locale/en');
const ValidationException = require('../../errors/validation-exception');
const mongoose = require('mongoose');

const validateCreateProductInput = [
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
    .optional()
    .isString()
    .withMessage(en['description-format']),
  check('features').optional().isString().withMessage(en['features-format']),
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
    .custom((value) => {
      if (
        !['Cartons', 'Palletes', 'Packets', 'Pieces', 'Boxes'].includes(value)
      ) {
        throw new Error(en['stock-unit-not-supported']);
      }

      return true;
    })
    .withMessage(en['stock-unit-not-supported']),
  check('weight').optional().isNumeric().withMessage(en['weight-format']),
  check('weightUnit')
    .optional()
    .isIn('Kgs', 'Lbs')
    .withMessage(en['weight-not-supported']),
  check('dimensions').optional().isString().withMessage(en['dimension-format']),
  check('users')
    .optional()
    .custom((value) => {
      if (!['Children', 'Adults', 'All'].includes(value)) {
        throw new Error(en['users-not-supported']);
      }
      return true;
    })
    .withMessage(en['users-not-supported']),
  check('sex')
    .optional()
    .custom((value) => {
      if (!['Male', 'Female', 'All'].includes(value)) {
        throw new Error(en['sex-not-supported']);
      }
      return true;
    })
    .withMessage(en['sex-not-supported']),
  check('images')
    .optional()
    .custom((images) => {
      if (!Array.isArray(images)) {
        throw new Error(en['image-array']);
      }

      images.forEach((image) => {
        if (typeof image !== 'object') {
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
        const youtubeRegex =
          /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

        const isValidYoutubeUrl = youtubeRegex.test(video);
        if (!isValidYoutubeUrl) {
          throw new Error(en['video-url-format']);
        }
      });

      return true;
    })
    .withMessage(en['video-url-format']),
  body('variants')
    .isArray()
    .withMessage(en['variants-array'])
    .custom((variants) => {
      if (!Array.isArray(variants)) {
        throw new Error(en['variants-array']);
      }

      variants.forEach((variant) => {
        if (!variant || typeof variant !== 'object') {
          throw new Error(en['variant-object']);
        }

        // Validate individual fields in each variant object
        if (!variant.name || typeof variant.name !== 'string') {
          throw new Error(en['variant-name-format']);
        }

        if (!variant.description || typeof variant.description !== 'string') {
          throw new Error(en['variant-description-format']);
        }

        if (!variant.features || typeof variant.features !== 'string') {
          throw new Error(en['variant-features-format']);
        }

        if (variant.price === undefined || isNaN(parseFloat(variant.price))) {
          throw new Error(en['variant-price-format']);
        }

        if (
          !variant.currency ||
          !['NGN', 'USD', 'GBP', 'EUR', 'CAD'].includes(variant.currency)
        ) {
          throw new Error(en['variant-currency-format']);
        }

        if (variant.stock === undefined || isNaN(parseInt(variant.stock))) {
          throw new Error(en['variant-stock-format']);
        }

        if (
          !variant.stockUnit ||
          !['Cartons', 'Palletes', 'Packets', 'Pieces', 'Boxes'].includes(
            variant.stockUnit,
          )
        ) {
          throw new Error(en['variant-stock-unit-format']);
        }

        if (variant.weight && isNaN(parseFloat(variant.weight))) {
          throw new Error(en['variant-weight-format']);
        }

        if (variant.weightUnit && !['Kg', 'Lbs'].includes(variant.weightUnit)) {
          throw new Error(en['weight-not-supported']);
        }

        if (variant.dimensions && typeof variant.dimensions !== 'string') {
          throw new Error(en['dimension-format']);
        }

        if (
          variant.users &&
          !['Children', 'Adults', 'All'].includes(variant.users)
        ) {
          throw new Error(en['users-not-supported']);
        }

        if (variant.sex && !['Male', 'Female', 'All'].includes(variant.sex)) {
          throw new Error(en['sex-not-supported']);
        }

        if (variant.image && !Array.isArray(variant.images)) {
          throw new Error(en['image-array']);
        }

        if (variant.image) {
          variant.images.forEach((image) => {
            if (typeof image !== 'object') {
              throw new Error(en['image-url-format']);
            }
          });
        }

        if (variant.colors && !Array.isArray(variant.colors)) {
          throw new Error(en['colors-array']);
        }

        if (variant.colors) {
          variant.colors.forEach((color) => {
            if (typeof color !== 'string') {
              throw new Error(en['colors-fomrat']);
            }
          });
        }

        if (variant.sizes && !Array.isArray(variant.sizes)) {
          throw new Error(en['sizes-array']);
        }

        if (variant.sizes) {
          variant.sizes.forEach((size) => {
            if (typeof size !== 'string') {
              throw new Error(en['sizes-format']);
            }
          });
        }
      });

      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

module.exports = { validateCreateProductInput };
