;(() => {
  'use strict';
  var TREE = ".mdl-tree";
  var TREE_ITEM = ".mdl-tree__item";
  var trees = document.querySelectorAll(TREE);

  // You should write this tree following the recomendations
  // https://github.com/google/material-design-lite/wiki/Making-your-first-JS-component

  function upgradeTAG(tree) {
    var leafs = [];
    Object.defineProperty(tree, 'leafs', {
      get() {
        return leafs;
      },
      set(value) {
        throw new Error("Tree does not allow to change leaf's value. Use append or similar");
      }
    });
  }

  for (var i = 0; i < trees.length; i++) {
    upgradeTAG(trees[i]);
  }

})();
