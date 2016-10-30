'use strict';
(() => {
    var tmpl = document.querySelector('template#mdl-tree__item');
    var contextmenuTmpl = document.querySelector('template#mdl-tree__contextmenu');
    var expandcollapseTmpl = document.querySelector('template#mdl-tree__item--expand-collapse');
    var ul = document.querySelector('ul');
    var i, j = 0;
    for (i = 0; i < 5; i++) {
      addRow('mdl-menu--bottom-left', ul);
    }

    function addSubItem(li) {
      var ul = li.querySelector('ul.mdl-list');
      if (!ul) {
        li.appendChild(document.importNode(document.querySelector('#tree-subitem').content, true));
        ul = li.querySelector('ul.mdl-list');
      }
      addRow('mdl-menu--bottom-left', ul);
      window.componentHandler.upgradeDom();

      ul.querySelector('.mdl-list__item-secondary-action').addEventListener('click', function(e) {
        expand(e);
      });
    }

    function addRow(direction, ul) {
      var i = j++;
      var clone = document.importNode(tmpl.content, true);
      clone.querySelector('#text').textContent += i + 1;

      var threeClone = document.importNode(contextmenuTmpl.content, true);
      var primaryContent = clone.querySelector('.mdl-list__item-primary-content');
      primaryContent.insertBefore(threeClone, primaryContent.firstChild);

      clone.querySelector('#mdl-tree__contextmenu-').id += i + 1;
      var threedots = clone.querySelector('[for="mdl-tree__contextmenu-"]');
      threedots.setAttribute('for', `mdl-tree__contextmenu-${i + 1}`);
      threedots.classList.add(direction);
      threedots.querySelector('li.mdl-tree__contextmenu--add-leaf > span').textContent += i + 1;
      threedots.querySelector('li.mdl-tree__contextmenu--add-leaf').addEventListener('click', e => {
        var li = e.target.closest('li:not(.mdl-tree__contextmenu--add-leaf)');
        addSubItem(li);
      });

      var expandcollapseClone = document.importNode(expandcollapseTmpl.content, true);
      clone.querySelector('li').appendChild(expandcollapseClone);

      ul.appendChild(clone);
    }

    var example = document.querySelector('#mdl-tree__contextmenu-2').closest('li');
    addSubItem(example);
    addSubItem(example);
    addSubItem(example);
    example.querySelector('.mdl-list__item-secondary-action i').innerHTML = 'keyboard_arrow_down';

    var elements = document.querySelectorAll('.mdl-list__item-secondary-action');

    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', function(e) {
        expand(e);
      });
    }

    function expand(e) {
      var parent = e.currentTarget.parentNode;
      var nestedList = parent.querySelector("ul:not(.mdl-menu)");
      var icon = e.currentTarget.querySelector('i.material-icons');

      if (nestedList) {
        if (nestedList.classList.contains('hidden')) {
          nestedList.classList.remove('hidden');
          icon.innerHTML = 'keyboard_arrow_down';
        } else {
          nestedList.classList.add('hidden');
          icon.innerHTML = 'keyboard_arrow_up';
        }
      }

    };
})();

