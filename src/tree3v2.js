(() => {
  'use strict';
  var range = new Range();
  var createHTML = range.createContextualFragment.bind(range);

  const TREE = 'mdl-tree';
  const TREE_ITEM = `${TREE}__item`;
  const CONTEXTMENU = `${TREE}__contextmenu`;

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
        // prevent twice to be executed if upgrading
        if (this.element_.ALREADY_INIT) {
          return;
        }
        this.element_.ALREADY_INIT = true;
      }
    }
  }
  window[classAsString] = MaterialTree3;

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  MaterialTree3.prototype.CssClasses_ = {
    TREE: `${TREE}`,
    ITEM: `${TREE}__item`,
    SPLASH: `${TREE}__splash`,
    CONTEXTMENU: `${TREE}__contextmenu`,
    CONTEXTMENU_ADD: `${CONTEXTMENU}--add-leaf`,
    CONTEXTMENU_REMOVE: `${CONTEXTMENU}--remove-leaf`,
    INPUT: `${TREE_ITEM}-input`,
    TEXT: `${TREE_ITEM}-text`,
    EXPAND_COLLAPSE: `${TREE_ITEM}-expand-collapse`,
    EXPANDED: `${TREE_ITEM}--expanded`,
    COLLAPSED: `${TREE_ITEM}--collapsed`,
  };

  componentHandler.register({
    constructor: MaterialTree3,
    classAsString: classAsString,
    cssClass: cssClass,
    widget: true
  });

})();
