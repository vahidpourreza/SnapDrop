// js/snapdrop.validation.js

/**
 * Validates the built-in conditions: minSelectLimit and maxSelectLimit.
 * 
 * @param {Array} selectedItems - The items that are currently selected.
 * @param {Object} options - The dropdown options (minSelectLimit, maxSelectLimit, messages).
 * @returns {Object} - An object containing 'isValid' boolean and 'message' (if invalid).
 */
export function validateCore(selectedItems, options) {
  // Validate minimum select limit
  if (options.minSelectLimit && selectedItems.length < options.minSelectLimit) {
    return {
      isValid: false,
      message: options.minSelectLimitMessage.replace('{min}', options.minSelectLimit)
    };
  }

  // Validate maximum select limit
  if (options.maxSelectLimit && selectedItems.length > options.maxSelectLimit) {
    return {
      isValid: false,
      message: options.maxSelectLimitMessage.replace('{max}', options.maxSelectLimit)
    };
  }

  // Core validations passed
  return {
    isValid: true,
    message: ''
  };
}

/**
 * Runs custom validation functions and returns validation results.
 * 
 * @param {Array} selectedItems - The items that are currently selected.
 * @param {Array} customValidators - Array of custom validation functions defined by the user.
 * @returns {Object} - Returns either null (valid) or the first error message encountered.
 */
export function runCustomValidators(selectedItems, customValidators) {
  for (const validator of customValidators) {
    const result = validator(selectedItems); // Custom validator returns either null or a message
    if (result !== null) {
      return {
        isValid: false,
        message: result // Return custom message directly
      };
    }
  }
  
  // All custom validators passed
  return {
    isValid: true,
    message: ''
  };
}
