const ffi = require('ffi-napi')

/**
 * 先定义一个函数, 用来在窗口中显示字符
 * @param {String} text
 * @return {*} none
 */
export function showText(text) {
  return Buffer.from(text, 'ucs2').toString('binary')
}
// 通过ffi加载user32.dll
export const myUser32 = new ffi.Library('user32', {
  // 声明这个dll中的一个函数
  MessageBoxW: [
    'int32',
    ['int32', 'string', 'string', 'int32'] // 用json的格式罗列其返回类型和参数类型
  ]
})

// 调用user32.dll中的MessageBoxW()函数, 弹出一个对话框
// const isOk = myUser32.MessageBoxW(
//   0, showText('I am Node.JS'), showText('Hello, World!~'), 2
// )
