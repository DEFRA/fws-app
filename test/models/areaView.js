'use strict'

const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()
const AreaView = require('../../server/models/area-view')

lab.experiment('AreaView model test', () => {
  lab.test('Check AreaView model exists', () => {
    Code.expect(AreaView).to.be.a.function()
    Code.expect(AreaView.prototype).to.be.a.object()
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

    const area = new AreaView(fakeWarningData)

    Code.expect(area.getAreaView).to.be.a.function()
    Code.expect(area.getAreaView()).to.be.a.object()
  })

  lab.test('2 - Check new with no warning data', () => {
    const fakeWarningData = {}

    try {
      const area = new AreaView(fakeWarningData)
      Code.expect(area).to.be.an.object()
    } catch (err) {
      Code.expect(err).to.be.an.error(Error)
      Code.expect(err).to.be.an.error('No warning data provided.')
    }
  })

  lab.test('3 - Check new with partial data', () => {
    const fakeWarningData = {
      warnings: [
        {
          situation: ' Flood Alert ',
          attr: {
          // taId: 5765,
          // taCode: '013WATDEE',
          // taName: 'Dee Estuary from Parkgate to Chester',
          // taDescription: 'Areas at risk include Parkgate, Neston and Puddington, continuing to Blacon and Saltney, Chester',
          // quickDial: '205002',
          // version: '1',
          // state: 'A',
          // taCategory: 'Flood Alert',
          // ownerArea: 'Greater Manchester, Merseyside and Cheshire',
          // createdDate: '2019-02-12T13:31:51.631Z',
          // lastModifiedDate: '2019-02-12T13:31:51.631Z',
          // situationChanged: '2019-04-24T10:31:00.000Z',
          // severityChanged: '2019-04-24T10:31:00.000Z',
          // timeMessageReceived: '2019-04-24T14:25:11.532Z',
          // severityValue: '2',
          // severity: 'Flood Warning'
          }
        }
      ]
    }

    try {
      const area = new AreaView(fakeWarningData)
      Code.expect(area).to.be.an.object()
    } catch (err) {
      Code.expect(err).to.be.an.error(Error)
      Code.expect(err).to.be.an.error('No warning data provided.')
    }
  })
  lab.test('4 - Check Error message with no data', () => {
    const fakeWarningData = {}

    try {
      const area = new AreaView(fakeWarningData)
      Code.expect(area).to.be.an.object()
    } catch (err) {
      Code.expect(err).to.be.an.error(Error)
      Code.expect(err).to.be.an.error('No warning data provided.')
    }
  })
})
