# daopy-runtime
在岛三上运行Python，并支持访问Dao3 API

## 说明
> 本项目还未进一步测试，不要用于生产

## 安装

打开`dao3`编辑端，创建两个代码文件：`daopy.js`和`daopy_modules.js`

这两个文件的内容在`dist/`目录下，在那里复制并粘贴进编辑器。
> `dist/daopy.js` 有`800KB左右`，岛三编辑器一次性粘贴这么多字符有可能会未响应，可以多试几次，粘贴完就别动它了

## 运行
dao3编辑端
`index.js`
```javascript
const daopy = require("./daopy.js");
const daopy_modules = require("./daopy_modules.js");
function pyrun(code){
    daopy.run(code, daopy.installReadFn(daopy.builtinRead,daopy_modules));
}

// pyrun(python的代码)

// demo
pyrun(`from dao3 import *
world.say("hello world")
def onPlayerJoin(dat):
    world.say(f"{dat.entity.player.name} 进入了游戏！！")
world.onPlayerJoin(onPlayerJoin)    
`)
```

`print()` 会输出到控制台

## dao3 API
实现于`dao3`库
```python
from dao3 import *
```
### 岛三原版绑定
基本就是个`proxy`，代理绑定JS环境中的一切API。

### utils
- dao3.utils.js.eval(code)

    使用js运行代码，并返回python结果。但这个在client中不知道有无作用。

## 示例
1. 与实体交互
```python
from dao3 import *
le=world.querySelector("#排行榜-1");
le.enableInteract=True
le.interactRadius=6
le.interactHint="排行榜"
def leOninteract(d):
    d.entity.player.dialog({
        "title":"排行榜",
        "content":"排行榜如下：",
        "options":["1. Tobylai"],
        "type":"select"
    })
le.onInteract(leOninteract)
```



