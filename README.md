# babel-plugin-auto-import-jweboy

babel模块化导入插件，实现了按需加载的功能来满足常规业务需求。

##  Useage

```js
npm install babel-plugin-auto-import-jweboy --save-dev

yarn add babel-plugin-auto-import-jweboy --dev
```

在.babelrc增加配置

```js
{
    "plugins": ["auto-import-jweboy", options]
}
```

### Options

options是一个对象类型

模块化导入js
```js
{
    "libraryName": "test-ui"
}
```

模块化按需导入js、css
```js
{
    "libraryName": "test-ui",
    "style": true
}
```

## Example

```js
{ "libraryName": "test-ui" }
```

```js
Before compiling:
import { Button } from 'test-ui'

After compilation:
var _Button = _interopRequireDefault(require("test-ui/lib/Button"));
```

```js
{ "libraryName": "test-ui", "style": true }
```

```js
Before compiling:
import { Button } from 'test-ui'

After compilation:
require("test-ui/lib/Button/style");
var _Button = _interopRequireDefault(require("test-ui/lib/Button"));
```