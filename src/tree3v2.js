(() => {
  'use strict';
  var range = new Range();
  var createHTML = range.createContextualFragment.bind(range);

  const classAsString = 'MaterialTree3';
  const cssClass = 'mdl-tree3';

  class MaterialTree3 {
    constructor(element) {
      this.element_ = element;
      this.init();
    }

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
