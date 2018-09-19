"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _path = _interopRequireDefault(require("path"));

var _helperModuleImports = require("@babel/helper-module-imports");

var _plugin = _interopRequireDefault(require("./plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function formatPath(path) {
  return path.replace(/\\/g, '/');
}

function _default(_ref) {
  var types = _ref.types;
  var libDir = 'lib';
  var specified = Object.create(null); // const program = {
  //     enter(path, { opts = {}}) {
  //         // console.log(path)
  //         // if (Array.isArray(opts)) {
  //         //     opts.map(({ libraryName }) =>{
  //         //         console.log(libraryName, 'libraryName should be provided')
  //         //         // asset(libraryName, 'libraryName should be provided')
  //         //         return new Plugin({
  //         //             libraryName
  //         //         })
  //         //     })
  //         // } else {
  //         //     new Plugin({
  //         //         libraryName: opts.libraryName
  //         //     })
  //         // }
  //     }
  // }

  function importMethod(name, file, _ref2) {
    var style = _ref2.style,
        libraryName = _ref2.libraryName;
    var path = formatPath(_path.default.join(libraryName, libDir, name));

    if (style === true) {
      (0, _helperModuleImports.addSideEffect)(file.path, "".concat(path, "/style"));
    }

    if (style === 'css') {
      (0, _helperModuleImports.addSideEffect)(file.path, "".concat(path, "/style/css"));
    }
  }

  var result = {
    visitor: {
      // program,
      ImportDeclaration: function ImportDeclaration(path, _ref3) {
        var opts = _ref3.opts;
        var node = path.node; // path可能被移除

        if (!node) return;
        var specifiers = node.specifiers,
            source = node.source;

        if (opts.libraryName === source.value && !types.isImportDefaultSpecifier(specifiers[0])) {
          var declarations = specifiers.map(function (specifier) {
            var local = specifier.local,
                imported = specifier.imported;
            specified[local.name] = imported.name; // 创建ImportDeclaration节点

            return types.ImportDeclaration([types.importDefaultSpecifier(specifier.local)], types.stringLiteral("".concat(source.value, "/lib/").concat(specifier.local.name)));
          });
          path.replaceWithMultiple(declarations);
        }
      },
      CallExpression: function CallExpression(path, _ref4) {
        var opts = _ref4.opts;
        var node = path.node;
        var file = path.hub && path.hub.file;
        if (!node) return;
        var args = node.arguments;
        var name = node.callee.name;

        if (types.isIdentifier(node.callee)) {
          if (!!specified[name]) {
            importMethod(name, file, opts);
          }
        }

        args.map(function (arg) {
          var name = arg.name;

          if (!!specified[name]) {
            importMethod(name, file, opts);
          }
        });
      }
    }
  };
  return result;
}