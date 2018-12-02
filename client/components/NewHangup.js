const React = require('react')
const ReactDOM = require('react-dom')
const moment = require('moment')

const {getInstance} = require('../services/contract')
const EditHangup = require('./EditHangup.js')

function handleError(error) {
  console.error(error)
}

function NewHangup(props) {
  const {match} = props

  return (
    <EditHangup isNew={true} match={match} />
  )
}

module.exports = NewHangup
