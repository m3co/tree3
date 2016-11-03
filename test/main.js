;(() => {
  'use strict';
  var TAG_SELECTOR = ".mdl-tree";
  var tree = document.querySelector(TAG_SELECTOR);

  test(() => {
    assert_true(tree.leafs instanceof Array);
    assert_throws(null, () => {
      tree.leafs = [];
    }, "Tree.leafs throws when changing leafs to an arbitrarty value");

  }, "Tree tag has only a getter for leafs");

  test(() => {
    assert_true(tree.TEMPLATE_LEAF instanceof DocumentFragment);
    assert_true(tree.TEMPLATE_LEAF_CONTEXTMENU instanceof DocumentFragment);
    assert_true(tree.TEMPLATE_LEAF_EXPANDCOLLAPSE instanceof DocumentFragment);
    assert_true(tree.TEMPLATE_TREE instanceof DocumentFragment);
  }, "Tree tag contains a set of default templates");

  test(() => {
    assert_true(tree.appendLeaf instanceof Function);

    var leaf = tree.appendLeaf();
    assert_true(leaf instanceof HTMLLIElement);

    assert_equals(tree.leafs.length, 1);

    assert_true(leaf.querySelector('#mdl-tree__contextmenu-0') instanceof HTMLElement);
    assert_true(leaf.querySelector('[for="mdl-tree__contextmenu-0"]') instanceof HTMLElement);

    test(() => {

      assert_true(leaf.leafs instanceof Array);
      assert_throws(null, () => {
        leaf.leafs = [];
      }, "Leaf.leafs throws when changin leafs to an arbitrary value");

    }, "Leaf has only a getter for leafs");

    test(() => {
      assert_equals(typeof(leaf.textContent), "string");

      var expected = "Text";
      assert_equals(leaf.textContent, '');
      leaf.textContent = expected;

      var actual = leaf.querySelector('.mdl-tree__item-text').textContent;
      assert_equals(actual, expected);

    }, "Leaf has the property leaf.textContent");

    test(() => {
      assert_true(leaf.appendLeaf instanceof Function);

      var subleaf = leaf.appendLeaf();
      assert_true(subleaf instanceof HTMLLIElement);

      assert_equals(leaf.leafs.length, 1);
      assert_true(subleaf.querySelector('#mdl-tree__contextmenu-1') instanceof HTMLElement);
      assert_true(subleaf.querySelector('[for="mdl-tree__contextmenu-1"]') instanceof HTMLElement);

      subleaf.textContent = "Subtext";

    }, "Leaf's function appendLeaf returns the <li> object-container");

    test(() => {
      assert_equals(tree.leafs.length, 1);
      assert_equals(tree.leafs[0].leafs.length, 1);
    }, "Tree's leafs selector returns tree's children");

  }, "Tree's function appendLeaf returns the <li> object-container");


})();
