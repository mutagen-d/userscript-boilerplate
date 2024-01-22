module.exports = Object.freeze({
  namespace: 'mutagen-d',
  name: {
    default: 'Userscript boilerplate',
    en: 'Userscript boilerplate',
  },
  description: {
    default: 'Userscript boilerplate',
    en: 'Userscript boilerplate',
  },
  match: [
    '*://example.com/*',
  ],
  connect: [
    'example.com',
  ],
  grant: [
    'GM.xmlHttpRequest',
    'GM_xmlhttpRequest',
    'unsafeWindow',
    'GM_download',
    'GM_info',
    'GM_setValue',
    'GM_getValue',
    'GM_deleteValue',
    'GM_listValues',
    'GM_addValueChangeListener',
    'GM_notification',
    'GM.setValue',
    'GM.getValue',
    'GM.deleteValue',
    'GM.listValues',
    'GM.addValueChangeListener',
  ],
  require: [
    'https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js',
    'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
  ],
  'run-at': 'document-start',
  allFrames: 'true',
})
