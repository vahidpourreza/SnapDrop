// js/snapdrop.validation.js

/**
 * Ensures that the number of selected items is greater than or equal to the minimum limit.
 * @param {Array} selectedItems - The items that are currently selected.
 * @param {number} minLimit - The minimum number of items required.
 * @returns {boolean} - True if the selection is valid, false otherwise.
 */
export function validateMinSelectLimit(selectedItems, minLimit) {
  return selectedItems.length >= minLimit;
}

/**
 * Ensures that the number of selected items is less than or equal to the maximum limit.
 * @param {Array} selectedItems - The items that are currently selected.
 * @param {number} maxLimit - The maximum number of items allowed.
 * @returns {boolean} - True if the selection is valid, false otherwise.
 */
export function validateMaxSelectLimit(selectedItems, maxLimit) {
  return selectedItems.length <= maxLimit;
}

/**
 * Ensures that at least one item is selected (useful for required fields).
 * @param {Array} selectedItems - The items that are currently selected.
 * @returns {boolean} - True if at least one item is selected, false otherwise.
 */
export function requiredValidator(selectedItems) {
  return selectedItems.length > 0;
}

/**
 * Runs custom validation functions that are passed by the user in the options.
 * @param {Array} selectedItems - The items that are currently selected.
 * @param {Array} customValidators - Custom validator functions passed in options.
 * @returns {boolean} - True if all custom validators return true, false otherwise.
 */
export function runCustomValidators(selectedItems, customValidators) {
  return customValidators.every(validator => validator(selectedItems));
}
