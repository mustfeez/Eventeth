const moment = require('moment')
const React = require('react')
const ReactDOM = require('react-dom')

const {getInstance} = require('../services/contract')
const { getPosts } = require('../services/query')

const Spinner = require('./Spinner.js')

function handleError(error) {
  console.error(error)
}

function formatDate(timestamp, format='MM/DD/YYYY hh:mmA') {
  return moment.unix(timestamp).format(format)
}

class Hangups extends React.Component {
 constructor(props) {
    super(props)

    let Hangups = []

    try {
      const parsed = JSON.parse(sessionStorage.getItem('Hangups'))
      if (parsed) {
        Hangups = parsed
      }
    } catch (error) {

    }

    this.state = {
      Hangups,
      showSpinner: !Hangups.length
    }
  }

  componentDidMount () {
    this.getHangups()
  }

  render() {
    const Hangups = this.state.Hangups
    const showSpinner = this.state.showSpinner

    return (
      <div className="ui grid padded stackable HangupsGrid">
        <div className="column sixteen wide">
          <h3 className="ui huge header">
            Hangups
          </h3>
          <div className="ui divider"></div>
        </div>
        <div className="column twelve wide">
          {!Hangups.length && !showSpinner ? <div className="ui message info">No Hangups</div> : null}
          <Spinner show={showSpinner} />
          {Hangups.length ?
            <div className="HangupRows">
            {Hangups.map((Hangup, i) => {
              var size = Hangups.length

              return ([
                <div className="HangupRow" key={i}>
                  <div className="ui grid stackable">
                    <div className="column sixteen wide">
                      <datetime className="HangupRowDate">
                        <strong>{formatDate(Hangup.start, 'ddd, MMM DD')} </strong>
                        {formatDate(Hangup.start, 'hh:mmA')}
                      </datetime>
                    </div>
                    <div className="column sixteen wide">
                      <div className="ui grid stackable BoxFrame">
                        <div className="column sixteen wide HangupRowContent">
                          <div className="ui bordered image fluid">
                            <a href={`#/Hangups/${Hangup.id}`}><img src={Hangup.imageUrl} alt="" /></a>
                          </div>
                          <div className="content">
                            <div className="ui large header HangupRowTitle overflow-y">
                              <a href={`#/Hangups/${Hangup.id}`}>
                                {Hangup.title}
                              </a>
                            </div>
                            <div className="description overflow-y">
                              {Hangup.description}
                            </div>
                          </div>
                        </div>
                        <div className="column sixteen wide HangupRowMeta">
                          <a href={`#/Hangups/${Hangup.id}`}>
                          <span className="ui label">
                            {Hangup.id}
                          </span>
                          </a>
                          <a href={`https://www.google.com/maps?q=${Hangup.location}`} target="_blank" rel="noreferrer noopener">
                            <i className="icon marker"></i>
                            {Hangup.location}
                          </a>
                        <span>
                          <i className="icon tag"></i>{Hangup.tags.map((tag, i) => {
                            return <i className="ui tiny label" key={i}>{tag}</i>
                          })}
                        </span>
                        <a href={`#/organizer/${Hangup.organizer}`}>
                      <i className="icon user"></i>
                        organizer</a>
                          <datetime>Created {formatDate(Hangup.updated)}</datetime>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>,
               i === size-1 ? null : <div className=""></div>
              ])
            })}
          </div>
        : null}
      </div>
    </div>
    )
  }

  async getHangups() {
    //this.setState({showSpinner: true})

    try {
      const Hangups = await getInstance().getAllHangups()
      this.setState({Hangups})

      sessionStorage.setItem('Hangups', JSON.stringify(Hangups))
    } catch (error) {
      handleError(error)
    }

    this.setState({showSpinner: false})
  }
}

module.exports = Hangups
