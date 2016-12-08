;(() => {
  // Close #15 (https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove)
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }
})();
(() => {

  /** Class representing a point. */
  class Dropdow {

    /**
     * Create a point.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
    constructor(element) {

    }
  }

  const TREE = ".mdl-tree";
  const TREE_ITEM = `${TREE}__item`;
  const LEAF_SPLASH = `${TREE}__splash`;
  const LEAF_CONTEXTMENU = `${TREE}__contextmenu`;
  const LEAF_CONTEXTMENU_ADD = `${LEAF_CONTEXTMENU}--add-leaf`;
  const LEAF_CONTEXTMENU_REMOVE = `${LEAF_CONTEXTMENU}--remove-leaf`;
  const LEAF_INPUT = `${TREE_ITEM}-input`;
  const LEAF_TEXT = `${TREE_ITEM}-text`;
  const LEAF_EXPAND_COLLAPSE = `${TREE_ITEM}-expand-collapse`;
  const LEAF_EXPANDED = `${TREE_ITEM}--expanded`;
  const LEAF_COLLAPSED = `${TREE_ITEM}--collapsed`;

  const TEMPLATE_LEAF_SPLASH_HTML = `
    <li class="mdl-list__item ${TREE_ITEM.slice(1)}">
      <div class="mdl-list__item-primary-content">
        <button class="mdl-button mdl-js-button mdl-button--icon ${LEAF_SPLASH.slice(1)}">
          <i class="material-icons">add</i>
        </button>
      </div>
    </li>
  `;
  var TEMPLATE_LEAF_SPLASH = createFromStringDocumentFragment(
      TEMPLATE_LEAF_SPLASH_HTML);

  const TEMPLATE_LEAF_HTML = `
    <li class="mdl-list__item ${TREE_ITEM.slice(1)}">
      <div class="mdl-list__item-primary-content">
        &nbsp;
        <span class="${LEAF_TEXT.slice(1)}" hidden>
        </span>
        <div class="${LEAF_INPUT.slice(1)} mdl-textfield mdl-js-textfield">
          <input class="mdl-textfield__input" type="text" placeholder="Label...">
        </div>
        &nbsp;
      </div>
    </li>
  `;
  var TEMPLATE_LEAF = createFromStringDocumentFragment(TEMPLATE_LEAF_HTML);

  const TEMPLATE_TREE_HTML = `
    <ul class="mdl-list ${TREE.slice(1)}"></ul>
  `;
  var TEMPLATE_TREE = createFromStringDocumentFragment(TEMPLATE_TREE_HTML);

  const TEMPLATE_LEAF_CONTEXTMENU_HTML = `
    <button id="${LEAF_CONTEXTMENU.slice(1)}-"
      class="mdl-button mdl-js-button mdl-button--icon">
      <i class="material-icons">more_vert</i>
    </button>
    <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect"
      for="${LEAF_CONTEXTMENU.slice(1)}-">
      <li class="mdl-menu__item
                 ${LEAF_CONTEXTMENU_ADD.slice(1)}">
        Add
      </li>
      <li class="mdl-menu__item
                 mdl-menu__item--full-bleed-divider
                 ${LEAF_CONTEXTMENU_REMOVE.slice(1)}">
        Remove
      </li>
    </ul>
  `;
  var TEMPLATE_LEAF_CONTEXTMENU = createFromStringDocumentFragment(
      TEMPLATE_LEAF_CONTEXTMENU_HTML);

  const TEMPLATE_LEAF_EXPANDED_BTN_HTML = `
    <button class="mdl-list__item-secondary-action
                   mdl-button mdl-js-button mdl-button--icon
                   ${LEAF_EXPAND_COLLAPSE.slice(1)}
                   ${LEAF_EXPANDED.slice(1)}">
      <i class="material-icons">keyboard_arrow_down</i>
    </button>
  `;
  var TEMPLATE_LEAF_EXPANDED_BTN = createFromStringDocumentFragment(
      TEMPLATE_LEAF_EXPANDED_BTN_HTML);

  const TEMPLATE_LEAF_COLLAPSED_BTN_HTML = `
    <button class="mdl-list__item-secondary-action
                   mdl-button mdl-js-button mdl-button--icon
                   ${LEAF_EXPAND_COLLAPSE.slice(1)}
                   ${LEAF_COLLAPSED.slice(1)}">
      <i class="material-icons">keyboard_arrow_up</i>
    </button>
  `;
  var TEMPLATE_LEAF_COLLAPSED_BTN = createFromStringDocumentFragment(
      TEMPLATE_LEAF_COLLAPSED_BTN_HTML);

  var index_contextmenu = 0;

  /**
   * Create a leaf
   * @return {HTMLElement} - the created element
   */
  function createLeaf() {
    var clone = document.importNode(this.TEMPLATE_LEAF, true);
    var leaf = clone.querySelector(TREE_ITEM);

    configInput(leaf);
    createContextmenu(this, leaf);

    initLeaf(leaf, this);
    return leaf;
  }

  /**
   * Append a leaf to the initial(root) tree or to any child leaf
   * and fires the addleaf event
   * @return {HTMLElement} - The created element
   */
  function appendLeaf() {
    var clone;

    // if this is "leaf" then...
    if (this instanceof HTMLLIElement) {

      // append to the leaf's tree the sub-leaf =>
      // append to the leaf a subleaf
      var tree = insertExpandCollapseBtn(this, "expanded");
      return tree.appendLeaf();
    }

    // if this is "tree" then...
    var leaf = this.createLeaf();
    this.appendChild(leaf);
    if (this.TREE.querySelector(LEAF_SPLASH)) {
      this.TREE.querySelector(LEAF_SPLASH).closest(TREE_ITEM).remove();
    }
    if (this.hidden) {
      this.hidden = false;
    }
    window.componentHandler.upgradeDom();

    this.dispatchEvent(new CustomEvent('addleaf', {
      detail: {
        leaf: leaf
      },
      bubbles: true
    }));
    return leaf;
  }

  function insertExpandCollapseBtn(leaf, type) {
    var tree = leaf.querySelector(TREE);
    if (!tree) {
      tree = leaf.closest(TREE);
      clone = document.importNode(tree.TEMPLATE_TREE, true);
      tree = clone.querySelector(TREE);
      leaf.appendChild(tree);

      initTree(tree, leaf);
    }
    if (leaf.querySelector(LEAF_EXPAND_COLLAPSE)) {
      return tree;
    }
    if (type === "expanded") {
      var clone = document.importNode(tree.TEMPLATE_LEAF_EXPANDED_BTN, true);
    } else if (type === "collapsed" || (!type)) {
      var clone = document.importNode(tree.TEMPLATE_LEAF_COLLAPSED_BTN, true);
    } else {
      throw new Error("Allowed types = 'expanded' || 'collapsed' in appendExpandCollapse");
    }
    var c = leaf.querySelector('.mdl-list__item-primary-content').nextSibling;
    if (!c) {
      throw new Error('please, check why nextSibling is null');
    }
    var btn = clone.querySelector(LEAF_EXPAND_COLLAPSE);

    // by default, the expand/collapse button is expanded
    // and click will switch expanded to collapsed and so on
    btn.addEventListener('click', expandCollapse.bind(null, btn, tree));

    observerExpandCollapse.observe(btn, {
      attributes: true,
      attributeFilter: ['class']
    });
    leaf.insertBefore(clone, c);
    return tree;
  }

  function configInput(leaf) {
    var input = leaf.querySelector(`${LEAF_INPUT} input`);
    input.addEventListener('change', (e) => {
      leaf.textContent = e.target.value.toString();
      leaf.dispatchEvent(new CustomEvent('changetext', {
        detail: {
          leaf: leaf
        },
        bubbles: true
      }));
    });
    input.addEventListener('keyup', (e) => {
      if (e.key == 'Enter') {
        e.target.blur();
      }
    });
    input.addEventListener('blur', (e) => {
      if (!e.target.value.toString()) {
        leaf.removeLeaf();
        return;
      }
      var inputContainer = leaf.querySelector(LEAF_INPUT);
      leaf.textContent = e.target.value.toString();
      leaf.querySelector(LEAF_TEXT).hidden = false;
      inputContainer.hidden = true;
    });
    leaf.querySelector(LEAF_TEXT)
        .addEventListener('dblclick', (e) => {
      var inputContainer = leaf.querySelector(LEAF_INPUT);
      var input = inputContainer.querySelector('input');
      input.value = leaf.textContent;
      inputContainer.hidden = false;
      leaf.querySelector(LEAF_TEXT).hidden = true;
      window.setTimeout(() => {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }, 0);
    });
    window.setTimeout(() => {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }, 0);
  }

  function expandCollapse(btn, tree) {
    observerExpandCollapse.disconnect();
    if (btn.classList.contains(LEAF_EXPANDED.slice(1))) {
      btn.classList.remove(LEAF_EXPANDED.slice(1));
      btn.classList.add(LEAF_COLLAPSED.slice(1));
      collapseLeaf(btn, tree);
    } else if (btn.classList.contains(LEAF_COLLAPSED.slice(1))) {
      btn.classList.remove(LEAF_COLLAPSED.slice(1));
      btn.classList.add(LEAF_EXPANDED.slice(1));
      expandLeaf(btn, tree);
    }
    observerExpandCollapse.observe(btn, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  function expandLeaf(btn, tree) {
    btn.querySelector('.material-icons').innerHTML = "keyboard_arrow_down";
    if (tree.leafs.length > 0) {
      tree.hidden = false;
    } else {
      tree.hidden = true;
    }

    // fire expand event
    btn.dispatchEvent(new CustomEvent('expand', {
      detail: {
        leaf: btn.closest('.mdl-tree__item')
      },
      bubbles: true
    }));
  }

  function collapseLeaf(btn, tree) {
    btn.querySelector('.material-icons').innerHTML = "keyboard_arrow_up";
    tree.hidden = true;

    // fire collapse event
    btn.dispatchEvent(new CustomEvent('collapse', {
      detail: {
        leaf: btn.closest('.mdl-tree__item')
      },
      bubbles: true
    }));
  }

  function dispatchCustomAction(leaf, item, value) {
    item.addEventListener('click', (e) => {
      item.dispatchEvent(new CustomEvent(value, {
        detail: {
          leaf: leaf
        },
        bubbles: true
      }));
    });
  }

  function createContextmenu(tree, leaf) {
    var contextmenu = document.importNode(tree.TEMPLATE_LEAF_CONTEXTMENU, true);

    var id = tree.TREE.id;
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
                          .match(/mdl-tree__contextmenu--([\d\w]+)/);
          if (match) {
            var value = match[1];
            if (['add', 'remove'].includes(value)) {
            } else {
              dispatchCustomAction(leaf, item, value);
            }
          }
        }
      }
    }

    var button = contextmenu.querySelector(`#${LEAF_CONTEXTMENU.slice(1)}-`);
    var menu = contextmenu.querySelector(`[for="${LEAF_CONTEXTMENU.slice(1)}-"]`);
    button.id += index_contextmenu++;
    menu.setAttribute('for', button.id);

    var c = leaf.querySelector('.mdl-list__item-primary-content');
    var btnAdd = contextmenu.querySelector(LEAF_CONTEXTMENU_ADD);
    var btnRemove = contextmenu.querySelector(LEAF_CONTEXTMENU_REMOVE);

    btnAdd.addEventListener('click', (e) => {
      var tree = e.target.closest(TREE_ITEM);
      tree.appendLeaf();
      var btn = tree.querySelector(LEAF_EXPAND_COLLAPSE);
      if (btn.classList.contains(LEAF_COLLAPSED.slice(1))) {
        expandCollapse(btn, tree.querySelector(TREE));
      }
    });

    btnRemove.addEventListener('click', (e) => {
      var leaf = e.target.closest(TREE_ITEM);
      leaf.removeLeaf();
    });

    c.insertBefore(contextmenu, c.firstChild);
  }

  /**
   * Remove the leaf
   */
  function removeLeaf() {
    var tree = this.TREE;
    this.dispatchEvent(new CustomEvent('removeleaf', {
      detail: {
        leaf: this
      },
      bubbles: true
    }));
    var treeContainer = this.closest(TREE);
    var leafContainer = treeContainer.closest(TREE_ITEM);
    this.remove();
    if (treeContainer.leafs.length == 0) {
      if (leafContainer) {
        var btnExpandCollapse = leafContainer.querySelector(LEAF_EXPAND_COLLAPSE);
        btnExpandCollapse.remove();
      }
      if (tree !== treeContainer) {
        treeContainer.remove();
      }
    }
    if (tree.leafs.length == 0) {
      appendSplashLeaf(tree);
    }
  }

  // You should write this tree following the recomendations
  // https://github.com/google/material-design-lite/wiki/Making-your-first-JS-component

  function addProperty__leafs(o) {
    Object.defineProperty(o, 'leafs', {
      get() {
        var parent;
        // once again... you're doing very strange assumptions
        if (this instanceof HTMLUListElement) {
          parent = this;
        } else if (this instanceof HTMLLIElement) {
          parent = this.querySelector(TREE);
          if (!parent) {
            return [];
          }
        }
        var x = parent.querySelectorAll(TREE_ITEM);
        var y = [];
        // and this is because CSS can't access to parent elements
        for (var i = 0; i < x.length; i++) {
          if (x[i].parentNode == parent) {
            // and this is because you don't know deeply CSS!
            if (!x[i].querySelector(LEAF_SPLASH)) {
              y.push(x[i]);
            }
          }
        }
        return y;
      },
      set(value) {
        throw new Error("Tree does not allow to change leaf's value. Use append or similar");
      }
    });

    Object.defineProperty(o, 'leaf', {
      get() {
        return o.leafs;
      },
      set(value) {
        o.leafs = value;
      }
    });
  }

  /**
   * Initializes the tree, adding some stuff to the HTMLElement
   * @param {HTMLElement} tree - The tree to update
   */
  function initTree(tree, parent) {
    var dataUpgraded = tree.getAttribute('data-upgraded');
    if (dataUpgraded) {
      if (dataUpgraded.indexOf('Tree3') > -1) {
        return;
      }
    }

    addProperty__leafs(tree);
    if (parent) {
      Object.defineProperty(tree, "TREE", {
        value: parent.TREE
      });
    } else {
      Object.defineProperty(tree, "TREE", {
        value: tree
      });
    }
    tree.TEMPLATE_LEAF = TEMPLATE_LEAF;
    tree.TEMPLATE_TREE = TEMPLATE_TREE;
    tree.TEMPLATE_LEAF_CONTEXTMENU = TEMPLATE_LEAF_CONTEXTMENU;
    tree.TEMPLATE_LEAF_EXPANDED_BTN = TEMPLATE_LEAF_EXPANDED_BTN;
    tree.TEMPLATE_LEAF_COLLAPSED_BTN = TEMPLATE_LEAF_COLLAPSED_BTN;
    tree.TEMPLATE_LEAF_SPLASH = TEMPLATE_LEAF_SPLASH;
    Object.defineProperty(tree, "appendLeaf", {
      value: appendLeaf
    });
    Object.defineProperty(tree, "removeLeaf", {
      value: removeLeaf
    });
    Object.defineProperty(tree, "createLeaf", {
      value: createLeaf
    });
    Object.defineProperty(tree, "removeSplashLeaf", {
      value: removeSplashLeaf
    });

    if (!parent) {
      appendSplashLeaf(tree);
    }
    if (tree.getAttribute('data-upgraded')) {
      tree.setAttribute('data-upgraded',
                        `${tree.getAttribute('data-upgraded')},Tree3`);
    } else {
      tree.setAttribute('data-upgraded', ',Tree3');
    }
  }

  function appendSplashLeaf(tree) {
    var clone = document.importNode(tree.TEMPLATE_LEAF_SPLASH, true);
    var btn = clone.querySelector(LEAF_SPLASH);
    btn.addEventListener('click', (e) => {
      removeSplashLeaf(tree);
      tree.appendLeaf();
    });
    tree.appendChild(clone);
  }

  function removeSplashLeaf(tree) {
    var _tree = tree || this.TREE;
    var splash = _tree.querySelector(LEAF_SPLASH);
    if (splash) {
      var splashContainer = splash.closest(TREE_ITEM);
      if (splashContainer) {
        splashContainer.remove();
      }
    }
  }

  function initLeaf(leaf, parent) {
    addProperty__leafs(leaf);

    Object.defineProperty(leaf, "TREE", {
      value: parent.TREE
    });

    Object.defineProperty(leaf, "parentLeaf", {
      value: parent.closest(TREE_ITEM)
    });

    Object.defineProperty(leaf, 'textContent', {
      get() {
        return this.querySelector(LEAF_TEXT).textContent.replace(/\n/g, '').trim();
      },
      set(value) {
        this.querySelector(LEAF_TEXT).textContent = value.toString();
        if (value.toString().length > 0) {
          this.querySelector(LEAF_TEXT).hidden = false;
          this.querySelector(LEAF_INPUT).hidden = true;
        } else {
          this.querySelector(LEAF_TEXT).hidden = true;
          this.querySelector(LEAF_INPUT).hidden = false;
        }
      }
    });

    leaf.TEMPLATE_LEAF = TEMPLATE_LEAF;
    leaf.TEMPLATE_TREE = TEMPLATE_TREE;
    leaf.TEMPLATE_LEAF_CONTEXTMENU = TEMPLATE_LEAF_CONTEXTMENU;
    leaf.TEMPLATE_LEAF_EXPANDED_BTN = TEMPLATE_LEAF_EXPANDED_BTN;
    leaf.TEMPLATE_LEAF_COLLAPSED_BTN = TEMPLATE_LEAF_COLLAPSED_BTN;
    leaf.TEMPLATE_LEAF_SPLASH = TEMPLATE_LEAF_SPLASH;
    Object.defineProperty(leaf, "appendLeaf", {
      value: appendLeaf
    });
    Object.defineProperty(leaf, "removeLeaf", {
      value: removeLeaf
    });
    Object.defineProperty(leaf, "createLeaf", {
      value: createLeaf
    });

    Object.defineProperty(leaf, "appendExpandCollapse", {
      value: (type) => {
        var tree = insertExpandCollapseBtn(leaf, type);
        tree.hidden = true;
      }
    });
  }

  var observerExpandCollapse = new MutationObserver((records, instance) => {
    records.forEach((record) => {
      var target = record.target;
      if (!target.parentNode) {
        return;
      }
      if (target.classList.contains(LEAF_EXPAND_COLLAPSE.slice(1))) {
        var tree = target.closest('.mdl-tree__item')
                         .querySelector('.mdl-tree');
        target.hidden = false;
        if (target.classList.contains(LEAF_EXPANDED.slice(1))) {
          expandLeaf(target, tree);
          return;
        }
        if (target.classList.contains(LEAF_COLLAPSED.slice(1))) {
          collapseLeaf(target, tree);
          return;
        }
        target.hidden = true;
        tree.hidden = true;
      }
    });
  });

  var observerTrees = new MutationObserver((records, instance) => {
    records.forEach((record) => {
      var addedNodes = record.addedNodes;
      for (var i = 0; i < addedNodes.length; i++) {
        var node = addedNodes[i];
        if (node.classList &&
            node.classList.contains(TREE.slice(1))) {
          initTree(node);
        } else {
          if (node.querySelector instanceof Function) {
            var tree = node.querySelector(TREE);
            if (tree) {
              initTree(tree);
            }
          }
        }
      }
    });
  });

  // UPDATE ALL
  document.addEventListener('DOMContentLoaded', (e) => {
    var trees = document.querySelectorAll(TREE);
    for (var i = 0; i < trees.length; i++) {
      initTree(trees[i]);
    }
    observerTrees.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });

  /**
   * Create from string a DocumentFragment by wrapping the innerHTML
   * to an auxiliar HTMLElement.
   * @param {string} innerHTML - The content to clone into the template
   * @return {DocumentFragment} The created template
   */
  function createFromStringDocumentFragment(innerHTML) {
    var template = document.createDocumentFragment();
    var wrapper = document.createElement('div');
    wrapper.innerHTML = innerHTML;
    while (wrapper.childNodes.length > 0) {
      template.appendChild(wrapper.firstChild);
    }
    wrapper = undefined;
    return template;
  }

})();
