;(() => {
  'use strict';
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
    <ul class="mdl-menu mdl-js-menu"
      for="${LEAF_CONTEXTMENU.slice(1)}-">
      <li class="mdl-menu__item
                 mdl-menu__item--full-bleed-divider
                 mdl-tree__contextmenu--item
                 ${LEAF_CONTEXTMENU_ADD.slice(1)}">
        <button class="mdl-button mdl-js-button mdl-button--icon">
          <i class="material-icons">add</i>
        </button>
        Add
      </li>
      <li class="mdl-menu__item
                 mdl-menu__item--full-bleed-divider
                 mdl-tree__contextmenu--item
                 ${LEAF_CONTEXTMENU_REMOVE.slice(1)}">
        <button class="mdl-button mdl-js-button mdl-button--icon">
          <i class="material-icons">remove</i>
        </button>
        Remove
      </li>
    </ul>
  `;
  var TEMPLATE_LEAF_CONTEXTMENU = createFromStringDocumentFragment(
      TEMPLATE_LEAF_CONTEXTMENU_HTML);

  const TEMPLATE_LEAF_EXPANDCOLLAPSE_HTML = `
    <button class="mdl-list__item-secondary-action
                   mdl-button mdl-js-button mdl-button--icon
                   ${LEAF_EXPAND_COLLAPSE.slice(1)}
                   ${LEAF_EXPANDED.slice(1)}">
      <i class="material-icons">keyboard_arrow_down</i>
    </button>
  `;
  var TEMPLATE_LEAF_EXPANDCOLLAPSE = createFromStringDocumentFragment(
      TEMPLATE_LEAF_EXPANDCOLLAPSE_HTML);

  var index_contextmenu = 0;
  /**
   * Append a leaf to the initial(root) tree or to any child leaf
   * @return {HTMLElement} - The created element
   */
  function appendLeaf() {
    var clone;

    var expandCollapse = (btn, tree) => {
      if (btn.classList.contains(LEAF_EXPANDED.slice(1))) {
        btn.classList.remove(LEAF_EXPANDED.slice(1));
        btn.classList.add(LEAF_COLLAPSED.slice(1));
        btn.querySelector('.material-icons').innerHTML = "keyboard_arrow_up";
        tree.hidden = true;

        // fire collapse event
        btn.dispatchEvent(new CustomEvent('collapse', {
          bubbles: true
        }));
      } else if (btn.classList.contains(LEAF_COLLAPSED.slice(1))) {
        btn.classList.remove(LEAF_COLLAPSED.slice(1));
        btn.classList.add(LEAF_EXPANDED.slice(1));
        btn.querySelector('.material-icons').innerHTML = "keyboard_arrow_down";
        tree.hidden = false;

        // fire expand event
        btn.dispatchEvent(new CustomEvent('expand', {
          bubbles: true
        }));
      }
    };

    // if this is "leaf" then...
    if (this instanceof HTMLLIElement) {
      var tree = this.querySelector(TREE);
      if (!tree) {
        tree = this.closest(TREE);
        clone = document.importNode(tree.TEMPLATE_TREE, true);
        tree = clone.querySelector(TREE);
        this.appendChild(tree);

        initTree(tree, this);
      }

      // append to the leaf's tree the sub-leaf =>
      // append to the leaf a subleaf
      if (!this.querySelector(LEAF_EXPAND_COLLAPSE)) {
        clone = document.importNode(tree.TEMPLATE_LEAF_EXPANDCOLLAPSE, true);
        var c = this.querySelector('.mdl-list__item-primary-content').nextSibling;
        if (!c) {
          throw new Error('please, check why nextSibling is null');
        }
        var btn = clone.querySelector(LEAF_EXPAND_COLLAPSE);

        // by default, the expand/collapse button is expanded
        // and click will switch expanded to collapsed and so on
        btn.addEventListener('click', expandCollapse.bind(null, btn, tree));

        this.insertBefore(clone, c);
      }
      return tree.appendLeaf();
    }

    // if this is "tree" then...
    clone = document.importNode(this.TEMPLATE_LEAF, true);
    var leaf = clone.querySelector(TREE_ITEM);
    leaf.querySelector(`${LEAF_INPUT} input`)
        .addEventListener('change', (e) => {
      leaf.textContent = e.target.value.toString();
      leaf.dispatchEvent(new CustomEvent('changetext', {
        detail: {
          leaf: leaf
        },
        bubbles: true
      }));
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

    var contextmenu = document.importNode(this.TEMPLATE_LEAF_CONTEXTMENU, true);

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
      leaf.dispatchEvent(new CustomEvent('removeleaf', {
        detail: {
          leaf: leaf
        },
        bubbles: true
      }));
      leaf.removeLeaf();
    });

    c.insertBefore(contextmenu, c.firstChild);

    this.appendChild(clone); // append to the tree the leaf
    initLeaf(leaf);

    window.componentHandler.upgradeDom();
    this.dispatchEvent(new CustomEvent('addleaf', {
      detail: {
        leaf: leaf
      },
      bubbles: true
    }));
    return leaf;
  }

  /**
   * Remove the leaf
   */
  function removeLeaf() {
    this.remove();
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
    addProperty__leafs(tree);
    tree.TEMPLATE_LEAF = TEMPLATE_LEAF;
    tree.TEMPLATE_TREE = TEMPLATE_TREE;
    tree.TEMPLATE_LEAF_CONTEXTMENU = TEMPLATE_LEAF_CONTEXTMENU;
    tree.TEMPLATE_LEAF_EXPANDCOLLAPSE = TEMPLATE_LEAF_EXPANDCOLLAPSE;
    Object.defineProperty(tree, "appendLeaf", {
      value: appendLeaf
    });
    Object.defineProperty(tree, "removeLeaf", {
      value: removeLeaf
    });

    if (!parent) {
      var btn = TEMPLATE_LEAF_SPLASH.querySelector(LEAF_SPLASH);
      btn.addEventListener('click', (e) => {
        tree.querySelector(LEAF_SPLASH).closest(TREE_ITEM).remove();
        tree.appendLeaf();
      });
      tree.append(TEMPLATE_LEAF_SPLASH);
    }
  }

  function initLeaf(leaf) {
    addProperty__leafs(leaf);

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

    Object.defineProperty(leaf, "appendLeaf", {
      value: appendLeaf
    });
    Object.defineProperty(leaf, "removeLeaf", {
      value: removeLeaf
    });
  }

  // UPDATE ALL
  var trees = document.querySelectorAll(TREE);
  for (var i = 0; i < trees.length; i++) {
    initTree(trees[i]);
  }

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
