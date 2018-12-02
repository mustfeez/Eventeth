const React = require('react')
const ReactDOM = require('react-dom')

class About extends React.Component {
  render() {
    return (
      <div className="ui grid stackable padded">
        <div className="column sixteen wide">
          <h2 className="ui huge header">
            About
          </h2>
          <div className="ui divider"></div>
        </div>
        <div className="row">
          <div className="column ten wide">
            <p>
              eventeth is a place for posting social events and Hangups,
              in a completely decentralized way; it's built on top of the <a href="https://www.ethereum.org/" target="_blank">Ethereum</a> blockchain and <a href="https://ipfs.io/" target="_blank">IPFS</a>.
            </p>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = About
