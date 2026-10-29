const { body, validationResult } = require('express-validator');

const VALID_STATUSES = ['Applied', 'Reviewing', 'Interview', 'Offer', 'Rejected'];
const VALID_JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

/**
 * Validation rules for creating or updating an application
 */
const applicationValidationRules = [
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),

  body('jobTitle')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ max: 100 })
    .withMessage('Job title cannot exceed 100 characters'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),

  body('applicationDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Application date must be a valid ISO 8601 date string'),

  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),

  body('jobType')
    .optional()
    .isIn(VALID_JOB_TYPES)
    .withMessage(`Job type must be one of: ${VALID_JOB_TYPES.join(', ')}`),

  body('jobPostingUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Job posting URL must be a valid URL (e.g. https://...)'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes cannot exceed 2000 characters'),
];

/**
 * Middleware to check validation results and respond with formatted errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => ({
    field: err.path || err.param,
    message: err.msg,
  }));

  return res.status(400).json({
    success: false,
    message: 'Validation failed for one or more fields',
    errors: extractedErrors,
  });
};

module.exports = {
  applicationValidationRules,
  validate,
  VALID_STATUSES,
  VALID_JOB_TYPES,
};
