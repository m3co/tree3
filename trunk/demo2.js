;(function() {
  'use strict';
  document.querySelector('.mdl-tree3').addEventListener('collapse', function(e) {
    console.log('collapse', e.detail);
  });
  document.querySelector('.mdl-tree3').addEventListener('expand', function(e) {
    console.log('expand', e.detail);
  });
})();
