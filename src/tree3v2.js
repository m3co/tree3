(() => {
  'use strict';
  var range = new Range();
  var createHTML = range.createContextualFragment.bind(range);

  const classAsString = 'MaterialTree3';
  const cssClass = 'mdl-tree3';

  class MaterialTree3 {

    /**
     * Class constructor for dropdown MDL component.
     * Implements MDL component design pattern defined at:
     * https://github.com/jasonmayes/mdl-component-design-pattern
     *
     * @constructor
     * @param {HTMLElement} element The element that will be upgraded.
     */
    constructor(element) {
      this.element_ = element;
      this.init();
    }

    /**
     * Initialize element.
     */
    init() {
      if (this.element_) {

        // Prevent upgradeDom to call init() twice
        this.element_.dataset.upgraded = ['', classAsString].join();
      }
    }
  }
  window[classAsString] = MaterialTree3;

  componentHandler.register({
    constructor: MaterialTree3,
    classAsString: classAsString,
    cssClass: cssClass,
    widget: true
  });

})();
