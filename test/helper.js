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

function setupTemplateTest() {

  var template = `
    <ul id="demo-tree" class="mdl-tree3"></ul>
    <template for="demo-tree">
      <li class="mdl-menu__item
                 mdl-tree3__contextmenu--action1">
        Action 1
      </li>
      <li class="mdl-menu__item
                 mdl-tree3__contextmenu--action2">
        Action 2
      </li>
    </template>
  `;
  var range = new Range();
  var clone = range.createContextualFragment(template);
  document.body.appendChild(clone);

  var tree = document.querySelector('#demo-tree');
  componentHandler.upgradeElement(tree);
  return {
    tree: tree,
    tree3: tree.Tree3,
    actions: [
      {
        css: 'mdl-tree3__contextmenu--action1',
        name: 'action1'
      },
      {
        css: 'mdl-tree3__contextmenu--action2',
        name: 'action2'
      }
    ]
  };
}
