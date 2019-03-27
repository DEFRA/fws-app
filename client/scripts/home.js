import '@babel/polyfill'
(function async (window) {
  const Nes = require('nes/client')
  const { polyfill } = require('es6-promise')
  polyfill()

  var location = window.location
  var wsUri
  if (location.protocol === 'https:') {
    wsUri = 'wss://' + location.host
  } else {
    wsUri = 'ws://' + location.host
  }

  var client = new Nes.Client(wsUri)

  const nunjucks = require('nunjucks')

  const start = async () => {
    const timestart = new Date().getTime()
    await client.connect()
    const timeconnect = new Date().getTime()
    const diff = timeconnect - timestart
    console.log(`Seconds to connect: ${diff / 1000}`)
    console.log('Socket connected...')
    client.subscribe('/summary', (update, flags) => {
      console.log('Received broadcast from server...')
      var html = nunjucks.render('table.html', update)
      document.getElementById('data-table').innerHTML = html
    })
  }

  start()
})(window)
