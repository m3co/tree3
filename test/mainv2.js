'use strict';

const clsTree = 'Tree3';

const cssTree = 'mdl-tree3';
const selTree = `.${cssTree}`;

const cssSplash = `${cssTree}__splash`;
const selSplash = `.${cssSplash}`;

const cssLeaf = `${cssTree}__leaf`;
const selLeaf = `.${cssLeaf}`;

const cssInput = `${cssLeaf}-input`;
const selInput = `.${cssInput}`;

const cssText = `${cssLeaf}-text`;
const selText = `.${cssText}`;

const cssExpandCollapse = `${cssLeaf}-expand-collapse`;
const selExpandCollapse = `.${cssExpandCollapse}`;

const cssExpanded = `${cssLeaf}--expanded`;
const selExpanded = `.${cssExpanded}`;

const cssCollapsed = `${cssLeaf}--collapsed`;
const selCollapsed = `.${cssCollapsed}`;

const cssContextmenu = `${cssTree}__contextmenu`;
const selContextmenu = `.${cssContextmenu}`;

(function() {
/**
 * Do not move this test to any other place and
 * Do not remove the unique <ul class="mdl-tree3" /> element
 * from the index.html
 */
onload_test(function(e) {
  var tree = document.querySelector(selTree);

  assert_true(tree.dataset.upgraded.includes(clsTree));
  this.done();
}, "MDL upgrades the component from the Body");

/**
 * Do not move this test to any other place and
 * Do not remove the unique <ul class="mdl-tree3" /> element
 * from the index.html
 */
onload_test(function(e) {
  var tree3 = document.querySelector(selTree).Tree3;

  assert_true(tree3.leafs instanceof Array);
  assert_true(tree3.leaf instanceof Array);
  assert_true(tree3.appendLeaf instanceof Function);

  assert_true(tree3.expandLeaf instanceof Function);
  assert_true(tree3.collapseLeaf instanceof Function);

  assert_true(tree3.removeLeaf instanceof Function);

  document.querySelector(selTree).remove();
  this.done();
}, "Check the API");

// All the rest tests are
//  - order-independent
//  - repeteable consistently
//  - isolate

/**
 * Check if removeLeaf() from a subleaf hides the subtree too
 */
onload_test(function(e) {
  // [setup]
  var { tree, tree3 } = setupTest();
  var leaf = tree3.appendLeaf();
  var subleaf = leaf.Tree3.appendLeaf();

  // [run]
  subleaf.Tree3.removeLeaf();

  // [verify]
  assert_equals(leaf.Tree3.leafs.length, 0);
  assert_true(leaf.querySelector(selTree).hidden);

  var expandCollapseBtn = leaf.querySelector(selExpandCollapse);
  assert_false(expandCollapseBtn instanceof HTMLElement);

  // [teardown]
  tree.remove();
  this.done();

}, "Check if removeLeaf() from a subleaf hides the subtree too");

/**
 * Check if click on remove button at contextmenu removes the leaf
 */
onload_test(function(e) {
  // [setup]
  var { tree, tree3 } = setupTest();
  var leaf = tree3.appendLeaf();

  var contextmenu = leaf.querySelector(selContextmenu);
  var btnRemove = contextmenu.querySelector(selContextmenu + '--remove-leaf');

  var checkRemoveBtn = this.step_func((e) => {
    // [verify]
    assert_equals(tree3.leafs.length, 0);

    // As this is an empty tree, then tree3.leafs.length == 0
    assert_true(tree.querySelector(tree3.CssSelectors_.SPLASH)
      instanceof HTMLElement);
    assert_false(tree.hidden);

    // [teardown]
    tree.remove();
    this.done();

  });

  // [run]
  btnRemove.addEventListener('click', checkRemoveBtn);
  btnRemove.dispatchEvent(new MouseEvent('click'));
}, "Check if click on remove button at contextmenu removes the leaf");

/**
 * Check if click on add button at contextmenu adds a leaf
 */
onload_test(function(e) {
  // [setup]
  var { tree, tree3 } = setupTest();
  var leaf = tree3.appendLeaf();

  var contextmenu = leaf.querySelector(selContextmenu);
  var btnAdd = contextmenu.querySelector(selContextmenu + '--add-leaf');

  var checkAddBtn = this.step_func((e) => {
    // [verify]
    assert_equals(leaf.Tree3.leafs.length, 1);

    // [teardown]
    tree.remove();
    this.done();

  });

  // [run]
  btnAdd.addEventListener('click', checkAddBtn);
  btnAdd.dispatchEvent(new MouseEvent('click'));
}, "Check if click on add button at contextmenu adds a leaf");

/**
 * Check if a leaf has a context menu with the add and remove buttons
 */
onload_test(function(e) {
  // [setup]
  var { tree, tree3 } = setupTest();
  var leaf = tree3.appendLeaf();

  // [verify]
  var contextmenu = leaf.querySelector(selContextmenu);
  var btnAdd = contextmenu.querySelector(selContextmenu + '--add-leaf');
  var btnRemove = contextmenu.querySelector(selContextmenu + '--remove-leaf');
  assert_true(contextmenu instanceof HTMLElement);
  assert_true(btnAdd instanceof HTMLElement);
  assert_true(btnRemove instanceof HTMLElement);

  // [teardown]
  tree.remove();
  this.done();
}, "Check if a leaf has a context menu with the add and remove buttons");

/**
 * Check if appendLeaf() executed from a leaf adds
 * a new _sub_leaf level 2
 */
onload_test(function(e) {
  // [setup]
  var { tree, tree3 } = setupTest();
  var leaf = tree3.appendLeaf();

  // [run]
  var subleaf = leaf.Tree3.appendLeaf(); // This leaf is an HTMLElement and
  // this leaf has mutated because it has a property called Tree3 that
  // allows to behave like a tree

  subleaf = subleaf.Tree3.appendLeaf();

  // [verify]
  assert_true(subleaf.Tree3.element_.hidden);
  assert_equals(tree3.leaf[0].Tree3.leaf[0].Tree3.leaf[0], subleaf);
  assert_equals(tree3.leaf[0].Tree3.leafs.length, 1);

  // [teardown]
  tree.remove();
  this.done();
}, "Add a subleaf via appendLeaf() - level 2");

/**
 * Check if a leaf that holds any subleaf
 * expands and contracts its subtree if click on the button
 */
onload_test(function(e) {
  // [setup]
  var { tree, tree3 } = setupTest();
  var leaf = tree3.appendLeaf();

  var checkCollapse = this.step_func((e) => {

    // [verify]
    assert_true(btn instanceof HTMLElement);
    assert_true(subleaf.parentNode.hidden);
    assert_true(btn.classList.contains(cssCollapsed));
    assert_false(btn.classList.contains(cssExpanded));

    // [cleanup]
    btn.removeEventListener('click', checkCollapse);
    btn.addEventListener('click', checkExpand);

    // [run]
    btn.dispatchEvent(new MouseEvent('click'));

  });

  var checkExpand = this.step_func((e) => {

    // [verify]
    assert_true(btn instanceof HTMLElement);
    assert_false(subleaf.parentNode.hidden);
    assert_false(btn.classList.contains(cssCollapsed));
    assert_true(btn.classList.contains(cssExpanded));

    // [cleanup]
    btn.removeEventListener('click', checkExpand);

    // [teardown]
    tree.remove();
    this.done();
  });

  // [run]
  var subleaf = leaf.Tree3.appendLeaf(); // This leaf is an HTMLElement and
  // this leaf has mutated because it has a property called Tree3 that
  // allows to behave like a tree

  var btn = leaf.querySelector(selExpandCollapse);
  btn.addEventListener('click', checkCollapse);

  // [run]
  btn.dispatchEvent(new MouseEvent('click'));

}, "Check if the leaf's expand/contract button reacts to click");

/**
 * Check if a leaf that holds any subleaf has
 * the expand/contract button
 */
onload_test(function(e) {
  // [setup]
  var { tree, tree3 } = setupTest();
  var leaf = tree3.appendLeaf();

  // [run]
  var subleaf = leaf.Tree3.appendLeaf(); // This leaf is an HTMLElement and
  // this leaf has mutated because it has a property called Tree3 that
  // allows to behave like a tree

  // [verify]
  var btn = leaf.querySelector(selExpandCollapse);
  assert_true(btn instanceof HTMLElement);
  assert_true(btn.classList.contains(cssExpanded));

  var btn = subleaf.querySelector(selExpandCollapse);
  assert_equals(btn, null);

  // [teardown]
  tree.remove();
  this.done();
}, "Check if a leaf that contains a subleaf has the expand/contract button");

/**
 * Check if appendLeaf() executed from a leaf adds
 * a new _sub_leaf level 1
 */
onload_test(function(e) {
  // [setup]
  var { tree, tree3 } = setupTest();
  var leaf = tree3.appendLeaf();

  // [run]
  var subleaf = leaf.Tree3.appendLeaf(); // This leaf is an HTMLElement and
  // this leaf has mutated because it has a property called Tree3 that
  // allows to behave like a tree

  // [verify]
  assert_true(subleaf.Tree3.element_.hidden);
  assert_equals(tree3.leaf[0].Tree3.leaf[0], subleaf);
  assert_equals(tree3.leafs.length, 1);

  // [teardown]
  tree.remove();
  this.done();
}, "Add a subleaf via appendLeaf() - level 1");

/**
 * Check if a new leaf offers an input place.
 * If text introduced - then saves the leaf
 */
onload_test(function(e) {
  // [setup]
  var { tree, tree3 } = setupTest();
  var leaf = tree3.appendLeaf();
  var input = leaf.querySelector('input');
  var textFixture = "fixture";

  var listener = this.step_func(function(e) {
    // [verify]
    assert_true(leaf.querySelector(selInput).hidden);
    assert_false(leaf.querySelector(selText).hidden);
    assert_equals(leaf.querySelector(selText).textContent, textFixture);

    // [teardown]
    tree.remove();
    this.done();
  });
  input.addEventListener('blur', listener);

  // [run]
  input.value = textFixture;
  input.dispatchEvent(new Event('blur'));

}, "Check if a new leaf offers an input place");

/**
 * Check if appendLeaf adds a new empty leaf and
 * removes the splash screen
 */
onload_test(function(e) {
  // [setup]
  var { tree, tree3 } = setupTest();

  // [run]
  var leaf = tree3.appendLeaf();

  // [verify]
  assert_equals(tree.querySelector(selLeaf), leaf);
  assert_true(leaf.classList.contains(cssLeaf));
  assert_false(tree.querySelector(selSplash) instanceof HTMLElement);

  assert_true(leaf.querySelector(selInput) instanceof HTMLElement);
  assert_false(leaf.querySelector(selInput).hidden);
  assert_true(leaf.querySelector(selText) instanceof HTMLElement);
  assert_true(leaf.querySelector(selText).hidden);

  assert_true(leaf.Tree3 instanceof Tree3);

  // [teardown]
  tree.remove();
  this.done();
}, "appendLeaf() adds a new empty leaf");

/**
 * Show the splash screen
 */
onload_test(function(e) {
  // [setup]
  var { tree, tree3 } = setupTest();

  // [verify]
  // As this is an empty tree, then tree3.leafs.length == 0
  assert_true(tree.querySelector(tree3.CssSelectors_.SPLASH)
    instanceof HTMLElement);

  // [teardown]
  tree.remove();

  this.done();
}, "Show the splash screen");

/**
 * Click over the splash screen and see if a new leaf was added
 */
onload_test(function(e) {
  // [setup]
  var { tree, tree3 } = setupTest();

  // [setup]
  var tree3 = tree.Tree3;
  var splashBtn = tree.querySelector(tree3.CssSelectors_.SPLASH_BUTTON);

  var listener = this.step_func((e) => {
    // [verify]
    assert_true(tree3.leaf[0] instanceof HTMLElement);
    assert_true(tree3.leaf[0].querySelector(tree3.CssSelectors_.TEXT).hidden);
    assert_false(tree3.leaf[0].querySelector(tree3.CssSelectors_.INPUT).hidden);
    assert_false(tree.querySelector(tree3.CssSelectors_.SPLASH)
      instanceof HTMLElement);

    // [teardown]
    splashBtn.removeEventListener('click', listener);
    tree.remove();
    this.done();
  });

  // [run]
  splashBtn.addEventListener('click', listener);
  splashBtn.dispatchEvent(new MouseEvent('click'));
}, "Splash screen dissapears if click over +");

})();
