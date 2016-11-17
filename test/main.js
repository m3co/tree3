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

      assert_true(leaf.leaf instanceof Array);
      assert_throws(null, () => {
        leaf.leaf = [];
      }, "Leaf.leafs throws when changin leafs to an arbitrary value");

    }, "Leaf has only a getter for leaf");

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

    test(() => {
      var btn = tree.leafs[0].querySelector('.mdl-tree__item-expand-collapse');
      var btn2 = tree.leafs[0].leafs[0].querySelector('.mdl-tree__item-expand-collapse');
      assert_false(btn2 instanceof HTMLElement);

      assert_true(btn instanceof HTMLElement);
      assert_true(btn.classList.contains('mdl-tree__item--expanded'));
      assert_equals(btn.querySelector('i').innerHTML, 'keyboard_arrow_down');
    }, "Leaf has expand/collapse button");

    async_test("Leaf's expand/collapse button expands/collapses when click").step(function() {
      var leaf = tree.leafs[0];
      var btn = leaf.querySelector('.mdl-tree__item-expand-collapse');
      var subtree = leaf.querySelector('.mdl-tree');
      var listener1 = this.step_func((e) => {
        assert_false(btn.classList.contains('mdl-tree__item--expanded'));

        assert_true(btn.classList.contains('mdl-tree__item--collapsed'));
        assert_equals(btn.querySelector('i').innerHTML, 'keyboard_arrow_up');
        assert_true(subtree.hidden);

        btn.removeEventListener('click', listener1);
        btn.addEventListener('click', listener2);
        btn.dispatchEvent(new MouseEvent('click'));
      });

      var listener2 = this.step_func((e) => {
        assert_false(btn.classList.contains('mdl-tree__item--collapsed'));

        assert_true(btn.classList.contains('mdl-tree__item--expanded'));
        assert_equals(btn.querySelector('i').innerHTML, 'keyboard_arrow_down');
        assert_false(subtree.hidden);

        btn.removeEventListener('click', listener2);
        btn.dispatchEvent(new MouseEvent('click'));
        this.done();
      });

      btn.addEventListener('click', listener1);
      btn.dispatchEvent(new MouseEvent('click'));
    });

    async_test("Add a subitem by clicking on '+ subitem'").step(function() {
      var leaf = tree.leafs[0];
      var btnAdd = leaf.querySelector('.mdl-tree__contextmenu--add-leaf');
      var btnEC = leaf.querySelector('.mdl-tree__item-expand-collapse');
      var beforeAdd = leaf.leafs.length;

      var addLeaf = this.step_func((e) => {
        assert_equals(beforeAdd + 1, leaf.leafs.length);
        assert_false(leaf.querySelector('.mdl-tree').hidden);
        assert_false(btnEC.classList.contains('mdl-tree__item--collapsed'));
        assert_true(btnEC.classList.contains('mdl-tree__item--expanded'));
        this.done();
      });

      btnAdd.addEventListener('click', addLeaf);
      btnAdd.dispatchEvent(new MouseEvent('click'));
    });

    test(() => {

      var leaf = tree.leaf[0].leaf[1];
      assert_false(leaf.querySelector('.mdl-tree__item-input').hidden);

    }, "Leaf has an input if label is empty");

    async_test("Change label if input.onEnter with some text").step(function() {

      var leaf = tree.leaf[0].leaf[1];
      var input = leaf.querySelector('.mdl-tree__item-input .mdl-textfield__input');
      input.value = "My Text";

      var listener1 = this.step_func((e) => {
        input.removeEventListener('change', listener1);

        assert_true(leaf.querySelector('.mdl-tree__item-input').hidden);
        assert_false(leaf.querySelector('.mdl-tree__item-text').hidden);
        assert_equals("My Text", leaf.textContent);

        this.done();
      });

      input.addEventListener('change', listener1);
      input.dispatchEvent(new Event('change'));
    });

    async_test("Change label if span.onDblclick").step(function() {

      var leaf = tree.leaf[0].leaf[1];
      var input = leaf.querySelector('.mdl-tree__item-input .mdl-textfield__input');
      var span = leaf.querySelector('.mdl-tree__item-text');

      var listener1 = this.step_func((e) => {
        span.removeEventListener('dblclick', listener1);

        assert_false(leaf.querySelector('.mdl-tree__item-input').hidden);
        assert_true(leaf.querySelector('.mdl-tree__item-text').hidden);
        input.value = "My changed Text";
        input.dispatchEvent(new Event('change'));
      });

      var listener2 = this.step_func((e) => {
        input.removeEventListener('change', listener2);

        assert_true(leaf.querySelector('.mdl-tree__item-input').hidden);
        assert_false(leaf.querySelector('.mdl-tree__item-text').hidden);
        assert_equals("My changed Text", leaf.textContent);

        this.done();
      });

      span.addEventListener('dblclick', listener1);
      input.addEventListener('change', listener2);

      span.dispatchEvent(new MouseEvent('dblclick'));
    });

    async_test("Expand action launches onBeforeexpand, onExpand").step(function() {

      this.done();
    });

    async_test("Collapse action launches onBeforecollapse, onCollapse").step(function() {

      this.done();
    });

    async_test("appendLeaf() launches onAddleaf").step(function() {

      this.done();
    });

    async_test("Change text action launches onchangetext").step(function() {

      this.done();
    });

  }, "Tree's function appendLeaf returns the <li> object-container");


})();
