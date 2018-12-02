var moment = require('moment')
var Hangup = artifacts.require('./Hangup.sol')

var postIpfsHash_A = 'QmfFTftHqmfhjhwBYtKQRPLnHmai8GXZnx3J79BD3bNjds'
var postIpfsHash_B = 'QmUwE6JghehYgbUig4Q9VJ81wAaGhky3ESsQgFXcCyDSRm'

function getLastEvent(instance) {
  return new Promise((resolve, reject) => {
    instance.allEvents()
    .watch((error, log) => {
      if (error) return reject(error)
      resolve(log)
    })
  })
}

contract('Hangup', function(accounts) {
  it('should create a Hangup', async function() {
    var organizer = accounts[0]

    try {
      var instance = await Hangup.deployed()

      await instance.createHangup(postIpfsHash_A)

      var eventObj = await getLastEvent(instance)
      assert.equal(eventObj.event, '_HangupCreated')

      var [id, org, HangupHash] = await instance.getHangup(1)
      assert.equal(org, organizer)
      assert.equal(HangupHash, postIpfsHash_A)
      assert.equal(id, 1)
    } catch(error) {
      console.error(error)
      assert.equal(error, undefined)
    }
  })

  it('should be able to edit a Hangup', async function() {
    var organizer = accounts[0]

    try {
      var instance = await Hangup.deployed()

      var id = 1
      var [id_2, org_2, HangupHash_2] = await instance.getHangup(id)
      assert.equal(id_2, id)
      assert.equal(org_2, organizer)
      assert.equal(HangupHash_2, postIpfsHash_A)

      await instance.editHangup(id, postIpfsHash_B)

      var eventObj = await getLastEvent(instance)
      assert.equal(eventObj.event, '_HangupUpdated')

      var [id_3, org_3, HangupHash_3] = await instance.getHangup(id)
      assert.equal(id_3, id)
      assert.equal(org_3, organizer)
      assert.equal(HangupHash_3, postIpfsHash_B)

    } catch(error) {
      console.error(error)
      assert.equal(error, undefined)
    }
  })
})
