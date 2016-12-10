'use strict';

const clsTree = 'Tree3';
const cssTree = 'mdl-tree3';
const selTree = '.' + cssTree;

onload_test(function(e) {
  var tree = document.querySelector(selTree);

  assert_true(tree.dataset.upgraded.includes(clsTree));
  this.done();
}, "MDL upgrades the component from the Body");

onload_test(function(e) {
  var tree3 = document.querySelector(selTree).Tree3;

  assert_true(tree3.leafs instanceof NodeList);

  this.done();
}, "Check the API");
