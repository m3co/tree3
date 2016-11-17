"use strict";

;(function () {
  'use strict';

  var TREE = ".mdl-tree";
  var TREE_ITEM = ".mdl-tree__item";

  var TEMPLATE_LEAF_HTML = "\n    <li class=\"mdl-list__item mdl-tree__item\">\n      <div class=\"mdl-list__item-primary-content\">\n        &nbsp;\n        <span class=\"mdl-tree__item-text\" hidden>\n        </span>\n        <div class=\"mdl-tree__item-input mdl-textfield mdl-js-textfield\">\n          <input class=\"mdl-textfield__input\" type=\"text\" placeholder=\"Label...\">\n        </div>\n        &nbsp;\n      </div>\n    </li>\n  ";
  var TEMPLATE_LEAF = createFromStringDocumentFragment(TEMPLATE_LEAF_HTML);

  var TEMPLATE_TREE_HTML = "\n    <ul class=\"mdl-list mdl-tree\"></ul>\n  ";
  var TEMPLATE_TREE = createFromStringDocumentFragment(TEMPLATE_TREE_HTML);

  var TEMPLATE_LEAF_CONTEXTMENU_HTML = "\n    <button id=\"mdl-tree__contextmenu-\"\n      class=\"mdl-button mdl-js-button mdl-button--icon\">\n      <i class=\"material-icons\">more_vert</i>\n    </button>\n    <ul class=\"mdl-menu mdl-js-menu mdl-js-ripple-effect\"\n      for=\"mdl-tree__contextmenu-\">\n      <li class=\"mdl-menu__item\n                 mdl-menu__item--full-bleed-divider\n                 mdl-tree__contextmenu--item\n                 mdl-tree__contextmenu--add-leaf\">\n        <button class=\"mdl-button mdl-js-button mdl-button--icon\">\n          <i class=\"material-icons\">add</i>\n        </button>\n        <span>Subitem</span>\n      </li>\n    </ul>\n  ";
  var TEMPLATE_LEAF_CONTEXTMENU = createFromStringDocumentFragment(TEMPLATE_LEAF_CONTEXTMENU_HTML);

  var TEMPLATE_LEAF_EXPANDCOLLAPSE_HTML = "\n    <button class=\"mdl-list__item-secondary-action\n                   mdl-button mdl-js-button mdl-button--icon\n                   mdl-tree__item-expand-collapse\n                   mdl-tree__item--expanded\">\n      <i class=\"material-icons\">keyboard_arrow_down</i>\n    </button>\n  ";
  var TEMPLATE_LEAF_EXPANDCOLLAPSE = createFromStringDocumentFragment(TEMPLATE_LEAF_EXPANDCOLLAPSE_HTML);

  var index_contextmenu = 0;
  /**
   * Append a leaf to the initial(root) tree or to any child leaf
   * @return {HTMLElement} - The created element
   */
  function appendLeaf() {
    var clone;

    var expandCollapse = function expandCollapse(btn, tree) {
      if (btn.classList.contains('mdl-tree__item--expanded')) {
        btn.classList.remove('mdl-tree__item--expanded');
        btn.classList.add('mdl-tree__item--collapsed');
        btn.querySelector('.material-icons').innerHTML = "keyboard_arrow_up";
        tree.hidden = true;

        // fire collapse event
        btn.dispatchEvent(new CustomEvent('collapse', {
          bubbles: true
        }));
      } else if (btn.classList.contains('mdl-tree__item--collapsed')) {
        btn.classList.remove('mdl-tree__item--collapsed');
        btn.classList.add('mdl-tree__item--expanded');
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
        tree = clone.children[0];
        this.appendChild(tree);

        initTree(tree);
      }

      // append to the leaf's tree the sub-leaf =>
      // append to the leaf a subleaf
      if (!this.querySelector('.mdl-tree__item-expand-collapse')) {
        clone = document.importNode(tree.TEMPLATE_LEAF_EXPANDCOLLAPSE, true);
        var c = this.querySelector('.mdl-list__item-primary-content').nextSibling;
        if (!c) {
          throw new Error('please, check why nextSibling is null');
        }
        var btn = clone.querySelector('.mdl-tree__item-expand-collapse');

        // by default, the expand/collapse button is expanded
        // and click will switch expanded to collapsed and so on
        btn.addEventListener('click', expandCollapse.bind(null, btn, tree));

        this.insertBefore(clone, c);
      }
      return tree.appendLeaf();
    }

    // if this is "tree" then...
    clone = document.importNode(this.TEMPLATE_LEAF, true);
    var leaf = clone.children[0];
    leaf.querySelector('.mdl-tree__item-input input').addEventListener('change', function (e) {
      leaf.textContent = e.target.value.toString();
      leaf.dispatchEvent(new CustomEvent('changetext', {
        detail: {
          leaf: leaf
        },
        bubbles: true
      }));
    });
    leaf.querySelector('.mdl-tree__item-text').addEventListener('dblclick', function (e) {
      var inputContainer = leaf.querySelector('.mdl-tree__item-input');
      var input = inputContainer.querySelector('input');
      input.value = leaf.textContent;
      inputContainer.hidden = false;
      leaf.querySelector('.mdl-tree__item-text').hidden = true;
      window.setTimeout(function () {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }, 0);
    });

    var contextmenu = document.importNode(this.TEMPLATE_LEAF_CONTEXTMENU, true);

    var button = contextmenu.querySelector('#mdl-tree__contextmenu-');
    var menu = contextmenu.querySelector('[for="mdl-tree__contextmenu-"]');
    button.id += index_contextmenu++;
    menu.setAttribute('for', button.id);

    var c = leaf.querySelector('.mdl-list__item-primary-content');
    var btnAdd = contextmenu.querySelector('.mdl-tree__contextmenu--add-leaf');

    btnAdd.addEventListener('click', function (e) {
      var tree = e.target.closest(TREE_ITEM);
      tree.appendLeaf();
      var btn = tree.querySelector('.mdl-tree__item-expand-collapse');
      if (btn.classList.contains('mdl-tree__item--collapsed')) {
        expandCollapse(btn, tree.querySelector(TREE));
      }
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

  // You should write this tree following the recomendations
  // https://github.com/google/material-design-lite/wiki/Making-your-first-JS-component

  function addProperty__leafs(o) {
    Object.defineProperty(o, 'leafs', {
      get: function get() {
        var parent;
        // once again... you're doing very strange assumptions
        if (this instanceof HTMLUListElement) {
          parent = this;
        } else if (this instanceof HTMLLIElement) {
          parent = this.querySelector('.mdl-tree');
          if (!parent) {
            return [];
          }
        }
        var x = parent.querySelectorAll('.mdl-tree__item');
        var y = [];
        // and this is because CSS can't access to parent elements
        for (var i = 0; i < x.length; i++) {
          if (x[i].parentNode == parent) {
            y.push(x[i]);
          }
        }
        return y;
      },
      set: function set(value) {
        throw new Error("Tree does not allow to change leaf's value. Use append or similar");
      }
    });

    Object.defineProperty(o, 'leaf', {
      get: function get() {
        return o.leafs;
      },
      set: function set(value) {
        o.leafs = value;
      }
    });
  }

  /**
   * Initializes the tree, adding some stuff to the HTMLElement
   * @param {HTMLElement} tree - The tree to update
   */
  function initTree(tree) {
    addProperty__leafs(tree);
    tree.TEMPLATE_LEAF = TEMPLATE_LEAF;
    tree.TEMPLATE_TREE = TEMPLATE_TREE;
    tree.TEMPLATE_LEAF_CONTEXTMENU = TEMPLATE_LEAF_CONTEXTMENU;
    tree.TEMPLATE_LEAF_EXPANDCOLLAPSE = TEMPLATE_LEAF_EXPANDCOLLAPSE;
    tree.appendLeaf = appendLeaf;
  }

  function initLeaf(leaf) {
    addProperty__leafs(leaf);

    Object.defineProperty(leaf, 'textContent', {
      get: function get() {
        return this.querySelector('.mdl-tree__item-text').textContent.replace(/\n/g, '').trim();
      },
      set: function set(value) {
        this.querySelector('.mdl-tree__item-text').textContent = value.toString();
        if (value.toString().length > 0) {
          this.querySelector('.mdl-tree__item-text').hidden = false;
          this.querySelector('.mdl-tree__item-input').hidden = true;
        } else {
          this.querySelector('.mdl-tree__item-text').hidden = true;
          this.querySelector('.mdl-tree__item-input').hidden = false;
        }
      }
    });

    leaf.appendLeaf = appendLeaf;
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