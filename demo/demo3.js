;(function() {
  'use strict';
  var tree = document.querySelector('#demo-tree');
  tree.addEventListener('action1', function(e) {
    console.log('action 1', e.detail.leaf);
    e.detail.leaf.appendExpandCollapse();
  });
  tree.addEventListener('action2', function(e) {
    console.log('action 2', e.detail.leaf);
    e.detail.leaf.appendExpandCollapse("expanded");
  });
  tree.addEventListener('expand', function(e) {
    console.log('expanded');
  });
  tree.addEventListener('collapse', function(e) {
    console.log('collapse');
  });
  tree.addEventListener('addleaf', function(e) {
    console.log('add leaf', e.detail);
  });
  tree.addEventListener('removeleaf', function(e) {
    console.log('remove leaf', e.detail);
  });
  tree.addEventListener('changetext', function(e) {
    console.log('change text', e.detail);
  });
})();
