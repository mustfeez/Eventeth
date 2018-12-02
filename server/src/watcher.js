const Web3 = require('web3')
const pify = require('pify')

const {upsert} = require('./store')
const { getJson } = require('./ipfs')
const Hangup = require('../../build/contracts/Hangup.json')
const abi = Hangup.abi
const address = '0x790fe54b79400d23e9ea6f764a57330c083cf3c7'
const providerUri = 'wss://rinkeby.infura.io/ws'
const provider = new Web3.providers.WebsocketProvider(providerUri)
const web3 = new Web3(provider)
let instance = null

async function handleEvent (eventObj) {
  const {event:eventType, returnValues, transactionHash:txHash, blockNumber} = eventObj
  const id = returnValues[0]|0

  console.log(eventObj)

  if (eventType === '_HangupCreated' || eventType === '_HangupUpdated') {
  const data = await pify(instance.methods.getHangup(id).call)()
  let organizer = data[1]
  let ipfsHash = data[2]

    let {
        title,
        description,
        location,
        tags,
        image,
        start,
        end,
        created,
        updated,
        deleted,
    } = await getJson(ipfsHash)

    if (title && start) {
      upsert({
        txHash,
        blockNumber,
        id,
        ipfsHash,
        title,
        description,
        location,
        tags: tags.join(','),
        image,
        start,
        end,
        created,
        updated,
        organizer,
        deleted: deleted|0
      })
    }
  }
}

function handlePastEvent (eventObj) {
  return handleEvent(eventObj)
}

async function start () {
  instance = new web3.eth.Contract(abi, address)

  instance.getPastEvents('allEvents',
    {fromBlock:0, toBlock: 'latest'},
    (error, logs) => {
      logs.forEach(handlePastEvent)
  })

  instance.events.allEvents((error, log) => {
    if (error) {
      console.error(error)
    }

    if (log) {
      handleEvent(log)
    }
  })

  console.log('listening for events')
}

module.exports = { start }
