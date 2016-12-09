(() => {
  'use strict';

  var r = new Range();
  var button = `
<!-- Right aligned menu below button -->
<button class="mdl-button mdl-js-button mdl-button--icon">
  <i class="material-icons">more_vert</i>
</button>

<ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect">
  <li class="mdl-menu__item">Some Action</li>
  <li class="mdl-menu__item">Another Action</li>
  <li disabled class="mdl-menu__item">Disabled Action</li>
  <li class="mdl-menu__item">Yet Another Action</li>
</ul>
  `;

  class MaterialTree3 {
    constructor(element) {
      this.element_ = element;
      this.init();
    }

    init() {
      if (this.element_) {
        this.element_.classList.add('mdl-list');
        var t = r.createContextualFragment(button);
        this.element_.querySelector('li').appendChild(t);
        var c = new MaterialMenu(this.element_.querySelector('.mdl-menu'));

        var forEl = this.element_.querySelector('li button');
        c.forElement_ = forEl;
        forEl.addEventListener('click', c.handleForClick_.bind(c));
        forEl.addEventListener('keydown', c.handleForKeyboardEvent_.bind(c));
      }
    }
  }
  window['MaterialTree3'] = MaterialTree3;

  componentHandler.register({
    constructor: MaterialTree3,
    classAsString: 'MaterialTree3',
    cssClass: 'mdl-tree',
    widget: true
  });

})();
