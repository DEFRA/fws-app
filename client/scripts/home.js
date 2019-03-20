(function async (window) {
  const Nes = require('nes')

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
    await client.connect()
    client.subscribe('/summary', (update, flags) => {
      console.log('Received broadcast from server...')
      var html = nunjucks.render('table.html', update)
      document.getElementById('data-table').innerHTML = html
    })
  }

  start()
})(window)
