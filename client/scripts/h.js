const Nes = require('nes')

var client = new Nes.Client('ws://localhost:3000')

const nunjucks = require('nunjucks')


const start = async () => {
  await client.connect()
  // const payload = await client.request('hello')// Can also request '/h'
  // alert(payload.payload)
  // payload -> 'world!'
  client.onUpdate = (update) => {
    // set time into html
    // document.getElementById('update-time').innerHTML = update.updateTime
    var html = nunjucks.render('table.html', update)
    document.getElementById('data-table').innerHTML = html
    // here render a new table from nunjucks template
  }
}

start()
