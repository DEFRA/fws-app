(function async (window) {
  const Nes = require('nes')

  var client = new Nes.Client('ws://localhost:3000')

  const nunjucks = require('nunjucks')

  const start = async () => {
    await client.connect()
    client.onUpdate = (update) => {
      console.log('Received broadcast from server...')
      var html = nunjucks.render('table.html', update)
      document.getElementById('data-table').innerHTML = html
    }
  }

  start()
})(window)
