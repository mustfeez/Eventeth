const React = require('react')
const ReactDOM = require('react-dom')

const {
  Link
} = require('react-router-dom')

class App extends React.Component {
  render() {
    return (
      <div className="ui grid stackable row TopMenu">
        <div className="column sixteen wide">
          <div className="top ui menu TopMenuFirst">
            <Link to="/" className="item logo">
              eth<strong>.social</strong>
            </Link>
            <Link to="/Hangups" className="item">
              <i className="icon calendar"></i> All Hangups
            </Link>
            <Link to="/Hangup/new" className="item">
              <i className="icon plus circle"></i> Post New Hangup
            </Link>
            <div className="item">
              Network: <strong>Rinkeby Testnet</strong>
            </div>
            <div className="right menu">
              <Link to="/about" className="item">
                <i className="icon bookmark"></i> About
              </Link>
              <Link to="/help" className="item">
                <i className="icon help circle outline"></i> Help & Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = App