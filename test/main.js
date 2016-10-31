;(() => {
  'use strict';
  var TAG_SELECTOR = ".mdl-tree";
  var tree = document.querySelector(TAG_SELECTOR);

  test(() => {

    assert_true(tree.hasOwnProperty('leafs'));
    assert_true(tree.leafs instanceof Array);
    assert_throws(null, () => {
      tree.leafs = [];
    }, "Throws when changing leafs to an arbitrarty value");

  }, "Tree tag has only a getter for leafs");

  test(() => {

    assert_true(tree.hasOwnProperty('TEMPLATE_LEAF'));
    assert_true(tree.TEMPLATE_LEAF instanceof DocumentFragment);

  }, "Tree tag contains a default leaf template");

  test(() => {
    assert_true(tree.hasOwnProperty('appendLeaf'));
    assert_true(tree.appendLeaf instanceof Function);

    var leaf = tree.appendLeaf();
    assert_true(leaf instanceof HTMLLIElement);

  }, "Function appendLeaf returns the <li> object-container");

})();
