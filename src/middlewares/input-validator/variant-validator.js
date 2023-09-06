const { validationResult, check, body } = require('express-validator');
const en = require('../../../locale/en');
const ValidationException = require('../../errors/validation-exception');
const mongoose = require('mongoose');

const validateCreateVariantInput = [
  check('name').optional().isString().withMessage(en['variant-name-format']),
  check('product')
    .notEmpty()
    .withMessage(en['product-id-required'])
    .bail()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(en['product-id-format']),
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
    .withMessage(en['variant-description-format']),
  check('features')
    .notEmpty()
    .withMessage(en['features-required'])
    .bail()
    .isString()
    .withMessage(en['variant-features-format']),
  check('price')
    .notEmpty()
    .withMessage(en['price-required'])
    .bail()
    .isNumeric()
    .withMessage(en['variant-price-format']),
  check('currency')
    .optional()
    .custom((value) => {
      if (!['NGN', 'USD', 'GBP', 'EUR', 'CAD'].includes(value)) {
        throw new Error(en['variant-currency-format']);
      }

      return true;
    }),
  check('stock').optional().isNumeric().withMessage(en['variant-stock-format']),
  check('stockUnit')
    .optional()
    .custom((value) => {
      if (
        !['Cartons', 'Palletes', 'Packets', 'Pieces', 'Boxes'].includes(value)
      ) {
        throw new Error(en['variant-stock-unit-format']);
      }

      return true;
    })
    .withMessage(en['stock-unit-not-supported']),
  check('weight')
    .optional()
    .isNumeric()
    .withMessage(en['variant-weight-format']),
  check('weightUnit')
    .optional()
    .isIn('Kgs', 'Lbs')
    .withMessage(en['weight-not-supported']),
  check('dimensions')
    .optional()
    .isString()
    .withMessage(en['variant-dimension-format']),
  check('users')
    .optional()
    .custom((value) => {
      if (!['Children', 'Adults', 'All'].includes(value)) {
        throw new Error(en['variant-users-not-supported']);
      }
      return true;
    })
    .withMessage(en['variant-users-not-supported']),
  check('sex')
    .optional()
    .custom((value) => {
      if (!['Male', 'Female', 'Unisex'].includes(value)) {
        throw new Error(en['variant-sex-not-supported']);
      }
      return true;
    })
    .withMessage(en['variant-sex-not-supported']),
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
          throw new Error(en['variant-colors-fomrat']);
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

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateUpdateVariantInput = [
  check('name').optional().isString().withMessage(en['variant-name-format']),
  check('product')
    .notEmpty()
    .withMessage(en['product-id-required'])
    .bail()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(en['product-id-format']),
  check('description')
    .optional()
    .isString()
    .withMessage(en['variant-description-format']),
  check('features')
    .optional()
    .isString()
    .withMessage(en['variant-features-format']),
  check('price').optional().isNumeric().withMessage(en['variant-price-format']),
  check('currency')
    .optional()
    .custom((value) => {
      if (!['NGN', 'USD', 'GBP', 'EUR', 'CAD'].includes(value)) {
        throw new Error(en['variant-currency-format']);
      }

      return true;
    }),
  check('stock').optional().isNumeric().withMessage(en['variant-stock-format']),
  check('stockUnit')
    .optional()
    .custom((value) => {
      if (
        !['Cartons', 'Palletes', 'Packets', 'Pieces', 'Boxes'].includes(value)
      ) {
        throw new Error(en['variant-stock-unit-format']);
      }

      return true;
    })
    .withMessage(en['stock-unit-not-supported']),
  check('weight')
    .optional()
    .isNumeric()
    .withMessage(en['variant-weight-format']),
  check('weightUnit')
    .optional()
    .isIn('Kgs', 'Lbs')
    .withMessage(en['weight-not-supported']),
  check('dimensions')
    .optional()
    .isString()
    .withMessage(en['variant-dimension-format']),
  check('users')
    .optional()
    .custom((value) => {
      if (!['Children', 'Adults', 'All'].includes(value)) {
        throw new Error(en['variant-users-not-supported']);
      }
      return true;
    })
    .withMessage(en['variant-users-not-supported']),
  check('sex')
    .optional()
    .custom((value) => {
      if (!['Male', 'Female', 'Unisex'].includes(value)) {
        throw new Error(en['variant-sex-not-supported']);
      }
      return true;
    })
    .withMessage(en['variant-sex-not-supported']),
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
          throw new Error(en['variant-colors-fomrat']);
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

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

module.exports = { validateUpdateVariantInput, validateCreateVariantInput };
