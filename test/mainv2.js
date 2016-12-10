'use strict';

const clsTree = 'Tree3';
const cssTree = 'mdl-tree3';
const selTree = '.' + cssTree;

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
}, "Show the splash screen");
