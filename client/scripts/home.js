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

  // callback method
  // const start = () => {
  //   client.connect().then(() => {
  //     console.log('Socket connected...')
  //     client.subscribe('/summary', (update, flags) => {
  //       console.log('Received broadcast from server...')
  //       var html = nunjucks.render('table.html', update)
  //       document.getElementById('data-table').innerHTML = html
  //     })
  //   })
  // }
  // async function
  const start = async () => {
    await client.connect()
    console.log('Socket connected...')
    client.subscribe('/summary', (update, flags) => {
      console.log('Received broadcast from server...')
      var html = nunjucks.render('table.html', update)
      document.getElementById('data-table').innerHTML = html
    })
  }

  start()
})(window)
