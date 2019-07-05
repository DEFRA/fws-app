import '@babel/polyfill'
(function async (window) {
  const Nes = require('nes/client')
  const { polyfill } = require('es6-promise')
  polyfill()

  // const Fwis = require('../../server/models/fwis')
  // const AreaView = require('../../server/models/area-view')

  var location = window.location
  var wsUri
  if (location.protocol === 'https:') {
    wsUri = 'wss://' + location.host
  } else {
    wsUri = 'ws://' + location.host
  }

  var client = new Nes.Client(wsUri)

  const nunjucks = require('nunjucks/browser/nunjucks-slim')
  nunjucks.PrecompiledLoader.prototype.isRelative = function () {}

  const start = async () => {
    const timestart = new Date().getTime()
    await client.connect()
    const timeconnect = new Date().getTime()
    const diff = timeconnect - timestart
    console.log(`Seconds to connect: ${diff / 1000}`)
    console.log('Socket connected...')
    client.subscribe('/summary', (update, flags) => {
      console.log('Received broadcast from server...')
      // const fwis = new Fwis(update.warnings)

      var summaryHtml = nunjucks.render('summary.html', {
        summaryTable: update.summaryTable
      })
      document.getElementById('summary-table').innerHTML = summaryHtml
      // var html = nunjucks.render('table.html', {
      //   params: fwis.getSummaryTable(),
      //   updateTime: update.updateTime
      // })
      // document.getElementById('data-table').innerHTML = html
      // var summaryHtml = nunjucks.render('summary.html', {
      //   params: fwis.getSummaryTable(),
      //   updateTime: update.updateTime
      // })
      // document.getElementById('summary-table').innerHTML = summaryHtml

      // const areaView = new AreaView(update.warnings)
      var areaViewHtml = nunjucks.render('area.html', {
        areaView: update.areaView
      })
      document.getElementById('area-view-table').innerHTML = areaViewHtml
      // // document.getElementById('updated-time').innerHTML = update.updateTime
      document.getElementById('updated-time').innerHTML = update.updateTimePretty
    })
  }

  start()

  // var env = new nunjucks.Environment(new MyLoader(window.nunjucksPrecompiled))
  // nunjucks.configure('/views', { autoescape: true })
  // var egg = nunjucks.render('client/templates/summary.html', { username: 'bar' })
  // var egg = nunjucks.render('tables.html', { username: 'bar' })
})(window)
