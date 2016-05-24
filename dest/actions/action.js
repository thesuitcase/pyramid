'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _renderengine = require('../renderengine');

var _renderengine2 = _interopRequireDefault(_renderengine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Action = (function () {
  function Action() {
    _classCallCheck(this, Action);

    this.state = {};

    if (this.initialState) {
      this.state = this.initialState();
    }
  }

  _createClass(Action, [{
    key: 'setState',
    value: function setState(data) {
      Object.assign(this.state, data);
      _renderengine2.default.render(this);
    }
  }]);

  return Action;
})();

exports.default = Action;