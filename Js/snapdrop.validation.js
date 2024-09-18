// js/snapdrop.validation.js

export function requiredValidator(selectedItems) {
    return selectedItems.length > 0;
  }
  
  export function customValidator(selectedItems, maxLimit) {
    return selectedItems.length <= maxLimit;
  }
  
  // Users can pass custom validation functions via options
  