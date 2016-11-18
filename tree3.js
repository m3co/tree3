'use strict';

;(function () {
  'use strict';

  var TREE = ".mdl-tree";
  var TREE_ITEM = TREE + '__item';
  var LEAF_SPLASH = TREE + '__splash';

  var TEMPLATE_LEAF_SPLASH_HTML = '\n    <li class="mdl-list__item ' + TREE_ITEM.slice(1) + '">\n      <div class="mdl-list__item-primary-content">\n        <button class="mdl-button mdl-js-button mdl-button--icon ' + TREE.slice(1) + '__splash">\n          <i class="material-icons">add</i>\n        </button>\n      </div>\n    </li>\n  ';
  var TEMPLATE_LEAF_SPLASH = createFromStringDocumentFragment(TEMPLATE_LEAF_SPLASH_HTML);

  var TEMPLATE_LEAF_HTML = '\n    <li class="mdl-list__item ' + TREE_ITEM.slice(1) + '">\n      <div class="mdl-list__item-primary-content">\n        &nbsp;\n        <span class="' + TREE_ITEM.slice(1) + '-text" hidden>\n        </span>\n        <div class="' + TREE_ITEM.slice(1) + '-input mdl-textfield mdl-js-textfield">\n          <input class="mdl-textfield__input" type="text" placeholder="Label...">\n        </div>\n        &nbsp;\n      </div>\n    </li>\n  ';
  var TEMPLATE_LEAF = createFromStringDocumentFragment(TEMPLATE_LEAF_HTML);

  var TEMPLATE_TREE_HTML = '\n    <ul class="mdl-list ' + TREE.slice(1) + '"></ul>\n  ';
  var TEMPLATE_TREE = createFromStringDocumentFragment(TEMPLATE_TREE_HTML);

  var TEMPLATE_LEAF_CONTEXTMENU_HTML = '\n    <button id="' + TREE.slice(1) + '__contextmenu-"\n      class="mdl-button mdl-js-button mdl-button--icon">\n      <i class="material-icons">more_vert</i>\n    </button>\n    <ul class="mdl-menu mdl-js-menu mdl-js-ripple-effect"\n      for="' + TREE.slice(1) + '__contextmenu-">\n      <li class="mdl-menu__item\n                 mdl-menu__item--full-bleed-divider\n                 ' + TREE.slice(1) + '__contextmenu--item\n                 ' + TREE.slice(1) + '__contextmenu--add-leaf">\n        <button class="mdl-button mdl-js-button mdl-button--icon">\n          <i class="material-icons">add</i>\n        </button>\n        <span>Subitem</span>\n      </li>\n    </ul>\n  ';
  var TEMPLATE_LEAF_CONTEXTMENU = createFromStringDocumentFragment(TEMPLATE_LEAF_CONTEXTMENU_HTML);

  var TEMPLATE_LEAF_EXPANDCOLLAPSE_HTML = '\n    <button class="mdl-list__item-secondary-action\n                   mdl-button mdl-js-button mdl-button--icon\n                   ' + TREE_ITEM.slice(1) + '-expand-collapse\n                   ' + TREE_ITEM.slice(1) + '--expanded">\n      <i class="material-icons">keyboard_arrow_down</i>\n    </button>\n  ';
  var TEMPLATE_LEAF_EXPANDCOLLAPSE = createFromStringDocumentFragment(TEMPLATE_LEAF_EXPANDCOLLAPSE_HTML);

  var index_contextmenu = 0;
  /**
   * Append a leaf to the initial(root) tree or to any child leaf
   * @return {HTMLElement} - The created element
   */
  function appendLeaf() {
    var clone;

    var expandCollapse = function expandCollapse(btn, tree) {
      if (btn.classList.contains(TREE_ITEM.slice(1) + '--expanded')) {
        btn.classList.remove(TREE_ITEM.slice(1) + '--expanded');
        btn.classList.add(TREE_ITEM.slice(1) + '--collapsed');
        btn.querySelector('.material-icons').innerHTML = "keyboard_arrow_up";
        tree.hidden = true;

        // fire collapse event
        btn.dispatchEvent(new CustomEvent('collapse', {
          bubbles: true
        }));
      } else if (btn.classList.contains(TREE_ITEM.slice(1) + '--collapsed')) {
        btn.classList.remove(TREE_ITEM.slice(1) + '--collapsed');
        btn.classList.add(TREE_ITEM.slice(1) + '--expanded');
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
      if (!this.querySelector(TREE_ITEM + '-expand-collapse')) {
        clone = document.importNode(tree.TEMPLATE_LEAF_EXPANDCOLLAPSE, true);
        var c = this.querySelector('.mdl-list__item-primary-content').nextSibling;
        if (!c) {
          throw new Error('please, check why nextSibling is null');
        }
        var btn = clone.querySelector(TREE_ITEM + '-expand-collapse');

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
    leaf.querySelector(TREE_ITEM + '-input input').addEventListener('change', function (e) {
      leaf.textContent = e.target.value.toString();
      leaf.dispatchEvent(new CustomEvent('changetext', {
        detail: {
          leaf: leaf
        },
        bubbles: true
      }));
    });
    leaf.querySelector(TREE_ITEM + '-text').addEventListener('dblclick', function (e) {
      var inputContainer = leaf.querySelector(TREE_ITEM + '-input');
      var input = inputContainer.querySelector('input');
      input.value = leaf.textContent;
      inputContainer.hidden = false;
      leaf.querySelector(TREE_ITEM + '-text').hidden = true;
      window.setTimeout(function () {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }, 0);
    });

    var contextmenu = document.importNode(this.TEMPLATE_LEAF_CONTEXTMENU, true);

    var button = contextmenu.querySelector('#' + TREE.slice(1) + '__contextmenu-');
    var menu = contextmenu.querySelector('[for="' + TREE.slice(1) + '__contextmenu-"]');
    button.id += index_contextmenu++;
    menu.setAttribute('for', button.id);

    var c = leaf.querySelector('.mdl-list__item-primary-content');
    var btnAdd = contextmenu.querySelector(TREE + '__contextmenu--add-leaf');

    btnAdd.addEventListener('click', function (e) {
      var tree = e.target.closest(TREE_ITEM);
      tree.appendLeaf();
      var btn = tree.querySelector(TREE_ITEM + '-expand-collapse');
      if (btn.classList.contains(TREE_ITEM.slice(1) + '--collapsed')) {
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
          parent = this.querySelector('' + TREE);
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
  function initTree(tree, parent) {
    addProperty__leafs(tree);
    tree.TEMPLATE_LEAF = TEMPLATE_LEAF;
    tree.TEMPLATE_TREE = TEMPLATE_TREE;
    tree.TEMPLATE_LEAF_CONTEXTMENU = TEMPLATE_LEAF_CONTEXTMENU;
    tree.TEMPLATE_LEAF_EXPANDCOLLAPSE = TEMPLATE_LEAF_EXPANDCOLLAPSE;
    tree.appendLeaf = appendLeaf;

    if (!parent) {
      var btn = TEMPLATE_LEAF_SPLASH.querySelector(LEAF_SPLASH);
      btn.addEventListener('click', function (e) {
        tree.querySelector(LEAF_SPLASH).closest(TREE_ITEM).remove();
        tree.appendLeaf();
      });
      tree.append(TEMPLATE_LEAF_SPLASH);
    }
  }

  function initLeaf(leaf) {
    addProperty__leafs(leaf);

    Object.defineProperty(leaf, 'textContent', {
      get: function get() {
        return this.querySelector(TREE_ITEM + '-text').textContent.replace(/\n/g, '').trim();
      },
      set: function set(value) {
        this.querySelector(TREE_ITEM + '-text').textContent = value.toString();
        if (value.toString().length > 0) {
          this.querySelector(TREE_ITEM + '-text').hidden = false;
          this.querySelector(TREE_ITEM + '-input').hidden = true;
        } else {
          this.querySelector(TREE_ITEM + '-text').hidden = true;
          this.querySelector(TREE_ITEM + '-input').hidden = false;
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