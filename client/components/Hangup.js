const moment = require('moment')
const React = require('react')
const ReactDOM = require('react-dom')

const {getInstance} = require('../services/contract')
const {getDefaultAccount} = require('../services/account')
const {uploadJson} = require('../services/ipfs')

const Spinner = require('./Spinner.js')
const Comments = require('./Comments.js')

function formatDate(timestamp, format='MM/DD/YYYY hh:mmA') {
  return moment.unix(timestamp).format(format)
}

class Hangup extends React.Component {
 constructor(props) {
    super(props)
    const {id} = props.match.params

    this.state = {
      id,
      Hangup: null,
      showSpinner: true
    }

    this.getHangup()
    .then(() => {})
    .catch(() => {
      window.location.href = '#/'
    })
    .then(() => {
      this.setState({showSpinner: false})
    })
  }

  render() {
    const {
      Hangup,
      showSpinner,
      id
    } = this.state

    const isOrganizer = Hangup && Hangup.organizer === getDefaultAccount()

    return (
      <div className="ui grid padded row HangupGrid">
        <div className="column ten wide">
          {showSpinner ?
            <Spinner show={showSpinner} />
          :
            <div className="ui items">
                <div className="item">
                  <div className="ui grid stackable">
                  <div className="column sixteen wide">
                    <h3 className="ui huge header">
                      {Hangup.title}
                    </h3>
                  </div>
                  <div className="column sixteen wide HangupDescription">
                      <p>{Hangup.description}</p>
                  </div>
                    <div className="column eight wide">
                      <div className="ui bordered image fluid HangupImage">
                        <a href={Hangup.imageUrl} target="_blank" rel="noopener noreferrer">
                          <img src={Hangup.imageUrl} alt="" /></a>
                      </div>
                    </div>
                    <div className="column eight wide">
                    <div className="content">
                        <div className="meta">
                          <p><i className="icon wait"></i> Starts {formatDate(Hangup.start, 'dddd, MMMM DD, hh:mmA')}</p>
                          <p><i className="icon wait"></i> Ends {formatDate(Hangup.end, 'MMMM DD, hh:mmA')}</p>
                          <p><i className="icon marker"></i> <a href={`https://www.google.com/maps?q=${Hangup.location}`} target="_blank" rel="noopener noreferrer">{Hangup.location}</a></p>
                        </div>
                        <div className="extra">
                          <p><i className="icon tag"></i>{Hangup.tags.map((tag, i) => {
                            return <span className="ui tiny label" key={i}>{tag}</span>
                          })}</p>
                          <p className="HangupOrganizer"><small><i className="icon user"></i>&nbsp;
                          <a href={`#/organizer/${Hangup.organizer}`} >{Hangup.organizer}</a></small></p>
                      <p>ID <span className="ui label">{Hangup.id}</span></p>

                          <p><small>Created {formatDate(Hangup.created)}</small></p>
                          {Hangup.updated ?
                          <p><small>Updated {formatDate(Hangup.updated)}</small></p>
                          : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              {isOrganizer ?
                <div>
                <div className="ui divider"></div>
                <div className="ui tiny buttons">
                  <a
                    href={`#/Hangups/${id}/edit`}
                    className="ui tiny icon blue button labeled icon">
                    <i className="icon edit"></i>
                    Edit
                  </a>
                  <a className="ui tiny icon button labeled icon"
                    onClick={this.onHangupDelete.bind(this)}>
                    <i className="icon trash"></i>
                    Delete
                  </a>
                </div>
                </div>
              : null}
            </div>
            }
        </div>
        <div className="column ten wide">
          <Comments />
        </div>
      </div>
    )
  }

  async getHangup() {
    const {id} = this.state
    const Hangup = await getInstance().getHangupById(id)
    this.setState({Hangup})
    return Hangup
  }

  async onHangupDelete (event) {
    event.preventDefault()

    const {id} = this.state

    const Hangup = await getInstance().getHangupById(id)
    Hangup.deleted = true

    const [result] = await uploadJson(Hangup)
    const {hash:ipfsHash} = result

    try {
      await getInstance().editHangup({id, ipfsHash})
      window.location.href = `#/Hangups`
    } catch (error) {
      alert(error)
    }
  }
}

module.exports = Hangup
