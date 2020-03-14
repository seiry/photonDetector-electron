const os = require('os')

export let dllPrefix = ''
if (os.arch() === 'ia32') {
  dllPrefix = 'x86/'
} else if (os.arch === 'x64') {
  dllPrefix = 'x64/'
} else {
  // error
}
