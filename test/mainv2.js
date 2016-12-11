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

  assert_true(tree3.leafs instanceof NodeList);
  assert_true(tree3.leaf instanceof NodeList);
  assert_true(tree3.appendLeaf instanceof Function);

  document.querySelector(selTree).remove();
  this.done();
}, "Check the API");

// All the rest tests are
//  - order-independent
//  - repeteable consistently
//  - isolate

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
  var splash = tree.querySelector(tree3.CssSelectors_.SPLASH);

  var listener = this.step_func((e) => {
    // [verify]
    assert_true(tree3.leaf[0] instanceof HTMLElement);
    assert_true(tree3.leaf[0].querySelector(tree3.CssSelectors_.TEXT).hidden);
    assert_false(tree3.leaf[0].querySelector(tree3.CssSelectors_.INPUT).hidden);
    assert_false(tree.querySelector(tree3.CssSelectors_.SPLASH)
      instanceof HTMLElement);

    // [teardown]
    splash.removeEventListener('click', listener);
    tree.remove();
    this.done();
  });

  // [run]
  splash.addEventListener('click', listener);
  splash.dispatchEvent(new MouseEvent('click'));
}, "Splash screen dissapears if click over +");
