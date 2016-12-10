'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var range = new Range();
  var createHTML = range.createContextualFragment.bind(range);

  var TREE = 'mdl-tree';
  var ITEM = TREE + '__item';
  var SPLASH = TREE + '__splash';
  var CONTEXTMENU = TREE + '__contextmenu';
  var CONTEXTMENU_ADD = CONTEXTMENU + '--add-leaf';
  var CONTEXTMENU_REMOVE = CONTEXTMENU + '--remove-leaf';
  var INPUT = ITEM + '-input';
  var TEXT = ITEM + '-text';
  var EXPAND_COLLAPSE = ITEM + '-expand-collapse';
  var EXPANDED = ITEM + '--expanded';
  var COLLAPSED = ITEM + '--collapsed';

  var classAsString = 'Tree3';
  var cssClass = 'mdl-tree3';

  var Tree3 = function () {

    /**
     * Class constructor for dropdown MDL component.
     * Implements MDL component design pattern defined at:
     * https://github.com/jasonmayes/mdl-component-design-pattern
     *
     * @constructor
     * @param {HTMLElement} element - The element that will be upgraded.
     */
    function Tree3(element) {
      _classCallCheck(this, Tree3);

      this.element_ = element;
      this.init();
    }

    /**
     * Initialize element.
     *
     */


    _createClass(Tree3, [{
      key: 'init',
      value: function init() {
        if (this.element_) {
          // prevent twice to be executed if upgrading
          if (this.element_.ALREADY_INIT) {
            return;
          }
          this.element_.ALREADY_INIT = true;
        }
      }

      /**
       * Leafs property getter and setter. Retreive via querySelectorAll
       * all the leafs that belong to this tree. Do not allow to modify
       * the leafs directly.
       *
       * @returns {NodeList} - The array of leafs
       * @throws - Do not allow to modify directly this value
       */

    }, {
      key: 'leafs',
      get: function get() {
        return this.element_.querySelectorAll(this.CssClasses_.ITEM);
      },
      set: function set(_) {
        /*jshint unused:false*/
        throw new Error('Do not allow to modify directly this value');
      }
    }]);

    return Tree3;
  }();

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
    TREE: '' + TREE,
    ITEM: TREE + '__item',
    SPLASH: TREE + '__splash',
    CONTEXTMENU: TREE + '__contextmenu',
    CONTEXTMENU_ADD: CONTEXTMENU + '--add-leaf',
    CONTEXTMENU_REMOVE: CONTEXTMENU + '--remove-leaf',
    INPUT: ITEM + '-input',
    TEXT: ITEM + '-text',
    EXPAND_COLLAPSE: ITEM + '-expand-collapse',
    EXPANDED: ITEM + '--expanded',
    COLLAPSED: ITEM + '--collapsed'
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
    TREE: '.' + TREE,
    ITEM: '.' + TREE + '__item',
    SPLASH: '.' + TREE + '__splash',
    CONTEXTMENU: '.' + TREE + '__contextmenu',
    CONTEXTMENU_ADD: '.' + CONTEXTMENU + '--add-leaf',
    CONTEXTMENU_REMOVE: '.' + CONTEXTMENU + '--remove-leaf',
    INPUT: '.' + ITEM + '-input',
    TEXT: '.' + ITEM + '-text',
    EXPAND_COLLAPSE: '.' + ITEM + '-expand-collapse',
    EXPANDED: '.' + ITEM + '--expanded',
    COLLAPSED: '.' + ITEM + '--collapsed'
  };

  /**
   * Store the templates that will be rendered into this component
   *
   * @enum {DocumentFragment}
   * @private
   */
  Tree3.prototype.Templates_ = {};

  Tree3.prototype.Templates_.SPLASH = createHTML('\n    <li class="mdl-list__item ' + ITEM.slice(1) + '">\n      <div class="mdl-list__item-primary-content">\n        <button class="mdl-button mdl-js-button mdl-button--icon ' + SPLASH.slice(1) + '">\n          <i class="material-icons">add</i>\n        </button>\n      </div>\n    </li>\n  ');

  Tree3.prototype.Templates_.LEAF = createHTML('\n    <li class="mdl-list__item ' + ITEM.slice(1) + '">\n      <div class="mdl-list__item-primary-content">\n        &nbsp;\n        <span class="' + TEXT.slice(1) + '" hidden>\n        </span>\n        <div class="' + INPUT.slice(1) + ' mdl-textfield mdl-js-textfield">\n          <input class="mdl-textfield__input" type="text" placeholder="Label...">\n        </div>\n        &nbsp;\n      </div>\n    </li>\n  ');

  Tree3.prototype.Templates_.TREE = createHTML('\n    <ul class="mdl-list ' + TREE.slice(1) + '"></ul>\n  ');

  Tree3.prototype.Templates_.CONTEXTMENU = createHTML('\n    <button id="' + CONTEXTMENU.slice(1) + '-"\n      class="mdl-button mdl-js-button mdl-button--icon">\n      <i class="material-icons">more_vert</i>\n    </button>\n    <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect"\n      for="' + CONTEXTMENU.slice(1) + '-">\n      <li class="mdl-menu__item\n                 ' + CONTEXTMENU_ADD.slice(1) + '">\n        Add\n      </li>\n      <li class="mdl-menu__item\n                 mdl-menu__item--full-bleed-divider\n                 ' + CONTEXTMENU_REMOVE.slice(1) + '">\n        Remove\n      </li>\n    </ul>\n  ');

  Tree3.prototype.Templates_.EXPANDED_BTN = createHTML('\n    <button class="mdl-list__item-secondary-action\n                   mdl-button mdl-js-button mdl-button--icon\n                   ' + EXPAND_COLLAPSE.slice(1) + '\n                   ' + EXPANDED.slice(1) + '">\n      <i class="material-icons">keyboard_arrow_down</i>\n    </button>\n  ');

  Tree3.prototype.Templates_.COLLAPSED_BTN = createHTML('\n    <button class="mdl-list__item-secondary-action\n                   mdl-button mdl-js-button mdl-button--icon\n                   ' + EXPAND_COLLAPSE.slice(1) + '\n                   ' + COLLAPSED.slice(1) + '">\n      <i class="material-icons">keyboard_arrow_up</i>\n    </button>\n  ');

  componentHandler.register({
    constructor: Tree3,
    classAsString: classAsString,
    cssClass: cssClass,
    widget: true
  });
})();