const React = require('react')
const ReactDOM = require('react-dom')

const {
  HashRouter: Router,
  Route,
  Link
} = require('react-router-dom')

const NewHangup = require('./NewHangup.js')
const EditHangup = require('./EditHangup.js')
const Hangups = require('./Hangups.js')
const Hangup = require('./Hangup.js')
const TopMenu = require('./TopMenu.js')
const About = require('./About.js')
const Help = require('./Help.js')
const Footer = require('./Footer.js')

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
        <TopMenu />
        <div className="ui grid stackable padded MainContentContainer">
          <Route exact path="/" component={Hangups}/>
          <Route exact path="/Hangups" component={Hangups}/>
          <Route exact path="/Hangup/new" component={NewHangup}/>
          <Route exact path="/Hangups/:id([0-9]+)/edit" component={EditHangup}/>
          <Route exact path="/Hangups/:id([0-9]+)" component={Hangup}/>
          <Route exact path="/about" component={About}/>
          <Route exact path="/help" component={Help}/>
        </div>
        <Footer />
        </div>
      </Router>
    )
  }
}

module.exports = App
