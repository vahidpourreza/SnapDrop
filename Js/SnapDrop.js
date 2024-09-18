// js/snapdrop.js

import { debounce } from './snapdrop.utils.js';
import { handleDropdownToggle, handleItemSelect, handleSearchInput } from './snapdrop.events.js';
import { fetchDropdownItems } from './snapdrop.api.js';
import { messages } from './snapdrop.messages.js'; 
import { validateMinSelectLimit, validateMaxSelectLimit, requiredValidator, runCustomValidators } from './snapdrop.validation.js'; // Importing validation functions

export class Snapdrop {
  constructor(container, options = {}) {
    this.container = container;
    this.options = this._mergeDefaultOptions(options);
    this.state = {
      items: [],
      selectedItems: [],
      searchQuery: '',
      open: false,
    };

    this._init();
  }

  _mergeDefaultOptions(userOptions) {
    const messageSet = userOptions.isRTL ? messages.persian : messages.english;

    const defaults = {
      isMultiple: false,
      isGrouped: false,
      isRTL: false,
      enableSearch: false,
      showSelectAll: false,
      maxSelectLimit: null,
      minSelectLimit: null,
      customValidators: [],
      onValidationError: null,
      minSelectLimitMessage: messageSet.minSelectLimitMessage,
      maxSelectLimitMessage: messageSet.maxSelectLimitMessage,
      isDisabled: false,
      dropdownPlaceholder: messageSet.dropdownPlaceholder,
      searchPlaceholder: messageSet.searchPlaceholder,
      preselectedValues: [],
      allowItemDescription: false,
      showIcons: true,
      disabledItems: [],
      onDropdownMessage: null,
      dataSourceURL: null,
      onDataLoad: null,
    };

    if (userOptions.dataSourceURL && userOptions.dropdownItems) {
      throw new Error("Cannot use 'dropdownItems' with 'dataSourceURL'. Please choose one.");
    }

    return { ...defaults, ...userOptions };
  }

  _init() {
    this._createDropdown();
    this._attachEventListeners();
  }

  _createDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'snapdrop-container';

    if (this.options.isRTL) {
      dropdown.classList.add('snapdrop-rtl');
    }

    const placeholder = document.createElement('div');
    placeholder.className = 'snapdrop-placeholder';
    placeholder.textContent = this.options.dropdownPlaceholder;

    dropdown.appendChild(placeholder);
    this.container.appendChild(dropdown);
  }

  _attachEventListeners() {
    this.container.addEventListener('click', handleDropdownToggle.bind(this));

    if (this.options.enableSearch) {
      const searchInput = document.createElement('input');
      searchInput.className = 'snapdrop-search';
      searchInput.placeholder = this.options.searchPlaceholder;
      this.container.appendChild(searchInput);

      searchInput.addEventListener('input', debounce(handleSearchInput.bind(this), 300));
    }
  }

  open() {
    this.state.open = true;
  }

  close() {
    this.state.open = false;
  }

  toggle() {
    this.state.open ? this.close() : this.open();
  }

  validate() {
    const validMin = this.options.minSelectLimit
      ? validateMinSelectLimit(this.state.selectedItems, this.options.minSelectLimit)
      : true;

    const validMax = this.options.maxSelectLimit
      ? validateMaxSelectLimit(this.state.selectedItems, this.options.maxSelectLimit)
      : true;

    const customValid = runCustomValidators(this.state.selectedItems, this.options.customValidators);

    if (!validMin) {
      this._triggerValidationMessage(this.options.minSelectLimitMessage.replace('{min}', this.options.minSelectLimit));
      return false;
    }

    if (!validMax) {
      this._triggerValidationMessage(this.options.maxSelectLimitMessage.replace('{max}', this.options.maxSelectLimit));
      return false;
    }

    if (!customValid) {
      this._triggerValidationMessage('Custom validation failed.');
      return false;
    }

    return true;
  }

  _triggerValidationMessage(message) {
    if (this.options.onValidationError) {
      this.options.onValidationError(message);
    } else {
      console.error(message);
    }
  }

  setItems(items) {
    this.state.items = items;
  }

  search(query) {
    this.state.searchQuery = query;
  }
}
