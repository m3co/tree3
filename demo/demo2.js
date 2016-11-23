;(function() {
  'use strict';
  document.querySelector('.mdl-tree').addEventListener('collapse', function(e) {
    console.log('collapse', e.target);
  });
  document.querySelector('.mdl-tree').addEventListener('expand', function(e) {
    console.log('expand', e.target);
  });
})();
