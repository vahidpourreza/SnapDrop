import { messages } from './snapdrop.messages.js';
import { validateCore, runCustomValidators } from './snapdrop.validation.js';

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
      validation: {  // Grouping min/max limits and messages
        maxSelectLimit: null,
        minSelectLimit: null,
        minSelectLimitMessage: messageSet.minSelectLimitMessage,
        maxSelectLimitMessage: messageSet.maxSelectLimitMessage,
      },
      itemsOptions: {  //  item-related options
        showIcons: true,
        showImages: true,
        disabledItems: [],
        allowItemDescription: false
      },
      customValidators: [],
      onValidationError: null,
      dropdownPlaceholder: messageSet.dropdownPlaceholder,
      searchPlaceholder: messageSet.searchPlaceholder,
      preselectedValues: [],
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
    // First, run Snapdrop's core validation (min/max selection limits)
    const coreValidationResult = validateCore(this.state.selectedItems, this.options.validation);

    if (!coreValidationResult.isValid) {
      this._triggerValidationMessage(coreValidationResult.message); // Built-in validation message
      return false;
    }

    // If core validation passes, proceed to custom validators
    const customValidationResult = runCustomValidators(this.state.selectedItems, this.options.customValidators);

    if (!customValidationResult.isValid) {
      this._triggerValidationMessage(customValidationResult.message); // Custom validation message
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
