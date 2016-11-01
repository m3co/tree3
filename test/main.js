;(() => {
  'use strict';
  var TAG_SELECTOR = ".mdl-tree";
  var tree = document.querySelector(TAG_SELECTOR);

  test(() => {

    assert_true(tree.hasOwnProperty('leafs'));
    assert_true(tree.leafs instanceof NodeList);
    assert_throws(null, () => {
      tree.leafs = [];
    }, "Tree.leafs throws when changing leafs to an arbitrarty value");

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

    assert_equals(tree.leafs.length, 1);

    test(() => {
      assert_true(leaf.hasOwnProperty('leafs'));
      assert_true(leaf.leafs instanceof NodeList);
      assert_throws(null, () => {
        leaf.leafs = [];
      }, "Leaf.leafs throws when changin leafs to an arbitrary value");

    }, "Leaf has only a getter for leafs");

    test(() => {
      assert_true(leaf.hasOwnProperty('textContent'));

      var expected = "Text";
      assert_equals(leaf.textContent, '');
      leaf.textContent = expected;

      var actual = leaf.querySelector('.mdl-tree__item-text').textContent;
      assert_equals(actual, expected);

    }, "Leaf has the property leaf.textContent");

    test(() => {

      assert_true(leaf.hasOwnProperty('appendLeaf'));
      assert_true(leaf.appendLeaf instanceof Function);

      var subleaf = leaf.appendLeaf();
      assert_true(subleaf instanceof HTMLLIElement);

      assert_equals(leaf.leafs.length, 1);

    }, "Leaf's function appendLeaf returns the <li> object-container");

  }, "Tree's function appendLeaf returns the <li> object-container");


})();
