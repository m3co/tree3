'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var range = new Range();
  var createHTML = range.createContextualFragment.bind(range);

  var TREE = 'mdl-tree';
  var TREE_ITEM = TREE + '__item';
  var CONTEXTMENU = TREE + '__contextmenu';

  var classAsString = 'MaterialTree3';
  var cssClass = 'mdl-tree3';

  var MaterialTree3 = function () {

    /**
     * Class constructor for dropdown MDL component.
     * Implements MDL component design pattern defined at:
     * https://github.com/jasonmayes/mdl-component-design-pattern
     *
     * @constructor
     * @param {HTMLElement} element The element that will be upgraded.
     */
    function MaterialTree3(element) {
      _classCallCheck(this, MaterialTree3);

      this.element_ = element;
      this.init();
    }

    /**
     * Initialize element.
     */


    _createClass(MaterialTree3, [{
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
    }]);

    return MaterialTree3;
  }();

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
    TREE: '' + TREE,
    ITEM: TREE + '__item',
    SPLASH: TREE + '__splash',
    CONTEXTMENU: TREE + '__contextmenu',
    CONTEXTMENU_ADD: CONTEXTMENU + '--add-leaf',
    CONTEXTMENU_REMOVE: CONTEXTMENU + '--remove-leaf',
    INPUT: TREE_ITEM + '-input',
    TEXT: TREE_ITEM + '-text',
    EXPAND_COLLAPSE: TREE_ITEM + '-expand-collapse',
    EXPANDED: TREE_ITEM + '--expanded',
    COLLAPSED: TREE_ITEM + '--collapsed'
  };

  componentHandler.register({
    constructor: MaterialTree3,
    classAsString: classAsString,
    cssClass: cssClass,
    widget: true
  });
})();