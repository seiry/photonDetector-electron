# pet-test

> An electron-vue project


### install

因为使用了`node-ffi-napi`，所以在Windows上，需要vs toolchain全家桶。

最低的兼容版本为vs2015，已在vs2015和vs2019社区版中进行了编译测试。

以vs2019为例，需要`c++ toolsets`, `windows sdk`，否则`gyp`会跑不起来

`windows sdk`最低需要`Windows 8.1`版本。即使是`Windows 7`，同样可以安装该依赖


安装完成后需要`rebuild`

```bash
npm run rebuild
```

#### Build Setup

`nodejs` 需求版本为 `V10.x` 或 `V12.x`，

``` bash
# install dependencies
npm install

npm run rebuild

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

