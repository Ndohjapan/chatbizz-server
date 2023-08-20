const { validationResult, check, param } = require('express-validator');
const en = require('../../../locale/en');
const ValidationException = require('../../errors/validation-exception');
const { PhoneNumberUtil } = require('google-libphonenumber');

const phoneUtil = PhoneNumberUtil.getInstance();

const validateCreateStoreInput = [
  check('name')
    .notEmpty()
    .withMessage(en['store-name-required'])
    .bail()
    .isString()
    .withMessage(en['store-name-format']),
  check('about')
    .notEmpty()
    .withMessage(en['about-store-required'])
    .bail()
    .isString()
    .withMessage(en['about-store-format']),
  check('storeType')
    .notEmpty()
    .withMessage(en['store-type-required'])
    .bail()
    .isString()
    .withMessage(en['store-type-format'])
    .bail()
    .custom((value) => ['Ecommerce', 'Digital'].includes(value))
    .withMessage(en['store-type-invalid']),
  check('whatsappNumber')
    .notEmpty()
    .withMessage(en['whatsapp-num-required'])
    .bail()
    .isMobilePhone()
    .withMessage(en['whatsapp-num-invalid'])
    .bail()
    .custom((value) => {
      if (!phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(value))) {
        throw new Error(en['whatsapp-num-invalid']);
      }
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

const validateQRCodePhoneParams = [
  param('phone')
    .notEmpty()
    .withMessage(en['whatsapp-num-required'])
    .bail()
    .isMobilePhone()
    .withMessage(en['whatsapp-num-invalid']),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

module.exports = { validateCreateStoreInput, validateQRCodePhoneParams };
