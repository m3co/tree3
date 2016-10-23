'use strict';
(() => {
    var tmpl = document.querySelector('template#li-row');
    var ul = document.querySelector('ul');
    var i, j = 0;
    for (i = 0; i < 6; i++) {
      addRow('mdl-menu--bottom-left', ul);
    }

    function addRow(direction, ul) {
      var i = j++;
      var clone = document.importNode(tmpl.content, true);
      clone.querySelector('#text').textContent += i + 1;
      clone.querySelector('#tree-menu-').id += i + 1;
      var threedots = clone.querySelector('[for="tree-menu-"]');
      threedots.setAttribute('for', `tree-menu-${i + 1}`);
      threedots.classList.add(direction);
      threedots.querySelector('li#add-subitem > span').textContent += i + 1;
      threedots.querySelector('li#add-subitem').addEventListener('click', e => {

        var li = e.target.closest('li:not(#add-subitem)');
        li.appendChild(document.importNode(document.querySelector('#tree-subitem').content, true));
        var ul = li.querySelector('ul.mdl-list');
        addRow('mdl-menu--bottom-left', ul);
        window.componentHandler.upgradeDom();

        ul.querySelector('.mdl-list__item-secondary-action').addEventListener('click', function(e) {
          expand(e);
        });
      });

      ul.appendChild(clone);
    }

    var example = document.querySelector('#tree-menu-2').closest('li');
    console.log(example);

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

