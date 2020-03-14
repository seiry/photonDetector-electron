const electron = require('electron')
let _electron = electron
if (typeof electron.remote !== 'undefined') {
  _electron = electron.remote
}
const { app } = _electron
const os = require('os')
const path = require('path')
export const exePath = app.getPath('exe')

export let dllPrefix = ''
if (os.arch() === 'ia32') {
  dllPrefix = 'x86/'
} else if (os.arch() === 'x64') {
  dllPrefix = 'x64/'
} else {
  dllPrefix = 'error'
}
let libPath = ''
if (process.env.NODE_ENV === 'development') {
  libPath = path.resolve(__dirname, '../lib')
} else {
  libPath = path.join(exePath, '../lib')
}

export const dllPath = (e = 'dmc1380.dll') => {
  return path.join(libPath, dllPrefix, e)
}
