# pet-test

> An electron-vue project


### install

因为使用了`node-ffi-napi`，所以在Windows上，需要vs toolchain全家桶。

以vs2019为例，需要`c++ toolsets`, `windows sdk`，要不`gyp`跑不起来

安装完成后需要`rebuild`

```bash
npm run rebuild
```

#### Build Setup

``` bash
# install dependencies
npm install

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

