'use strict';

const clsTree = 'MaterialTree3';
const cssTree = 'mdl-tree3';
const selTree = '.' + cssTree;

onload_test(function(e) {
  var tree = document.querySelector(selTree);

  assert_true(tree.dataset.upgraded.includes(clsTree));
  this.done();
}, "MDL upgrades the component from the Body");
