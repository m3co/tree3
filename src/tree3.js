(() => {
  'use strict';
  var range = document.createRange();
  var createHTML = range.createContextualFragment.bind(range);
  var clean = (str) => {
    return str.replace(/\n{1,} {0,}/g, ' ').replace(/> </g, '><').trim();
  };

  const TREE = 'mdl-tree3';
  const LEAF = `${TREE}__leaf`;
  const SPLASH = `${TREE}__splash`;
  const SPLASH_BUTTON = `${SPLASH}--button`;
  const CONTEXTMENU = `${TREE}__contextmenu`;
  const CONTEXTMENU_ADD = `${CONTEXTMENU}--add-leaf`;
  const CONTEXTMENU_REMOVE = `${CONTEXTMENU}--remove-leaf`;
  const INPUT = `${LEAF}-input`;
  const TEXT = `${LEAF}-text`;
  const EXPAND_COLLAPSE = `${LEAF}-expand-collapse`;
  const EXPANDED = `${LEAF}--expanded`;
  const COLLAPSED = `${LEAF}--collapsed`;

  const classAsString = 'MaterialTree3';
  const cssClass = 'mdl-tree3';

  var lastIdContextmenu = 0;

  /**
   * Class MaterialTree3 that organizes a tree based on ul, li
   */
  class MaterialTree3 {

    /**
     * Class constructor for dropdown MDL component.
     * Implements {@link https://github.com/jasonmayes/mdl-component-design-pattern|MDL component design pattern}
     *
     * @param {HTMLElement} element - The element that will be upgraded.
     * @param {MaterialTree3} parent - The parent of the created element
     */
    constructor(element, parent) {
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
    init() {
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
    setupContextmenu_(leaf) {
      var contextmenu = document.importNode(this.Templates_.CONTEXTMENU, true);

      // this is a pretty strange assumption
      var btn = contextmenu.querySelector('.mdl-button');
      var menu = contextmenu.querySelector('.mdl-menu');

      lastIdContextmenu++;
      btn.id = btn.id + lastIdContextmenu;
      menu.setAttribute('for', menu.getAttribute('for') + lastIdContextmenu);

      var btnAdd = menu.querySelector(this.CssSelectors_.CONTEXTMENU_ADD);
      btnAdd.addEventListener('click', (e) => {
        var leaf = e.target.closest(this.CssSelectors_.LEAF);
        leaf[classAsString].appendLeaf();
      });

      var btnRemove = menu.querySelector(this.CssSelectors_.CONTEXTMENU_REMOVE);
      btnRemove.addEventListener('click', (e) => {
        var leaf = e.target.closest(this.CssSelectors_.LEAF);
        leaf[classAsString].removeLeaf();
      });

      var id = this.root_.element_.id;
      if (id) {
        var template = document.querySelector(`template[for="${id}"]`);
        if (template) {
          contextmenu.querySelector('.mdl-menu')
                     .appendChild(document.importNode(template.content, true));
          // You're doing here a very strange assumption! why .mdl-menu__item?
          var items = contextmenu.querySelectorAll('.mdl-menu__item');
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var match = item.classList
                            .toString()
                            .match(/mdl-tree3__contextmenu--([\d\w]+)/);
            if (match) {
              var value = match[1];
              if (['add', 'remove'].includes(value)) {
              } else {
                this.dispatchCustomAction_(leaf, item, value);
              }
            }
          }
        }
      }

      var primaryContent = leaf.querySelector('.mdl-list__item-primary-content');
      leaf.insertBefore(contextmenu, primaryContent);
      componentHandler.upgradeElement(menu);
    }

    /**
     * Dispatch a custom action fired from the context menu
     * This function MUST be refactored. It doesn't use __this__ and
     * looks like an strange patch... maybe static?
     *
     * @private
     */
    dispatchCustomAction_(leaf, item, value) {
      item.addEventListener('click', (e) => {
        e.target.dispatchEvent(new CustomEvent(value, {
          detail: {
            leaf: leaf
          },
          bubbles: true
        }));
      });
    }

    /**
     * Setup the leaf's input
     * This function adds side-effects to the param leaf
     *
     * @private
     * @param {HTMLElement} leaf - the leaf to be upgraded
     */
    setupInput_(leaf) {
      var input = leaf.querySelector(`${this.CssSelectors_.INPUT} input`);
      input.addEventListener('change', (e) => {
        leaf.querySelector(this.CssSelectors_.TEXT)
            .textContent = e.target.value.toString();

        /**
         * On change the leaf's text
         *
         * @event MaterialTree3#changetext
         * @type {CustomEvent}
         * @property {HTMLElement} leaf - The leaf that holds the input
         * @property {String} text - The new text assigned to the leaf
         */
        leaf.dispatchEvent(new CustomEvent('changetext', {
          detail: {
            leaf: leaf,
            text: e.target.value.toString()
          },
          bubbles: true
        }));
      });
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          e.target.blur();
        }
      });
      input.addEventListener('blur', (e) => {
        if (!e.target.value.toString()) {
          leaf[classAsString].removeLeaf();
          return;
        }
        var inputContainer = leaf.querySelector(this.CssSelectors_.INPUT);
        leaf.querySelector(this.CssSelectors_.TEXT)
            .textContent = e.target.value.toString();
        leaf.querySelector(this.CssSelectors_.TEXT).hidden = false;
        inputContainer.hidden = true;
      });
      leaf.querySelector(this.CssSelectors_.TEXT)
          .addEventListener('dblclick', () => {
        var inputContainer = leaf.querySelector(this.CssSelectors_.INPUT);
        var input = inputContainer.querySelector('input');
        input.value = leaf.querySelector(this.CssSelectors_.TEXT).textContent;
        inputContainer.hidden = false;
        leaf.querySelector(this.CssSelectors_.TEXT).hidden = true;
        window.setTimeout(() => {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }, 0);
      });
      if (leaf.querySelector(this.CssSelectors_.TEXT)
              .textContent.toString().trim()) {
        leaf.querySelector(this.CssSelectors_.TEXT).hidden = false;
        leaf.querySelector(this.CssSelectors_.INPUT).hidden = true;
      } else {
        window.setTimeout(() => {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }, 0);
      }
    }

    /**
     * Append the button expand/collapse to the leaf
     *
     * @param {String} type - "expanded" | "collapsed"
     */
    appendExpandCollapse(type) {
      this.appendExpandCollapse_(this.leaf_, type);
    }

    /**
     * Append the button expand/collapse to the leaf
     *
     * @private
     * @param {HTMLElement} leaf - The leaf to upgrade with expand/collapse button
     * @param {String} type - "expanded" | "collapsed"
     */
    appendExpandCollapse_(leaf, type) {
      var type_ = type || 'collapsed';
      var tree = leaf.querySelector(this.CssSelectors_.TREE);
      var clone;
      if (leaf.querySelector(this.CssSelectors_.EXPAND_COLLAPSE)) {
        return tree;
      }
      if (type_ === 'expanded') {
        clone = document.importNode(this.Templates_.EXPANDED_BTN, true);
      } else if (type_ === 'collapsed') {
        clone = document.importNode(this.Templates_.COLLAPSED_BTN, true);
      } else {
        throw new Error(
          'Allowed type = "expanded" || "collapsed" in appendExpandCollapse');
      }
      var c = leaf.querySelector('.mdl-list__item-primary-content').nextSibling;
      if (!c) {
        throw new Error('please, check why nextSibling is null');
      }
      var btn = clone.querySelector(this.CssSelectors_.EXPAND_COLLAPSE);

      // by default, the expand/collapse button is expanded
      // and click will switch expanded to collapsed and so on
      btn.addEventListener('click', (e => {
        var btn = e.target.closest(this.CssSelectors_.EXPAND_COLLAPSE);
        if (btn.classList.contains(this.CssClasses_.EXPANDED)) {
          this.collapseLeaf();
        } else if (btn.classList.contains(this.CssClasses_.COLLAPSED)) {
          this.expandLeaf();
        } else {
          throw new Error('Check the expand/collapse TEMPLATE');
        }
      }).bind(this));

      leaf.insertBefore(clone, c);
      return tree;
    }

    /**
     * Expand the leaf
     *
     * @return {HTMLElement} - The expanded leaf
     */
    expandLeaf() {
      var parent = this.element_.closest(this.CssSelectors_.LEAF);
      var btn = parent.querySelector(this.CssSelectors_.EXPAND_COLLAPSE);
      btn.classList.remove(this.CssClasses_.COLLAPSED);
      btn.classList.add(this.CssClasses_.EXPANDED);
      btn.querySelector('.material-icons').innerHTML = 'keyboard_arrow_down';
      this.element_.hidden = false;

      /**
       * On expand leaf
       *
       * @event MaterialTree3#expand
       * @type {CustomEvent}
       * @property {HTMLElement} leaf - The expanded leaf
       */
      parent.dispatchEvent(new CustomEvent('expand', {
        detail: {
          leaf: parent
        },
        bubbles: true
      }));

      return parent;
    }

    /**
     * Collapse the leaf
     *
     * @return {HTMLElement} - The collapsed leaf
     */
    collapseLeaf() {
      var parent = this.element_.closest(this.CssSelectors_.LEAF);
      var btn = parent.querySelector(this.CssSelectors_.EXPAND_COLLAPSE);
      btn.classList.add(this.CssClasses_.COLLAPSED);
      btn.classList.remove(this.CssClasses_.EXPANDED);
      btn.querySelector('.material-icons').innerHTML = 'keyboard_arrow_up';
      this.element_.hidden = true;

      /**
       * On collapse leaf
       *
       * @event MaterialTree3#collapse
       * @type {CustomEvent}
       * @property {HTMLElement} leaf - The collapsed leaf
       */
      parent.dispatchEvent(new CustomEvent('collapse', {
        detail: {
          leaf: parent
        },
        bubbles: true
      }));

      return parent;
    }

    /**
     * Create an empty leaf
     *
     * @returns {HTMLElement} - The created element
     */
    createLeaf() {
      var clone = document.importNode(this.Templates_.LEAF, true);
      var leaf = clone.querySelector(this.CssSelectors_.LEAF);
      if (!leaf) {
        throw new Error('Incorrect Template');
      }
      var tree = document.createElement('ul');
      tree.classList.add(cssClass);
      var tree3 = new MaterialTree3(tree, this);
      leaf[classAsString] = tree3;
      leaf[classAsString].leaf_ = leaf; // this is for removeLeaf()
      leaf[classAsString].root_ = this.root_; // this is for removeLeaf()
      componentHandler.upgradeElement(leaf.appendChild(tree));
      return leaf;
    }

    /**
     * Append a leaf to the tree
     *
     * @returns {HTMLElement} - The appended element
     */
    appendLeaf(leaf = this.createLeaf()) {
      this.element_.hidden = false;
      this.removeSplash_();

      this.element_.appendChild(leaf);
      this.setupInput_(leaf);
      this.setupContextmenu_(leaf);

      var leaf_;
      if (this.parent_) {
        if (this.parent_.leafs.length > 0) {
          leaf_ = this.element_.closest(this.CssSelectors_.LEAF);
          this.appendExpandCollapse_(leaf_, 'expanded');
          leaf_[classAsString].expandLeaf();
        }
      }

      /**
       * On add leaf
       *
       * @event MaterialTree3#addleaf
       * @type {CustomEvent}
       * @property {HTMLElement} leaf - The added leaf
       */
      leaf.dispatchEvent(new CustomEvent('addleaf', {
        detail: {
          leaf: leaf
        },
        bubbles: true
      }));
      return leaf;
    }

    /**
     * Remove the called leaf from the tree
     *
     * @return {HTMLElement} - The removed element
     */
    removeLeaf() {
      var parent = this.parent_;
      var parentLeaf = parent.element_.closest(this.CssSelectors_.LEAF);
      var btn = null;
      if (parentLeaf) {
        btn = parentLeaf.querySelector(this.CssSelectors_.EXPAND_COLLAPSE);
      }

      /**
       * On remove leaf
       *
       * @event MaterialTree3#removeleaf
       * @type {CustomEvent}
       * @property {HTMLElement} leaf - The removed leaf
       */
      this.leaf_.dispatchEvent(new CustomEvent('removeleaf', {
        detail: {
          leaf: this.leaf_
        },
        bubbles: true
      }));
      this.leaf_.remove();
      this.root_.appendSplash_();

      if (parent.leafs.length == 0) { /* jshint ignore:line */
        if (this.root_ != parent) { /* jshint ignore:line */
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
    appendSplash_() {
      if (this.root_.leafs.length == 0) { /* jshint ignore:line */
        var splash = document.importNode(this.Templates_.SPLASH, true);

        var btn = splash.querySelector('button');
        btn.addEventListener('click', () => {
          this.root_.removeSplash_();
          this.root_.appendLeaf();
        });
        this.root_.element_.appendChild(splash);
      }
    }

    /**
     * Remove the splash
     *
     * @private
     */
    removeSplash_() {
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
    get leaf() {
      var leafs = [];
      for (var i = 0; i < this.element_.children.length; i++) {
        var item = this.element_.children[i];
        if (item.classList.contains(this.CssClasses_.LEAF)) {
          leafs.push(item);
        }
      }
      return leafs;
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
      return this.leaf;
    }
    set leafs(_) {
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
    get CssClasses_() {
      return {
        TREE: `${TREE}`,
        LEAF: `${TREE}__leaf`,
        SPLASH: `${TREE}__splash`,
        SPLASH_BUTTON: `${SPLASH}--button`,
        CONTEXTMENU: `${TREE}__contextmenu`,
        CONTEXTMENU_ADD: `${CONTEXTMENU}--add-leaf`,
        CONTEXTMENU_REMOVE: `${CONTEXTMENU}--remove-leaf`,
        INPUT: `${LEAF}-input`,
        TEXT: `${LEAF}-text`,
        EXPAND_COLLAPSE: `${LEAF}-expand-collapse`,
        EXPANDED: `${LEAF}--expanded`,
        COLLAPSED: `${LEAF}--collapsed`,
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
    get CssSelectors_() {
      return {
        TREE: `.${TREE}`,
        LEAF: `.${TREE}__leaf`,
        SPLASH: `.${TREE}__splash`,
        SPLASH_BUTTON: `.${SPLASH}--button`,
        CONTEXTMENU: `.${TREE}__contextmenu`,
        CONTEXTMENU_ADD: `.${CONTEXTMENU}--add-leaf`,
        CONTEXTMENU_REMOVE: `.${CONTEXTMENU}--remove-leaf`,
        INPUT: `.${LEAF}-input`,
        TEXT: `.${LEAF}-text`,
        EXPAND_COLLAPSE: `.${LEAF}-expand-collapse`,
        EXPANDED: `.${LEAF}--expanded`,
        COLLAPSED: `.${LEAF}--collapsed`,
      };
    }

    /**
     * Store the templates that will be rendered into this component
     *
     * @enum {DocumentFragment}
     * @private
     */
    get Templates_() {
      return {
        SPLASH: createHTML(clean(`
<li class="mdl-list__item ${SPLASH}">
  <div class="mdl-list__item-primary-content">
    <button class="mdl-button mdl-js-button mdl-button--icon ${SPLASH_BUTTON}">
      <i class="material-icons">add</i>
    </button>
  </div>
</li>`)),
        LEAF: createHTML(clean(`
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
</li>`)),
        TREE: createHTML(clean(`
<ul class="mdl-list ${TREE}"></ul>`)),
        CONTEXTMENU: createHTML(clean(`
<button id="${CONTEXTMENU}-"
  class="mdl-button mdl-js-button mdl-button--icon">
  <i class="material-icons">more_vert</i>
</button>
<ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect ${CONTEXTMENU}"
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
</ul>`)),
        EXPANDED_BTN: createHTML(clean(`
<button class="mdl-list__item-secondary-action
               mdl-button mdl-js-button mdl-button--icon
               ${EXPAND_COLLAPSE}
               ${EXPANDED}">
  <i class="material-icons">keyboard_arrow_down</i>
</button>`)),
        COLLAPSED_BTN: createHTML(clean(`
<button class="mdl-list__item-secondary-action
               mdl-button mdl-js-button mdl-button--icon
               ${EXPAND_COLLAPSE}
               ${COLLAPSED}">
  <i class="material-icons">keyboard_arrow_up</i>
</button>`))
      };
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
