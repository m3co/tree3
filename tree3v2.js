'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  var range = new Range();
  var createHTML = range.createContextualFragment.bind(range);

  var classAsString = 'MaterialTree3';
  var cssClass = 'mdl-tree3';

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

          // Prevent upgradeDom to call init() twice
          this.element_.dataset.upgraded = ['', classAsString].join();
        }
      }
    }]);

    return MaterialTree3;
  }();

  window[classAsString] = MaterialTree3;

  componentHandler.register({
    constructor: MaterialTree3,
    classAsString: classAsString,
    cssClass: cssClass,
    widget: true
  });
})();