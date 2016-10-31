;(() => {
  'use strict';
  var TAG_SELECTOR = ".mdl-tree";
  var tree = document.querySelector(TAG_SELECTOR);

  test(() => {

    assert_true(tree.hasOwnProperty('leafs'));
    assert_true(tree.leafs instanceof Array);
    assert_throws(null, () => {
      tree.leafs = [];
    }, "Throws when changing leafs to an arbitrarty value");

    // this is for future definitions... it may change
  }, "Tree tag has a defined interface");

})();
