'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _keyboard = require('./keyboard');

var _keyboard2 = _interopRequireDefault(_keyboard);

var _readline = require('./readline');

var _readline2 = _interopRequireDefault(_readline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Input = (function () {
  function Input() {
    _classCallCheck(this, Input);

    this._data = [];
    this._paused = false;
  }

  _createClass(Input, [{
    key: 'clear',
    value: function clear() {
      this._data = [];
      _readline2.default.line = '';
      return this;
    }
  }, {
    key: 'pause',
    value: function pause() {
      this._paused = true;
      return this;
    }
  }, {
    key: 'resume',
    value: function resume() {
      this._paused = false;
      return this;
    }
  }, {
    key: 'pop',
    value: function pop() {
      return this._data.pop();
    }
  }, {
    key: 'string',
    get: function get() {
      return this._data.join('');
    }
  }, {
    key: 'array',
    get: function get() {
      return this._data;
    }
  }]);

  return Input;
})();

exports.default = Input;