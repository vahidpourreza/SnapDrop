// js/snapdrop.validation.js

/**
 * Validates the built-in conditions: minSelectLimit and maxSelectLimit.
 * 
 * @param {Array} selectedItems - The items that are currently selected.
 * @param {Object} validationOptions - The validation options (minSelectLimit, maxSelectLimit, messages).
 * @returns {Object} - An object containing 'isValid' boolean and 'message' (if invalid).
 */
export function validateCore(selectedItems, validationOptions) {
  // Validate minimum select limit
  if (validationOptions.minSelectLimit && selectedItems.length < validationOptions.minSelectLimit) {
    return {
      isValid: false,
      message: validationOptions.minSelectLimitMessage.replace('{min}', validationOptions.minSelectLimit)
    };
  }

  // Validate maximum select limit
  if (validationOptions.maxSelectLimit && selectedItems.length > validationOptions.maxSelectLimit) {
    return {
      isValid: false,
      message: validationOptions.maxSelectLimitMessage.replace('{max}', validationOptions.maxSelectLimit)
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

/**
 * Validate the user-provided options for integrity.
 * Ensure that options like minSelectLimit and maxSelectLimit are correctly configured.
 * 
 * @param {Object} options - User-defined options for the dropdown.
 * @throws {Error} If any invalid configuration is detected.
 */
export function validateOptionsIntegrity(options) {
  const { limits, itemsOptions, dataSourceURL, dropdownItems, customValidators, preselectedValues } = options;

  // Check: Ensure mutually exclusive options
  if (dataSourceURL && dropdownItems) {
    throw new Error("Cannot use both 'dropdownItems' and 'dataSourceURL'. Please choose one.");
  }

  // Check if minSelectLimit is greater than maxSelectLimit
  if (limits.minSelectLimit && limits.maxSelectLimit && 
    limits.minSelectLimit > limits.maxSelectLimit) {
    throw new Error("minSelectLimit cannot be greater than maxSelectLimit.");
  }

  // Check if minSelectLimit and maxSelectLimit are positive integers
  if ((limits.minSelectLimit && limits.minSelectLimit < 0) || 
      (limits.maxSelectLimit && limits.maxSelectLimit < 0)) {
    throw new Error("minSelectLimit and maxSelectLimit must be positive integers.");
  }

  // Check if disabledItems contains valid items (e.g., no undefined values, must be an array)
  if (itemsOptions.disabledItems && !Array.isArray(itemsOptions.disabledItems)) {
    throw new Error("disabledItems must be an array of item values.");
  }

  // Check if customValidators are all functions
  if (customValidators && !customValidators.every(fn => typeof fn === 'function')) {
    throw new Error("All custom validators must be functions.");
  }

  // Check if preselectedValues are valid and exist in dropdownItems (if both are defined)
  if (preselectedValues && dropdownItems) {
    const validValues = dropdownItems.map(item => item.value);
    const invalidPreselected = preselectedValues.filter(value => !validValues.includes(value));

    if (invalidPreselected.length > 0) {
      throw new Error(`Invalid preselectedValues found: ${invalidPreselected.join(', ')}`);
    }
  }

  // Ensure onValidationError is a function, if provided
  if (options.onValidationError && typeof options.onValidationError !== 'function') {
    throw new Error("onValidationError must be a function.");
  }

  // Ensure onDataLoad is a function, if provided
  if (options.onDataLoad && typeof options.onDataLoad !== 'function') {
    throw new Error("onDataLoad must be a function.");
  }

  // Additional checks can go here...
}
