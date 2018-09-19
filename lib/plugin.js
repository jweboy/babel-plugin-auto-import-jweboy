"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = _interopRequireDefault(require("@babel/types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// const exampleCode = `import { Button, Modal, Table, Badge } from 'jl-ui'`
var Plugin =
/*#__PURE__*/
function () {
  function Plugin() {
    _classCallCheck(this, Plugin);
  }

  _createClass(Plugin, [{
    key: "ImportDeclaration",
    value: function ImportDeclaration(path, _ref) {
      var opts = _ref.opts;
      var node = path.node; // path可能被移除

      if (!node) return;
      var specifiers = node.specifiers,
          source = node.source;
      console.log(opts, source);

      if (opts.libraryName === source.value && !_types.default.isImportDefaultSpecifier(specifiers[0])) {
        var declarations = specifiers.map(function (specifier, index) {
          // 创建ImportDeclaration节点
          return _types.default.ImportDeclaration([_types.default.importDefaultSpecifier(specifier.local)], _types.default.stringLiteral("".concat(source.value, "/lib/").concat(specifier.local.name)));
        });
        path.replaceWithMultiple(declarations);
      }
    }
  }]);

  return Plugin;
}(); // const result = babel.transform(exampleCode, {
//     plugins: [{ visitor }]
// })
// console.log(result.code);
// module.exports = function() {
//     return { visitor }
// }


exports.default = Plugin;