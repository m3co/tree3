"use strict";

;(function () {
  'use strict';

  var TREE = ".mdl-tree";
  var TREE_ITEM = ".mdl-tree__item";

  var TEMPLATE_LEAF_HTML = "\n    <li class=\"mdl-list__item mdl-tree__item\">\n      <div class=\"mdl-list__item-primary-content\">\n        &nbsp;\n        <span class=\"mdl-tree__item-text\"></span>\n        &nbsp;\n      </div>\n    </li>\n  ";
  var TEMPLATE_LEAF = createFromStringDocumentFragment(TEMPLATE_LEAF_HTML);

  function appendLeaf() {
    var clone = document.importNode(this.TEMPLATE_LEAF, true);
    var leaf = clone.children[0];
    this.appendChild(clone);

    // this is the same code as (1)
    Object.defineProperty(leaf, 'leafs', {
      get: function get() {
        // this is a hard-coded selector
        return this.querySelectorAll('li');
      },
      set: function set(value) {
        throw new Error("Tree does not allow to change leaf's value. Use append or similar");
      }
    });

    return leaf;
  }

  // You should write this tree following the recomendations
  // https://github.com/google/material-design-lite/wiki/Making-your-first-JS-component

  function upgradeTAG(tree) {

    // this is the same code as (1)
    Object.defineProperty(tree, 'leafs', {
      get: function get() {
        // this is a hard-coded selector
        return this.querySelectorAll('li');
      },
      set: function set(value) {
        throw new Error("Tree does not allow to change leaf's value. Use append or similar");
      }
    });

    tree.TEMPLATE_LEAF = TEMPLATE_LEAF;
    tree.appendLeaf = appendLeaf;
  }

  // UPDATE ALL
  var trees = document.querySelectorAll(TREE);
  for (var i = 0; i < trees.length; i++) {
    upgradeTAG(trees[i]);
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