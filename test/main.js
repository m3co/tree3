function mainTest(tree, index_cm) {
  'use strict';
  assert_true(tree.dataset.hasOwnProperty('upgraded'));
  assert_true(tree.dataset.upgraded.indexOf(',Tree3') >= 0);

  test(() => {
    assert_true(tree.leafs instanceof Array);
    assert_equals(tree.leafs.length, 0);
    assert_throws(null, () => {
      tree.leafs = [];
    }, "Tree.leafs throws when changing leafs to an arbitrarty value");

  }, "Tree tag has only a getter for leafs");

  test(() => {
    assert_true(tree.TEMPLATE_LEAF instanceof DocumentFragment);
    assert_true(tree.TEMPLATE_LEAF_CONTEXTMENU instanceof DocumentFragment);
    assert_true(tree.TEMPLATE_LEAF_EXPANDCOLLAPSE instanceof DocumentFragment);
    assert_true(tree.TEMPLATE_TREE instanceof DocumentFragment);
  }, "Tree tag contains a set of default templates");

  test(() => {
    var splash = tree.querySelector('.mdl-tree__splash');
    assert_true(splash instanceof HTMLElement);
  }, "Tree has an splash screen if it's empty");

  async_test((t) => {
    var splash = tree.querySelector('.mdl-tree__splash');

    var listener = t.step_func((e) => {
      splash.removeEventListener('click', listener);

      assert_true(tree.leaf[0] instanceof HTMLElement);
      assert_true(tree.leaf[0].querySelector('.mdl-tree__item-text').hidden);
      assert_false(tree.leaf[0].querySelector('.mdl-tree__item-input').hidden);
      assert_false(tree.querySelector('.mdl-tree__splash') instanceof HTMLElement);

      t.done();
    });

    splash.addEventListener('click', listener);
    splash.dispatchEvent(new MouseEvent('click'));
  }, "Splash screen dissapears if click over +");

  async_test((t) => {

    assert_true(tree.removeLeaf instanceof Function);
    var leaf = tree.leaf[0];
    var btnRemove = leaf.querySelector('.mdl-tree__contextmenu--remove-leaf');

    var listener = t.step_func((e) => {
      btnRemove.removeEventListener('click', listener);
      assert_true(tree.querySelector('.mdl-tree__splash') instanceof HTMLElement);
      t.done();
    });

    btnRemove.addEventListener('click', listener);
    btnRemove.dispatchEvent(new MouseEvent('click'));

  }, "Splash screen appears if remove the unique leaf in the tree");

  test(() => {
    assert_true(tree.appendLeaf instanceof Function);

    var leaf = tree.appendLeaf();
    assert_false(tree.querySelector('.mdl-tree__splash') instanceof HTMLElement);
    assert_true(leaf instanceof HTMLLIElement);

    assert_equals(tree.leafs.length, 1);

    assert_true(leaf.querySelector(`#mdl-tree__contextmenu-${index_cm}`) instanceof HTMLElement);
    assert_true(leaf.querySelector(`[for="mdl-tree__contextmenu-${index_cm}"]`) instanceof HTMLElement);

    test(() => {

      assert_true(leaf.leaf instanceof Array);
      assert_throws(null, () => {
        leaf.leaf = [];
      }, "Leaf.leafs throws when changin leafs to an arbitrary value");

    }, "Leaf has only a getter for leaf");

    test(() => {

      assert_true(leaf.leafs instanceof Array);
      assert_throws(null, () => {
        leaf.leafs = [];
      }, "Leaf.leafs throws when changin leafs to an arbitrary value");

    }, "Leaf has only a getter for leafs");

    test(() => {
      assert_equals(typeof(leaf.textContent), "string");

      var expected = "Text";
      assert_equals(leaf.textContent, '');
      leaf.textContent = expected;

      var actual = leaf.querySelector('.mdl-tree__item-text').textContent;
      assert_equals(actual, expected);

    }, "Leaf has the property leaf.textContent");

    test(() => {
      assert_true(leaf.appendLeaf instanceof Function);

      var subleaf = leaf.appendLeaf();
      assert_true(subleaf instanceof HTMLLIElement);

      assert_equals(leaf.leafs.length, 1);
      assert_true(subleaf.querySelector(`#mdl-tree__contextmenu-${index_cm + 1}`) instanceof HTMLElement);
      assert_true(subleaf.querySelector(`[for="mdl-tree__contextmenu-${index_cm + 1}"]`) instanceof HTMLElement);

      subleaf.textContent = "Subtext";

    }, "Leaf's function appendLeaf returns the <li> object-container");

    test(() => {
      assert_equals(tree.leafs.length, 1);
      assert_equals(tree.leafs[0].leafs.length, 1);
    }, "Tree's leafs selector returns tree's children");

    test(() => {
      var btn = tree.leafs[0].querySelector('.mdl-tree__item-expand-collapse');
      var btn2 = tree.leafs[0].leafs[0].querySelector('.mdl-tree__item-expand-collapse');
      assert_false(btn2 instanceof HTMLElement);

      assert_true(btn instanceof HTMLElement);
      assert_true(btn.classList.contains('mdl-tree__item--expanded'));
      assert_equals(btn.querySelector('i').innerHTML, 'keyboard_arrow_down');
    }, "Leaf has expand/collapse button");

    async_test((t) => {
      var leaf = tree.leafs[0];
      var btn = leaf.querySelector('.mdl-tree__item-expand-collapse');
      var subtree = leaf.querySelector('.mdl-tree');
      var listener1 = t.step_func((e) => {
        assert_false(btn.classList.contains('mdl-tree__item--expanded'));

        assert_true(btn.classList.contains('mdl-tree__item--collapsed'));
        assert_equals(btn.querySelector('i').innerHTML, 'keyboard_arrow_up');
        assert_true(subtree.hidden);

        btn.removeEventListener('click', listener1);
        btn.addEventListener('click', listener2);
        btn.dispatchEvent(new MouseEvent('click'));
      });

      var listener2 = t.step_func((e) => {
        assert_false(btn.classList.contains('mdl-tree__item--collapsed'));

        assert_true(btn.classList.contains('mdl-tree__item--expanded'));
        assert_equals(btn.querySelector('i').innerHTML, 'keyboard_arrow_down');
        assert_false(subtree.hidden);

        btn.removeEventListener('click', listener2);
        btn.dispatchEvent(new MouseEvent('click'));
        t.done();
      });

      btn.addEventListener('click', listener1);
      btn.dispatchEvent(new MouseEvent('click'));
    }, "Leaf's expand/collapse button expands/collapses when click");

    async_test((t) => {
      var leaf = tree.leafs[0];
      var btnAdd = leaf.querySelector('.mdl-tree__contextmenu--add-leaf');
      var btnEC = leaf.querySelector('.mdl-tree__item-expand-collapse');
      var beforeAdd = leaf.leafs.length;

      var addLeaf = t.step_func((e) => {
        btnAdd.removeEventListener('click', addLeaf);
        assert_equals(beforeAdd + 1, leaf.leafs.length);
        assert_false(leaf.querySelector('.mdl-tree').hidden);
        assert_false(btnEC.classList.contains('mdl-tree__item--collapsed'));
        assert_true(btnEC.classList.contains('mdl-tree__item--expanded'));
        t.done();
      });

      btnAdd.addEventListener('click', addLeaf);
      btnAdd.dispatchEvent(new MouseEvent('click'));
    }, "Add a subitem by clicking on '+ add'");

    test(() => {

      var leaf = tree.leaf[0].leaf[1];
      assert_false(leaf.querySelector('.mdl-tree__item-input').hidden);

    }, "Leaf has an input if label is empty");

    async_test((t) => {

      var leaf = tree.leaf[0].leaf[1];
      var input = leaf.querySelector('.mdl-tree__item-input .mdl-textfield__input');
      input.value = "My Text";

      var listener1 = t.step_func((e) => {
        input.removeEventListener('change', listener1);

        assert_true(leaf.querySelector('.mdl-tree__item-input').hidden);
        assert_false(leaf.querySelector('.mdl-tree__item-text').hidden);
        assert_equals("My Text", leaf.textContent);

        t.done();
      });

      input.addEventListener('change', listener1);
      input.dispatchEvent(new Event('change'));
    }, "Change label if input.onEnter with some text");

    async_test((t) => {

      var leaf = tree.leaf[0].leaf[1];
      var input = leaf.querySelector('.mdl-tree__item-input .mdl-textfield__input');
      var span = leaf.querySelector('.mdl-tree__item-text');

      var listener1 = t.step_func((e) => {
        span.removeEventListener('dblclick', listener1);

        assert_false(leaf.querySelector('.mdl-tree__item-input').hidden);
        assert_true(leaf.querySelector('.mdl-tree__item-text').hidden);
        input.value = "My changed Text";
        input.dispatchEvent(new Event('change'));
      });

      var listener2 = t.step_func((e) => {
        input.removeEventListener('change', listener2);

        assert_true(leaf.querySelector('.mdl-tree__item-input').hidden);
        assert_false(leaf.querySelector('.mdl-tree__item-text').hidden);
        assert_equals("My changed Text", leaf.textContent);

        t.done();
      });

      span.addEventListener('dblclick', listener1);
      input.addEventListener('change', listener2);

      span.dispatchEvent(new MouseEvent('dblclick'));
    }, "Change label if span.onDblclick");

    async_test((t) => {
      var leaf = tree.leaf[0];
      var btn = leaf.querySelector('.mdl-tree__item-expand-collapse');

      var listener = t.step_func((e) => {
        leaf.removeEventListener('collapse', listener);
        assert_true(btn.classList.contains('mdl-tree__item--collapsed'));
        assert_false(btn.classList.contains('mdl-tree__item--expanded'));
        t.done();
      });
      leaf.addEventListener('collapse', listener);
      assert_true(btn.classList.contains('mdl-tree__item--expanded'));

      btn.dispatchEvent(new MouseEvent('click'));
    }, "Collapse action launches onCollapse");

    async_test((t) => {
      var leaf = tree.leaf[0];
      var btn = leaf.querySelector('.mdl-tree__item-expand-collapse');

      var listener = t.step_func((e) => {
        leaf.removeEventListener('expand', listener);
        assert_false(btn.classList.contains('mdl-tree__item--collapsed'));
        assert_true(btn.classList.contains('mdl-tree__item--expanded'));
        t.done();
      });
      leaf.addEventListener('expand', listener);
      assert_true(btn.classList.contains('mdl-tree__item--collapsed'));

      btn.dispatchEvent(new MouseEvent('click'));
    }, "Expand action launches onExpand");

    async_test((t) => {
      var leaf = tree.leaf[0];

      var listener = t.step_func((e) => {
        leaf.removeEventListener('addleaf', listener);
        assert_equals(e.detail.leaf, leaf.leaf[2]);
        t.done();
      });
      leaf.addEventListener('addleaf', listener);

      leaf.appendLeaf();
    }, "appendLeaf() launches onAddleaf");

    async_test((t) => {
      var leaf = tree.leaf[0].leaf[2];

      var listener = t.step_func((e) => {
        leaf.removeEventListener('changetext', listener);
        assert_equals(input.value, "This is a text");
        t.done();
      });
      leaf.addEventListener('changetext', listener);
      var input = leaf.querySelector('.mdl-textfield__input');

      input.value = "This is a text";
      input.dispatchEvent(new Event('change'));
    }, "Change text action launches onchangetext");

    async_test((t) => {
      var leaf = tree.leafs[0];

      var leafLength = leaf.leaf.length;
      var leafLast = leaf.leaf[leafLength - 1];
      var btnRemove = leafLast.querySelector('.mdl-tree__contextmenu--remove-leaf');

      var removeLeaf = t.step_func((e) => {
        btnRemove.removeEventListener('click', removeLeaf);
        assert_equals(leaf.leafs.length, leafLength - 1);
        t.done();
      });

      btnRemove.addEventListener('click', removeLeaf);
      btnRemove.dispatchEvent(new MouseEvent('click'));
    }, "Remove a subitem by clicking on '- remove'");

    async_test((t) => {
      var leaf = tree.leaf[0];

      var leafLength = leaf.leaf.length;
      var lastLeaf = leaf.leaf[leafLength - 1];

      var listener = t.step_func((e) => {
        leaf.removeEventListener('removeleaf', listener);
        assert_equals(lastLeaf, e.detail.leaf);
        t.done();
      });
      leaf.addEventListener('removeleaf', listener);

      lastLeaf.querySelector('.mdl-tree__contextmenu--remove-leaf')
              .dispatchEvent(new MouseEvent('click'));
    }, "Remove a subitem launches onRemoveleaf");

    async_test((t) => {
      var leaf = tree.leaf[0].leaf[0];
      var btnRemove = leaf.querySelector('.mdl-tree__contextmenu--remove-leaf');

      var listener = t.step_func((e) => {
        btnRemove.removeEventListener('click', listener);
        var leaf = tree.leaf[0];

        var btn = leaf.querySelector('.mdl-tree__item-expand-collapse');
        assert_equals(leaf.leafs.length, 0);
        assert_false(btn instanceof HTMLElement);

        t.done();
      });

      btnRemove.addEventListener('click', listener);
      btnRemove.dispatchEvent(new MouseEvent('click'));
    }, "Remove last leaf will hide the expand/collapse button");

    async_test((t) => {
      var beforeAdding = tree.leafs.length;
      var leaf = tree.appendLeaf();
      var input = leaf.querySelector('input');
      input.addEventListener('blur', t.step_func((e) => {
        assert_equals(tree.leafs.length, beforeAdding);
        t.done();
      }));

      input.dispatchEvent(new FocusEvent('blur'));
    }, "Remove the leaf if it lost focus having no label");

  }, "Tree's function appendLeaf returns the <li> object-container");

  this.done();
}

async_test((mt) => {
  document.addEventListener('DOMContentLoaded',
                            mt.step_func((e) => {
    var tree = document.querySelector(".mdl-tree");
    mainTest.call(mt, tree, 1);

    async_test((t) => {
      var newTree = document.createElement('ul');
      newTree.classList.add('mdl-list');
      newTree.classList.add('mdl-tree');
      newTree.id = "second-tree";

      document.body.appendChild(newTree);
      t.step_timeout(() => {
        assert_true(newTree.dataset.hasOwnProperty('upgraded'));
        assert_true(newTree.dataset.upgraded.indexOf(',Tree3') >= 0);
        mainTest.call(mt, newTree, 7);

        test(() => {
          var contextmenu = newTree.querySelector('.mdl-menu');
          var act1 = contextmenu.querySelector('.mdl-tree__contextmenu--action1');
          var act2 = contextmenu.querySelector('.mdl-tree__contextmenu--action2');

          assert_true(act1 instanceof HTMLElement);
          assert_true(act2 instanceof HTMLElement);
        }, "Contextmenu is upgraded with new content from a template");

        async_test((t) => {
          var act1 = newTree.querySelector('.mdl-tree__contextmenu--action1');

          var listener = (e) => {
            newTree.removeEventListener('action1', listener);
            t.done();
          };
          newTree.addEventListener('action1', listener);

          act1.dispatchEvent(new MouseEvent('click'));
        }, "Custom 'action1' event is dispatched");

        async_test((t) => {
          var act2 = newTree.querySelector('.mdl-tree__contextmenu--action2');

          var listener = (e) => {
            newTree.removeEventListener('action2', listener);
            t.done();
          };
          newTree.addEventListener('action2', listener);

          act2.dispatchEvent(new MouseEvent('click'));
        }, "Custom 'action2' event is dispatched");

        // cover the expand/collapse actions via class
        var leaf = newTree.leaf[0];
        var newLeaf = leaf.appendLeaf();
        newLeaf.querySelector('input').value = 'something';
        newLeaf.querySelector('input').dispatchEvent(new FocusEvent('blur'));

        var btn = leaf.querySelector('.mdl-tree__item-expand-collapse');

        async_test((t) => {
          btn.classList.remove('mdl-tree__item--expanded');

          t.step_timeout(() => {
            assert_true(btn.hidden);

            async_test((t1) => {
              btn.classList.add('mdl-tree__item--collapsed');

              t1.step_timeout(() => {
                assert_true(newLeaf.closest('.mdl-tree').hidden);
                assert_false(btn.hidden);
                btn.classList.remove('mdl-tree__item--collapsed');

                async_test((t2) => {
                  btn.classList.add('mdl-tree__item--expanded');

                  t2.step_timeout(() => {
                    assert_false(newLeaf.closest('.mdl-tree').hidden);
                    assert_false(btn.hidden);
                    t2.done();
                    t1.done();
                    t.done();

                  }, 0);
                }, "Show the expanded button if add --expanded");

              }, 0);
            }, "Show the collapsed button if add --collapsed");

          }, 0);
        }, "Hide the expand/collapse button if remove --expanded");

        t.done();
      }, 0);

    }, "Tree is updated by MutationObserver");

  }));
}, "DOMContentLoaded");
