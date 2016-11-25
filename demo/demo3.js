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

})();
