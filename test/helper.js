'use strict';
function onload_test(f, m) {
  window.addEventListener('load', async_test(m).step_func(f));
}

function setupTest() {
  const cssTree = 'mdl-tree3';
  var tree = document.createElement('ul');
  tree.classList.add(cssTree);

  document.body.appendChild(tree);
  componentHandler.upgradeElement(tree);
  return {
    tree: tree,
    tree3: tree.Tree3
  };
}
