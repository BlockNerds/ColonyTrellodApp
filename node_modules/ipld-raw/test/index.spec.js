'use strict'
/* eslint-env mocha */
const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const ipldRaw = require('../src/index')
const resolver = ipldRaw.resolver

describe('raw codec', () => {
  let testData = Buffer.from('test data')
  let testBlob

  before((done) => {
    ipldRaw.util.serialize(testData, (err, result) => {
      expect(err).to.not.exist()
      testBlob = result
      done()
    })
  })

  it('multicodec is raw', () => {
    expect(resolver.multicodec).to.equal('raw')
  })

  it('resolver.resolve', () => {
    resolver.resolve(testBlob, 'a/b/c/d', (err, result) => {
      expect(err).to.not.exist()
      expect(result.value.toString('hex')).to.equal(testData.toString('hex'))
      expect(result.remainderPath).to.equal('')
    })
  })

  it('resolver.tree', () => {
    resolver.tree(testBlob, {}, (err, paths) => {
      expect(err).to.not.exist()
      expect(Array.isArray(paths)).to.eql(true)
      expect(paths.length).to.eql(0)
    })
  })
})
