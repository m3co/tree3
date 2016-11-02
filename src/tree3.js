;(() => {
  'use strict';
  const TREE = ".mdl-tree";
  const TREE_ITEM = ".mdl-tree__item";

  const TEMPLATE_LEAF_HTML = `
    <li class="mdl-list__item mdl-tree__item">
      <div class="mdl-list__item-primary-content">
        &nbsp;
        <span class="mdl-tree__item-text"></span>
        &nbsp;
      </div>
    </li>
  `;
  var TEMPLATE_LEAF = createFromStringDocumentFragment(TEMPLATE_LEAF_HTML);

  const TEMPLATE_TREE_HTML = `
    <ul class="mdl-list mdl-tree"></ul>
  `;
  var TEMPLATE_TREE = createFromStringDocumentFragment(TEMPLATE_TREE_HTML);

  /**
   * Append a leaf to the initial(root) tree or to any child leaf
   * @return {HTMLElement} - The created element
   */
  function appendLeaf() {
    var clone;

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
      return tree.appendLeaf();
    }

    // if this is "tree" then...
    clone = document.importNode(this.TEMPLATE_LEAF, true);
    var leaf = clone.children[0];
    this.appendChild(clone); // append to the tree the leaf
    initLeaf(leaf);

    return leaf;
  }

  // You should write this tree following the recomendations
  // https://github.com/google/material-design-lite/wiki/Making-your-first-JS-component

  function addProperty__leafs(o) {
    Object.defineProperty(o, 'leafs', {
      get() {
        // this is a hard-coded selector
        return this.querySelectorAll('li');
      },
      set(value) {
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

  function initLeaf(leaf) {
    addProperty__leafs(leaf);

    Object.defineProperty(leaf, 'textContent', {
      get() {
        return this.querySelector('.mdl-tree__item-text').textContent;
      },
      set(value) {
        this.querySelector('.mdl-tree__item-text').textContent = value;
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
