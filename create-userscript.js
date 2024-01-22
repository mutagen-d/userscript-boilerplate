const fs = require('fs')
const path = require('path')
const package = require('./package.json')
const config = require('./config')

const BUILD_DIR = 'dist'

const getMetadata = () => {
  return {
    '@name': config.name.default,
    '@name:en': config.name.en,
    '@namespace': config.namespace,
    '@version': package.version,
    '@description': config.description.default,
    '@description:en': config.description.en,
    '@author': package.author,
    '@match': config.match,
    '@connect': config.connect,
    '@grant': config.grant,
    '@require': config.require,
    '@run-at': config['run-at'],
    '@allFrames': config.allFrames,
  }
}
const metadataToString = () => {
  const data = getMetadata()
  const keyValue = (key, value) => `// ${key.padEnd(16, ' ')} ${value}`
  return [
    '// ==UserScript==',
    ...Object.keys(data).reduce((acc, key) => {
      if (Array.isArray(data[key])) {
        const values = data[key].map((value) => keyValue(key, value))
        acc.push(...values)
      } else {
        acc.push(keyValue(key, data[key]))
      }
      return acc
    }, []),
    '// ==/UserScript==',
  ].join('\n')
}

const bundleJs = fs.readFileSync(process.argv[2], 'utf8')
const userScriptMeta = metadataToString()
fs.writeFileSync(path.join(__dirname, BUILD_DIR, 'script.meta.js'), userScriptMeta)

const changeLog = fs.existsSync('changelog.js') ? fs.readFileSync('changelog.js', 'utf-8') : ''

let style = ''
if (fs.existsSync(`${BUILD_DIR}/styles.css`)) {
  style = fs.readFileSync(`${BUILD_DIR}/styles.css`, 'utf8')
}

const userScript = `${userScriptMeta}

${changeLog}

;(function(window ) {
  const exports = {};
  ${bundleJs.replace(/\/\*{3,}\//g, '')}
})(window);

;(function () {
  const style = \`${style}\`;
  var _addStyle = function (textCss) {
    if (typeof GM !== 'undefined' && typeof GM.addStyle !== 'undefined') {
      return GM.addStyle(textCss)
    }
    var el = document.createElement('style')
    el.setAttribute('type', 'text/css')
    el.innerHTML = textCss
    return document.head.appendChild(el)
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      _addStyle(style)
    })
  } else {
    _addStyle(style)
  }
})();
`

const filepath = path.join(__dirname, BUILD_DIR, 'script.user.js')
fs.writeFileSync(filepath, userScript)
