const Nes = require('nes')
const Nunjucks = require('nunjucks')

const { h, render, Component } = require('preact')

var client = new Nes.Client('ws://localhost:3000')

const start = async () => {
  await client.connect()
  const payload = await client.request('hello')// Can also request '/h'
  alert(payload.payload)
  // payload -> 'world!'
}

start()