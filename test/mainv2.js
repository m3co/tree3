'use strict';

const clsTree = 'Tree3';

const cssTree = 'mdl-tree3';
const selTree = `.${cssTree}`;

const cssSplash = `${cssTree}__splash`;
const selSplash = `.${cssSplash}`;

const cssLeaf = `${cssTree}__item`;
const selLeaf = `.${cssLeaf}`;


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

onload_test(function(e) {

  // [setup]
  var tree = document.createElement('ul');
  tree.classList.add(cssTree);

  document.body.appendChild(tree);
  componentHandler.upgradeElement(tree);

  var tree3 = tree.Tree3;

  // [run]
  var leaf = tree3.appendLeaf();

  // [verify]
  assert_equals(tree.querySelector(selLeaf), leaf);
  assert_true(leaf.classList.contains(cssLeaf));
  assert_false(tree.querySelector(selSplash) instanceof HTMLElement);

  // [teardown]
  tree.remove();
  this.done();
}, "appendLeaf() adds a new empty leaf");

/**
 * Show the splash screen
 */
onload_test(function(e) {
  this.done();  // IGNORE
  return;       // IGNORE
  // [setup]
  var tree = document.createElement('ul');
  tree.classList.add(cssTree);

  // [run]
  document.body.appendChild(tree);
  componentHandler.upgradeElement(tree);
  var tree3 = tree.Tree3; // setup

  // [verify]
  // As this is an empty tree, then tree3.leafs.length == 0
  assert_true(tree.querySelector(tree3.CssSelectors_.SPLASH)
    instanceof HTMLElement);

  // [teardown]
  tree.remove();

  this.done();
}, "[IGNORE] Show the splash screen");

/**
 * Click over the splash screen and see if a new leaf was added
 */
onload_test(function(e) {
  this.done();  // IGNORE
  return;       // IGNORE
  // [setup]
  var tree = document.createElement('ul');
  tree.classList.add(cssTree);

  // [run]
  document.body.appendChild(tree);
  componentHandler.upgradeElement(tree);

  // [setup]
  var tree3 = tree.Tree3;
  var splash = tree.querySelector(tree3.CssSelectors_.SPLASH);

  var listener = this.step_func((e) => {
    // [verify]
    assert_true(tree3.leaf[0] instanceof HTMLElement);
    assert_true(tree3.leaf[0].querySelector(tree3.CssSelectors_.TEXT).hidden);
    assert_false(tree3.leaf[0].querySelector(tree3.CssSelectors_.INPUT).hidden);
    assert_false(tree3.querySelector(tree3.CssSelectors_.SPLASH)
      instanceof HTMLElement);

    // [teardown]
    splash.removeEventListener('click', listener);
    tree.remove();
    this.done();
  });

  // [run]
  splash.addEventListener('click', listener);
  splash.dispatchEvent(new MouseEvent('click'));
  this.done();
}, "[IGNORE] Splash screen dissapears if click over +");
