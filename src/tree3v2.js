(() => {
  'use strict';
  var range = new Range();
  var createHTML = range.createContextualFragment.bind(range);

  const TREE = 'mdl-tree3';
  const LEAF = `${TREE}__leaf`;
  const SPLASH = `${TREE}__splash`;
  const CONTEXTMENU = `${TREE}__contextmenu`;
  const CONTEXTMENU_ADD = `${CONTEXTMENU}--add-leaf`;
  const CONTEXTMENU_REMOVE = `${CONTEXTMENU}--remove-leaf`;
  const INPUT = `${LEAF}-input`;
  const TEXT = `${LEAF}-text`;
  const EXPAND_COLLAPSE = `${LEAF}-expand-collapse`;
  const EXPANDED = `${LEAF}--expanded`;
  const COLLAPSED = `${LEAF}--collapsed`;

  const classAsString = 'Tree3';
  const cssClass = 'mdl-tree3';

  class Tree3 {

    /**
     * Class constructor for dropdown MDL component.
     * Implements MDL component design pattern defined at:
     * https://github.com/jasonmayes/mdl-component-design-pattern
     *
     * @constructor
     * @param {HTMLElement} element - The element that will be upgraded.
     */
    constructor(element) {
      this.element_ = element;
      this.init();
    }

    /**
     * Initialize element.
     *
     */
    init() {
      if (this.element_) {
        // prevent twice to be executed if upgrading
        if (this.element_.ALREADY_INIT) {
          return;
        }
        this.element_.ALREADY_INIT = true;
        this.element_.classList.add('mdl-list');

        if (this.leafs.length == 0) { /* jshint ignore:line */
          // show the splash
          var splash = document.importNode(this.Templates_.SPLASH, true);
          this.element_.appendChild(splash);
        }
      }
    }

    /**
     * Append a leaf to the tree
     *
     * @returns {HTMLElement} - The new element
     */
    appendLeaf() {
      var splash = this.element_.querySelector(this.CssSelectors_.SPLASH);
      if (splash) {
        splash.closest(this.CssSelectors_.LEAF).remove();
      }

      var leaf = document.importNode(this.Templates_.LEAF, true);
      return this.element_.appendChild(leaf.querySelector(this.CssSelectors_.LEAF));
    }

    /**
     * Leafs property getter and setter. Retreive via querySelectorAll
     * all the leafs that belong to this tree. Do not allow to modify
     * the leafs directly.
     *
     * @returns {NodeList} - The array of leafs
     * @throws - Do not allow to modify directly this value
     */
    get leaf() {
      return this.element_.querySelectorAll(this.CssClasses_.LEAF);
    }
    set leaf(_) { /*jshint unused:false*/
      throw new Error('Do not allow to modify directly this value');
    }

    /**
     * Leafs property getter and setter. Retreive via querySelectorAll
     * all the leafs that belong to this tree. Do not allow to modify
     * the leafs directly.
     *
     * @returns {NodeList} - The array of leafs
     * @throws - Do not allow to modify directly this value
     */
    get leafs() {
      return this.element_.querySelectorAll(this.CssClasses_.LEAF);
    }
    set leafs(_) { /*jshint unused:false*/
      throw new Error('Do not allow to modify directly this value');
    }
  }
  window[classAsString] = Tree3;

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  Tree3.prototype.CssClasses_ = {
    TREE: `${TREE}`,
    LEAF: `${TREE}__leaf`,
    SPLASH: `${TREE}__splash`,
    CONTEXTMENU: `${TREE}__contextmenu`,
    CONTEXTMENU_ADD: `${CONTEXTMENU}--add-leaf`,
    CONTEXTMENU_REMOVE: `${CONTEXTMENU}--remove-leaf`,
    INPUT: `${LEAF}-input`,
    TEXT: `${LEAF}-text`,
    EXPAND_COLLAPSE: `${LEAF}-expand-collapse`,
    EXPANDED: `${LEAF}--expanded`,
    COLLAPSED: `${LEAF}--collapsed`,
  };

  /**
   * Store strings for class selectors defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  Tree3.prototype.CssSelectors_ = {
    TREE: `.${TREE}`,
    LEAF: `.${TREE}__leaf`,
    SPLASH: `.${TREE}__splash`,
    CONTEXTMENU: `.${TREE}__contextmenu`,
    CONTEXTMENU_ADD: `.${CONTEXTMENU}--add-leaf`,
    CONTEXTMENU_REMOVE: `.${CONTEXTMENU}--remove-leaf`,
    INPUT: `.${LEAF}-input`,
    TEXT: `.${LEAF}-text`,
    EXPAND_COLLAPSE: `.${LEAF}-expand-collapse`,
    EXPANDED: `.${LEAF}--expanded`,
    COLLAPSED: `.${LEAF}--collapsed`,
  };

  /**
   * Store the templates that will be rendered into this component
   *
   * @enum {DocumentFragment}
   * @private
   */
  Tree3.prototype.Templates_ = {};

  Tree3.prototype.Templates_.SPLASH = createHTML(`
    <li class="mdl-list__item ${LEAF}">
      <div class="mdl-list__item-primary-content">
        <button class="mdl-button mdl-js-button mdl-button--icon ${SPLASH}">
          <i class="material-icons">add</i>
        </button>
      </div>
    </li>
  `);

  Tree3.prototype.Templates_.LEAF = createHTML(`
    <li class="mdl-list__item ${LEAF}">
      <div class="mdl-list__item-primary-content">
        &nbsp;
        <span class="${TEXT}" hidden>
        </span>
        <div class="${INPUT} mdl-textfield mdl-js-textfield">
          <input class="mdl-textfield__input" type="text" placeholder="Label...">
        </div>
        &nbsp;
      </div>
    </li>
  `);

  Tree3.prototype.Templates_.TREE = createHTML(`
    <ul class="mdl-list ${TREE}"></ul>
  `);

  Tree3.prototype.Templates_.CONTEXTMENU = createHTML(`
    <button id="${CONTEXTMENU}-"
      class="mdl-button mdl-js-button mdl-button--icon">
      <i class="material-icons">more_vert</i>
    </button>
    <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect"
      for="${CONTEXTMENU}-">
      <li class="mdl-menu__item
                 ${CONTEXTMENU_ADD}">
        Add
      </li>
      <li class="mdl-menu__item
                 mdl-menu__item--full-bleed-divider
                 ${CONTEXTMENU_REMOVE}">
        Remove
      </li>
    </ul>
  `);

  Tree3.prototype.Templates_.EXPANDED_BTN = createHTML(`
    <button class="mdl-list__item-secondary-action
                   mdl-button mdl-js-button mdl-button--icon
                   ${EXPAND_COLLAPSE}
                   ${EXPANDED}">
      <i class="material-icons">keyboard_arrow_down</i>
    </button>
  `);

  Tree3.prototype.Templates_.COLLAPSED_BTN = createHTML(`
    <button class="mdl-list__item-secondary-action
                   mdl-button mdl-js-button mdl-button--icon
                   ${EXPAND_COLLAPSE}
                   ${COLLAPSED}">
      <i class="material-icons">keyboard_arrow_up</i>
    </button>
  `);

  componentHandler.register({
    constructor: Tree3,
    classAsString: classAsString,
    cssClass: cssClass,
    widget: true
  });

})();