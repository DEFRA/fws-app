'use strict'

const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const Fwis = require('../../server/models/fwis')

lab.experiment('Fwis model test', () => {
  lab.test('Check Fwis model exists', () => {
    Code.expect(Fwis).to.be.a.function()
    Code.expect(Fwis.prototype).to.be.a.object()
  })
  lab.test('1 - Check new', () => {
    const fakeWarningData = {
      warnings: [
        {
          situation: ' Flood Alert ',
          attr: {
            taId: 5765,
            taCode: '013WATDEE',
            taName: 'Dee Estuary from Parkgate to Chester',
            taDescription: 'Areas at risk include Parkgate, Neston and Puddington, continuing to Blacon and Saltney, Chester',
            quickDial: '205002',
            version: '1',
            state: 'A',
            taCategory: 'Flood Alert',
            ownerArea: 'Greater Manchester, Merseyside and Cheshire',
            createdDate: '2019-02-12T13:31:51.631Z',
            lastModifiedDate: '2019-02-12T13:31:51.631Z',
            situationChanged: '2019-04-24T10:31:00.000Z',
            severityChanged: '2019-04-24T10:31:00.000Z',
            timeMessageReceived: '2019-04-24T14:25:11.532Z',
            severityValue: '2',
            severity: 'Flood Warning'
          }
        }
      ]
    }

    const area = new Fwis(fakeWarningData)

    Code.expect(area.getSummaryTable).to.be.a.function()
    Code.expect(area.getSummaryTable()).to.be.a.object()
  })
  lab.test('2 - Check new with no warning data', () => {
    const fakeWarningData = {}

    try {
      const fwis = new Fwis(fakeWarningData)
      Code.expect(fwis).to.be.an.object()
    } catch (err) {
      Code.expect(err).to.be.an.error(Error)
      Code.expect(err).to.be.an.error('No warning data provided.')
    }
  })
})
