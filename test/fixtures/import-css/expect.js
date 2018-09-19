"use strict";

require("test-ui/lib/Table/style");

require("test-ui/lib/Button/style");

require("test-ui/lib/message/style");

var _Button = _interopRequireDefault(require("test-ui/lib/Button"));

var _Table = _interopRequireDefault(require("test-ui/lib/Table"));

var _message = _interopRequireDefault(require("test-ui/lib/message"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _message.default)('xxx');
ReactDOM.render(React.createElement("div", null, React.createElement(_Button.default, null, "xxxx"), React.createElement(_Table.default, {
  dataSource: []
})));