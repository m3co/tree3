'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var r = new Range();
  var button = '\n<!-- Right aligned menu below button -->\n<button class="mdl-button mdl-js-button mdl-button--icon">\n  <i class="material-icons">more_vert</i>\n</button>\n\n<ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect">\n  <li class="mdl-menu__item">Some Action</li>\n  <li class="mdl-menu__item">Another Action</li>\n  <li disabled class="mdl-menu__item">Disabled Action</li>\n  <li class="mdl-menu__item">Yet Another Action</li>\n</ul>\n  ';

  var MaterialTree3 = function () {
    function MaterialTree3(element) {
      _classCallCheck(this, MaterialTree3);

      this.element_ = element;
      this.init();
    }

    _createClass(MaterialTree3, [{
      key: 'init',
      value: function init() {
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
    }]);

    return MaterialTree3;
  }();

  window['MaterialTree3'] = MaterialTree3;

  componentHandler.register({
    constructor: MaterialTree3,
    classAsString: 'MaterialTree3',
    cssClass: 'mdl-tree',
    widget: true
  });
})();