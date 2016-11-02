"use strict";

;(function () {
  'use strict';

  var TREE = ".mdl-tree";
  var TREE_ITEM = ".mdl-tree__item";

  var TEMPLATE_LEAF_HTML = "\n    <li class=\"mdl-list__item mdl-tree__item\">\n      <div class=\"mdl-list__item-primary-content\">\n        &nbsp;\n        <span class=\"mdl-tree__item-text\"></span>\n        &nbsp;\n      </div>\n    </li>\n  ";
  var TEMPLATE_LEAF = createFromStringDocumentFragment(TEMPLATE_LEAF_HTML);

  var TEMPLATE_TREE_HTML = "\n    <ul class=\"mdl-list mdl-tree\"></ul>\n  ";
  var TEMPLATE_TREE = createFromStringDocumentFragment(TEMPLATE_TREE_HTML);

  /**
   * Append a leaf to the initial(root) tree or to any child leaf
   * @return {HTMLElement} - The created element
   */
  function appendLeaf() {
    var clone;

    if (this instanceof HTMLLIElement) {
      var tree = this.querySelector(TREE);
      if (!tree) {
        tree = this.closest(TREE);
        clone = document.importNode(tree.TEMPLATE_TREE, true);
        tree = clone.children[0];
        this.appendChild(tree);

        tree.TEMPLATE_LEAF = TEMPLATE_LEAF;
        tree.TEMPLATE_TREE = TEMPLATE_TREE;
        tree.appendLeaf = appendLeaf;
      }

      return tree.appendLeaf();
    }

    clone = document.importNode(this.TEMPLATE_LEAF, true);
    var leaf = clone.children[0];
    this.appendChild(clone);
    addProperty__leafs(leaf);

    Object.defineProperty(leaf, 'textContent', {
      get: function get() {
        return this.querySelector('.mdl-tree__item-text').textContent;
      },
      set: function set(value) {
        this.querySelector('.mdl-tree__item-text').textContent = value;
      }
    });

    leaf.appendLeaf = appendLeaf;

    return leaf;
  }

  // You should write this tree following the recomendations
  // https://github.com/google/material-design-lite/wiki/Making-your-first-JS-component

  function addProperty__leafs(o) {
    Object.defineProperty(o, 'leafs', {
      get: function get() {
        // this is a hard-coded selector
        return this.querySelectorAll('li');
      },
      set: function set(value) {
        throw new Error("Tree does not allow to change leaf's value. Use append or similar");
      }
    });
  }

  function initTree(tree) {
    addProperty__leafs(tree);
    tree.TEMPLATE_LEAF = TEMPLATE_LEAF;
    tree.TEMPLATE_TREE = TEMPLATE_TREE;
    tree.appendLeaf = appendLeaf;
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