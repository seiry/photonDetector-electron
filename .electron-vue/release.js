const builder = require('electron-builder')
const os = require('os')
const pkg = require('../package.json')
const outputFileSync = require('fs-extra').outputFileSync
const path = require('path')
const fs = require('fs-extra')

const platform = os.platform()
const Platform = builder.Platform
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const END = '\x1b[0m'

let targets
const extraFiles = []
let packagejson = fs.readJsonSync(path.join(path.resolve(__dirname), '../package.json'))
packagejson.intVersion+=1
fs.writeJsonSync((path.join(path.resolve(__dirname), '../package.json')), packagejson, { spaces: '    ' })

function release () {
  let files = [
    'dist/electron/**/*',
    // '!src/lib/clash/config.yaml'
    // '!dist/electron/imgs/ionicons--fonts.svg',
    // '!dist/electron/fonts/ionicons--fonts.eot',
    // '!dist/electron/fonts/ionicons--fonts.ttf',
    // '!dist/electron/static/plane.svg',
    // '!node_modules/{babel-runtime,batch-processor,core-js,deepmerge,element-resize-detector,erguotou-iview,mousetrap,rxjs,popper.js,qr-image,vue*}${/*}',
    // '!node_modules/unbzip2-stream/dist${/*}',
    // 'node_modules/mousetrap/{mousetrap.js,package.json}',
    // '!**/*.{md,markdown,MD,txt}',
    // '!**/{test.js,license,LICENSE,.jscsrc}',
    // '!**/sample?(s)${/*}'
  ]
  const macImages = [
    '!dist/electron/static/enabled@(Template|Highlight)?(@2x).png',
    '!dist/electron/static/pac@(Template|Highlight)?(@2x).png',
    '!dist/electron/static/global@(Template|Highlight)?(@2x).png'
  ]
  const winImages = [
    '!dist/electron/static/enabled?(@2x).png',
    '!dist/electron/static/pac?(@2x).png',
    '!dist/electron/static/global?(@2x).png'
  ]
  switch (platform) {
    case 'darwin':
      targets = Platform.MAC.createTarget()
      extraFiles.push({ from: 'src/lib/proxy_conf_helper', to: './' })
      files = files.concat(winImages)
      break
    case 'win32':
      // outputFileSync(path.join(path.resolve(__dirname), '../src/lib/clash/config.yaml'), header)
      targets = Platform.WINDOWS.createTarget()
      extraFiles.push({ from: 'src/lib/', to: './lib/' })
      files = files.concat(macImages)
      break
    case 'linux':
      targets = Platform.LINUX.createTarget()
      files = files.concat(macImages)
  }
  return builder.build({
    targets: targets,
    config: {
      // "productName": "γ光子探测器控制系统",pkg
      "productName": pkg.titleName,
      "appId": "eu.seiry.2020.nuaa.pet",
      artifactName: '${productName}-${version}.${ext}',
      compression: 'maximum',
      "copyright": "Copyright © 2020 Seiry Yu",
      files,
      extraFiles: extraFiles,
      directories: {
        output: 'build'
      },
      // publish: {
      //   provider: 'github'
      // },
      dmg: {
        contents: [
          {
            x: 410,
            y: 150,
            type: 'link',
            path: '/Applications'
          },
          {
            x: 130,
            y: 150,
            type: 'file'
          }
        ]
      },
      mac: {
        icon: 'build/icons/icon.icns',
        category: 'public.app-category.developer-tools',
        target: [
          'zip',
          'dmg'
        ],
        extendInfo: {
          LSUIElement: 'YES'
        }
      },
      win: {
        icon: 'build/icons/icon.ico',
        requestedExecutionLevel: 'requireAdministrator',
        target: [
          {
            target: 'nsis',
            // arch: ['x64']
            arch: ['ia32']
            // arch: ['ia32', 'x64']
          }
        ]
      },
      nsis: {
        license: 'LICENSE',
        oneClick: false,
        perMachine: true,
        allowToChangeInstallationDirectory: true
      },
      linux: {
        icon: 'build/icons',
        category: 'Development',
        synopsis: pkg.description,
        target: [
          'deb',
          'rpm',
          'tar.gz',
          'pacman',
          'appImage'
        ],
        desktop: {
          Name: 'electron-ssr',
          Encoding: 'UTF-8',
          Type: 'Application',
          Comment: pkg.description,
          StartupWMClass: 'electron-ssr'
        }
      }
      // appImage: {
      //   license: 'LICENSE'
      // }
    }
  }).then(() => {
    console.log(`${BLUE}Done${END}`)
  }).catch(error => {
    console.error(`${YELLOW}Build error: ${error}${END}`)
  })
}

module.exports = release
