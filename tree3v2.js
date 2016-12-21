'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var range = new Range();
  var createHTML = range.createContextualFragment.bind(range);

  var TREE = 'mdl-tree3';
  var LEAF = TREE + '__leaf';
  var SPLASH = TREE + '__splash';
  var SPLASH_BUTTON = SPLASH + '--button';
  var CONTEXTMENU = TREE + '__contextmenu';
  var CONTEXTMENU_ADD = CONTEXTMENU + '--add-leaf';
  var CONTEXTMENU_REMOVE = CONTEXTMENU + '--remove-leaf';
  var INPUT = LEAF + '-input';
  var TEXT = LEAF + '-text';
  var EXPAND_COLLAPSE = LEAF + '-expand-collapse';
  var EXPANDED = LEAF + '--expanded';
  var COLLAPSED = LEAF + '--collapsed';

  var classAsString = 'Tree3';
  var cssClass = 'mdl-tree3';

  var lastIdContextmenu = 0;

  var Tree3 = function () {

    /**
     * Class constructor for dropdown MDL component.
     * Implements MDL component design pattern defined at:
     * https://github.com/jasonmayes/mdl-component-design-pattern
     *
     * @constructor
     * @param {HTMLElement} element - The element that will be upgraded.
     * @param {Tree3} parent - The parent of the created element
     */
    function Tree3(element, parent) {
      _classCallCheck(this, Tree3);

      if (parent) {
        this.parent_ = parent;
      }
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
          this.element_.classList.add('mdl-list');

          if (!this.parent_) {
            this.root_ = this;
            this.appendSplash_();
          } else {
            this.element_.hidden = true;
          }
        }
      }

      /**
       * Setup the leaf's context menu
       * This function adds side-effects to the param leaf
       *
       * @private
       * @param {HTMLElement} leaf - the leaf to be upgraded
       */

    }, {
      key: 'setupContextmenu_',
      value: function setupContextmenu_(leaf) {
        var _this = this;

        var contextmenu = document.importNode(this.Templates_.CONTEXTMENU, true);

        // this is a pretty strange assumption
        var btn = contextmenu.querySelector('.mdl-button');
        var menu = contextmenu.querySelector('.mdl-menu');

        lastIdContextmenu++;
        btn.id = btn.id + lastIdContextmenu;
        menu.setAttribute('for', menu.getAttribute('for') + lastIdContextmenu);

        var btnAdd = menu.querySelector(this.CssSelectors_.CONTEXTMENU_ADD);
        btnAdd.addEventListener('click', function (e) {
          var leaf = e.target.closest(_this.CssSelectors_.LEAF);
          leaf.Tree3.appendLeaf();
        });

        var btnRemove = menu.querySelector(this.CssSelectors_.CONTEXTMENU_REMOVE);
        btnRemove.addEventListener('click', function (e) {
          var leaf = e.target.closest(_this.CssSelectors_.LEAF);
          leaf.Tree3.removeLeaf();
        });

        var tree = this.element_;
        var id = tree.id;
        if (id) {
          var template = document.querySelector('template[for="' + id + '"]');
          if (template) {
            contextmenu.querySelector('.mdl-menu').appendChild(document.importNode(template.content, true));
            // You're doing here a very strange assumption! why .mdl-menu__item?
            var items = contextmenu.querySelectorAll('.mdl-menu__item');
          }
        }

        var primaryContent = leaf.querySelector('.mdl-list__item-primary-content');
        leaf.insertBefore(contextmenu, primaryContent);
        componentHandler.upgradeElement(menu);
      }

      /**
       * Setup the leaf's input
       * This function adds side-effects to the param leaf
       *
       * @private
       * @param {HTMLElement} leaf - the leaf to be upgraded
       */

    }, {
      key: 'setupInput_',
      value: function setupInput_(leaf) {
        var _this2 = this;

        var input = leaf.querySelector(this.CssSelectors_.INPUT + ' input');
        input.addEventListener('change', function (e) {
          leaf.querySelector(_this2.CssSelectors_.TEXT).textContent = e.target.value.toString();
          leaf.dispatchEvent(new CustomEvent('changetext', {
            detail: {
              leaf: leaf
            },
            bubbles: true
          }));
        });
        input.addEventListener('keyup', function (e) {
          if (e.key === 'Enter') {
            e.target.blur();
          }
        });
        input.addEventListener('blur', function (e) {
          if (!e.target.value.toString()) {
            leaf.Tree3.removeLeaf();
            return;
          }
          var inputContainer = leaf.querySelector(_this2.CssSelectors_.INPUT);
          leaf.querySelector(_this2.CssSelectors_.TEXT).textContent = e.target.value.toString();
          leaf.querySelector(_this2.CssSelectors_.TEXT).hidden = false;
          inputContainer.hidden = true;
        });
        leaf.querySelector(this.CssSelectors_.TEXT).addEventListener('dblclick', function () {
          var inputContainer = leaf.querySelector(_this2.CssSelectors_.INPUT);
          var input = inputContainer.querySelector('input');
          input.value = leaf.querySelector(_this2.CssSelectors_.TEXT).textContent;
          inputContainer.hidden = false;
          leaf.querySelector(_this2.CssSelectors_.TEXT).hidden = true;
          window.setTimeout(function () {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
          }, 0);
        });
        window.setTimeout(function () {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }, 0);
      }

      /**
       * Append the button expand/collapse to the leaf
       *
       * @private
       * @param {String} type - "expanded" | "collapsed"
       */

    }, {
      key: 'appendExpandCollapseBtn_',
      value: function appendExpandCollapseBtn_(leaf, type) {
        var _this3 = this;

        var type_ = type || 'expanded';
        var tree = leaf.querySelector(this.CssSelectors_.TREE);
        var clone;
        if (leaf.querySelector(this.CssSelectors_.EXPAND_COLLAPSE)) {
          // <untested-code>
          if (type_ === 'expanded') {
            this.leaf_.Tree3.expandLeaf();
          }
          // </untested-code>
          return tree;
        }
        if (type_ === 'expanded') {
          clone = document.importNode(this.Templates_.EXPANDED_BTN, true);
        } else if (type_ === 'collapsed' || !type) {
          clone = document.importNode(this.Templates_.COLLAPSED_BTN, true);
        } else {
          throw new Error('Allowed type = "expanded" || "collapsed" in appendExpandCollapse');
        }
        var c = leaf.querySelector('.mdl-list__item-primary-content').nextSibling;
        if (!c) {
          throw new Error('please, check why nextSibling is null');
        }
        var btn = clone.querySelector(this.CssSelectors_.EXPAND_COLLAPSE);

        // by default, the expand/collapse button is expanded
        // and click will switch expanded to collapsed and so on
        btn.addEventListener('click', function (e) {
          var btn = e.target.closest(_this3.CssSelectors_.EXPAND_COLLAPSE);
          if (btn.classList.contains(_this3.CssClasses_.EXPANDED)) {
            _this3.collapseLeaf();
          } else if (btn.classList.contains(_this3.CssClasses_.COLLAPSED)) {
            _this3.expandLeaf();
          } else {
            throw new Error('Check the expand/collapse TEMPLATE');
          }
        }.bind(this));

        leaf.insertBefore(clone, c);
        return tree;
      }

      /**
       * Expand the leaf
       */

    }, {
      key: 'expandLeaf',
      value: function expandLeaf() {
        var parent = this.element_.closest(this.CssSelectors_.LEAF);
        var btn = parent.querySelector(this.CssSelectors_.EXPAND_COLLAPSE);
        btn.classList.remove(this.CssClasses_.COLLAPSED);
        btn.classList.add(this.CssClasses_.EXPANDED);
        btn.querySelector('.material-icons').innerHTML = 'keyboard_arrow_down';
        this.element_.hidden = false;
      }

      /**
       * Collapse the leaf
       */

    }, {
      key: 'collapseLeaf',
      value: function collapseLeaf() {
        var parent = this.element_.closest(this.CssSelectors_.LEAF);
        var btn = parent.querySelector(this.CssSelectors_.EXPAND_COLLAPSE);
        btn.classList.add(this.CssClasses_.COLLAPSED);
        btn.classList.remove(this.CssClasses_.EXPANDED);
        btn.querySelector('.material-icons').innerHTML = 'keyboard_arrow_up';
        this.element_.hidden = true;
      }

      /**
       * Append a leaf to the tree
       *
       * @returns {HTMLElement} - The new element
       */

    }, {
      key: 'appendLeaf',
      value: function appendLeaf() {
        this.element_.hidden = false;
        this.removeSplash_();
        var clone = document.importNode(this.Templates_.LEAF, true);
        var leaf_ = clone.querySelector(this.CssSelectors_.LEAF);
        var leaf;
        if (leaf_) {
          leaf = this.element_.appendChild(leaf_);
          this.setupInput_(leaf);
          this.setupContextmenu_(leaf);
        } else {
          throw new Error('Incorrect Template');
        }
        var tree = document.createElement('ul');
        tree.classList.add(cssClass);
        var tree3 = new Tree3(tree, this);
        componentHandler.upgradeElement(leaf.appendChild(tree));
        leaf.Tree3 = tree3;
        leaf.Tree3.leaf_ = leaf; // this is for removeLeaf()
        leaf.Tree3.root_ = this.root_; // this is for removeLeaf()
        if (this.parent_) {
          if (this.parent_.leafs.length > 0) {
            leaf_ = this.element_.closest(this.CssSelectors_.LEAF);
            this.appendExpandCollapseBtn_(leaf_, 'expanded');
          }
        }
        return leaf;
      }

      /**
       * Remove the called leaf from the tree
       *
       * @return {HTMLElement} - The removed element
       */

    }, {
      key: 'removeLeaf',
      value: function removeLeaf() {
        var parent = this.parent_;
        var parentLeaf = parent.element_.closest(this.CssSelectors_.LEAF);
        var btn = null;
        if (parentLeaf) {
          btn = parentLeaf.querySelector(this.CssSelectors_.EXPAND_COLLAPSE);
        }

        this.leaf_.remove();
        this.root_.appendSplash_();

        if (parent.leafs.length == 0) {
          /* jshint ignore:line */
          if (this.root_ != parent) {
            /* jshint ignore:line */
            parent.element_.hidden = true;
          }
          if (btn) {
            btn.remove();
          }
        }

        return this.leaf_;
      }

      /**
       * Add the splash if tree is empty
       *
       * @private
       */

    }, {
      key: 'appendSplash_',
      value: function appendSplash_() {
        var _this4 = this;

        if (this.root_.leafs.length == 0) {
          /* jshint ignore:line */
          var splash = document.importNode(this.Templates_.SPLASH, true);

          var btn = splash.querySelector('button');
          btn.addEventListener('click', function () {
            _this4.root_.removeSplash_();
            _this4.root_.appendLeaf();
          });
          this.root_.element_.appendChild(splash);
        }
      }

      /**
       * Remove the splash
       *
       * @private
       */

    }, {
      key: 'removeSplash_',
      value: function removeSplash_() {
        var splash = this.element_.querySelector(this.CssSelectors_.SPLASH);
        if (splash) {
          splash.remove();
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
      key: 'leaf',
      get: function get() {
        var leafs = [];
        for (var i = 0; i < this.element_.children.length; i++) {
          var item = this.element_.children[i];
          if (item.classList.contains(this.CssClasses_.LEAF)) {
            leafs.push(item);
          }
        }
        return leafs;
      },
      set: function set(_) {
        /*jshint unused:false*/
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

    }, {
      key: 'leafs',
      get: function get() {
        return this.leaf;
      },
      set: function set(_) {
        this.leaf = _;
      }

      /**
       * Store strings for class names defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */

    }, {
      key: 'CssClasses_',
      get: function get() {
        return {
          TREE: '' + TREE,
          LEAF: TREE + '__leaf',
          SPLASH: TREE + '__splash',
          SPLASH_BUTTON: SPLASH + '--button',
          CONTEXTMENU: TREE + '__contextmenu',
          CONTEXTMENU_ADD: CONTEXTMENU + '--add-leaf',
          CONTEXTMENU_REMOVE: CONTEXTMENU + '--remove-leaf',
          INPUT: LEAF + '-input',
          TEXT: LEAF + '-text',
          EXPAND_COLLAPSE: LEAF + '-expand-collapse',
          EXPANDED: LEAF + '--expanded',
          COLLAPSED: LEAF + '--collapsed'
        };
      }

      /**
       * Store strings for class selectors defined by this component that are used in
       * JavaScript. This allows us to simply change it in one place should we
       * decide to modify at a later date.
       *
       * @enum {string}
       * @private
       */

    }, {
      key: 'CssSelectors_',
      get: function get() {
        return {
          TREE: '.' + TREE,
          LEAF: '.' + TREE + '__leaf',
          SPLASH: '.' + TREE + '__splash',
          SPLASH_BUTTON: '.' + SPLASH + '--button',
          CONTEXTMENU: '.' + TREE + '__contextmenu',
          CONTEXTMENU_ADD: '.' + CONTEXTMENU + '--add-leaf',
          CONTEXTMENU_REMOVE: '.' + CONTEXTMENU + '--remove-leaf',
          INPUT: '.' + LEAF + '-input',
          TEXT: '.' + LEAF + '-text',
          EXPAND_COLLAPSE: '.' + LEAF + '-expand-collapse',
          EXPANDED: '.' + LEAF + '--expanded',
          COLLAPSED: '.' + LEAF + '--collapsed'
        };
      }

      /**
       * Store the templates that will be rendered into this component
       *
       * @enum {DocumentFragment}
       * @private
       */

    }, {
      key: 'Templates_',
      get: function get() {
        return {
          SPLASH: createHTML('\n<li class="mdl-list__item ' + SPLASH + '">\n  <div class="mdl-list__item-primary-content">\n    <button class="mdl-button mdl-js-button mdl-button--icon ' + SPLASH_BUTTON + '">\n      <i class="material-icons">add</i>\n    </button>\n  </div>\n</li>'),
          LEAF: createHTML('\n<li class="mdl-list__item ' + LEAF + '">\n  <div class="mdl-list__item-primary-content">\n    &nbsp;\n    <span class="' + TEXT + '" hidden>\n    </span>\n    <div class="' + INPUT + ' mdl-textfield mdl-js-textfield">\n      <input class="mdl-textfield__input" type="text" placeholder="Label...">\n    </div>\n    &nbsp;\n  </div>\n</li>'),
          TREE: createHTML('\n<ul class="mdl-list ' + TREE + '"></ul>'),
          CONTEXTMENU: createHTML('\n<button id="' + CONTEXTMENU + '-"\n  class="mdl-button mdl-js-button mdl-button--icon">\n  <i class="material-icons">more_vert</i>\n</button>\n<ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect ' + CONTEXTMENU + '"\n  for="' + CONTEXTMENU + '-">\n  <li class="mdl-menu__item\n             ' + CONTEXTMENU_ADD + '">\n    Add\n  </li>\n  <li class="mdl-menu__item\n             mdl-menu__item--full-bleed-divider\n             ' + CONTEXTMENU_REMOVE + '">\n    Remove\n  </li>\n</ul>'),
          EXPANDED_BTN: createHTML('\n<button class="mdl-list__item-secondary-action\n               mdl-button mdl-js-button mdl-button--icon\n               ' + EXPAND_COLLAPSE + '\n               ' + EXPANDED + '">\n  <i class="material-icons">keyboard_arrow_down</i>\n</button>'),
          COLLAPSED_BTN: createHTML('\n<button class="mdl-list__item-secondary-action\n               mdl-button mdl-js-button mdl-button--icon\n               ' + EXPAND_COLLAPSE + '\n               ' + COLLAPSED + '">\n  <i class="material-icons">keyboard_arrow_up</i>\n</button>')
        };
      }
    }]);

    return Tree3;
  }();

  window[classAsString] = Tree3;

  componentHandler.register({
    constructor: Tree3,
    classAsString: classAsString,
    cssClass: cssClass,
    widget: true
  });
})();