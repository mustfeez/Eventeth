const React = require('react')
const ReactDOM = require('react-dom')
const moment = require('moment')
const Datetime = require('react-datetime')

const Spinner = require('./Spinner.js')
const {getInstance} = require('../services/contract')
const {ipfsUrl, uploadJson, uploadFile, uploadFromUrl} = require('../services/ipfs')
const {DEFAULT_Hangup_IMAGE} = require('../constants/defaults')

const defaultHangup = {
  title: '',
  description: '',
  location: '',
  tags: [],
  image: '',
  start: moment().add(1, 'day').startOf('hour').unix(),
  end: moment().add(1, 'day').add(4, 'hour').startOf('hour').unix(),
  created: moment().unix(),
  updated: null,
  organizer: ''
}

class EditHangup extends React.Component {
 constructor(props) {
    super(props)

    this.state = {
      id: props.match.params.id,
      imageUrl: ipfsUrl(DEFAULT_Hangup_IMAGE),
      isNew: props.isNew,
      Hangup: defaultHangup,
      showSpinner: false
    }

    if (this.state.id) {
      this.state.showSpinner = true

      this.getHangup()
      .then(() => {})
      .catch(() => {
        window.location.href = '#/'
      })
      .then(() => {
        this.setState({showSpinner: false})
      })
    }
  }

  render() {
    const {
      imageUrl,
      isNew,
      Hangup,
      showSpinner
    } = this.state

    return (
    <div className="ui grid stackable padded">
      <div className="column sixteen wide">
        <h3 className="ui huge header">
          {isNew ? 'New Hangup' : 'Edit Hangup'}
        </h3>
        <div className="sub header">
          <p>Please make sure you have your MetaMask wallet connected.</p>
        </div>
        <div className="ui divider"></div>
      </div>
      <div className="column sixteen wide">
        {showSpinner ?
          <Spinner show={showSpinner} />
        :
        <form className="ui form">
          <div className="field required">
            <label><i className="icon pencil"></i> Title</label>
            <div className="ui input">
              <input
                type="text"
                placeholder="Bring your corgi day!"
                defaultValue={Hangup.title}
                onChange={this.onTitleChange.bind(this)}
              />
            </div>
          </div>
          <div className="field required">
            <label><i className="icon pencil"></i> Description</label>
            <div className="ui input">
              <textarea
                placeholder="This is where corgi's come to pawtay!"
                defaultValue={Hangup.description}
                onChange={this.onDescriptionChange.bind(this)}
              ></textarea>
            </div>
          </div>
          <div className="field required">
            <label><i className="icon marker"></i> Location</label>
            <div className="ui input">
              <input
                type="text"
                placeholder="Dockweiler Beach, CA"
                defaultValue={Hangup.title}
                onChange={this.onLocationChange.bind(this)}
              />
            </div>
          </div>
          <div className="field">
            <label><i className="icon tag"></i> Tags <small>(comma separated)</small></label>
            <div className="ui input">
              <input
                type="text"
                placeholder="pets, beach, social"
                defaultValue={Hangup.tags.join(',')}
                onChange={this.onTagsChange.bind(this)}
              />
            </div>
          </div>
          <div className="three fields">
            <div className="field">
              <label><i className="icon photo"></i> Image</label>
              <div
                className="ui small bordered image"
                style={{
                  width: '200px',
                  height:'200px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <img src={imageUrl} alt="" />
                </div>
            </div>
            <div className="field">
              <label><i className="icon upload"></i> Image Upload</label>
              <div className="ui input">
                <input
                  type="file"
                  placeholder="Tags"
                  defaultValue={Hangup.tags}
                  onChange={this.onImageChange.bind(this)}
                />
              </div>
            </div>
            <div className="field">
              <label><i className="icon world"></i> Image URL</label>
              <div className="ui input">
                <input
                  type="text"
                  placeholder="Image URL"
                  onChange={this.onImageUrlChange.bind(this)}
                />
              </div>
            </div>
          </div>
          <div className="field required">
            <label><i className="icon wait"></i> Start Date</label>
            <Datetime
              defaultValue={moment.unix(Hangup.start)}
              onChange={this.onStartDateChange.bind(this)}
            />
          </div>
          <div className="field required">
            <label><i className="icon wait"></i> End Date</label>
            <Datetime
              defaultValue={moment.unix(Hangup.end)}
              onChange={this.onEndDateChange.bind(this)}
            />
          </div>
          <div className="field">
          {isNew ?
            <button className="ui button green icon" onClick={this.handleSubmit.bind(this)}>
              Create
              <i className="icon save"></i>
            </button>
         :
            <button className="ui button green icon" onClick={this.handleEditSubmit.bind(this)}>
              Save
              <i className="icon save"></i>
            </button>
          }
          </div>
        </form>
        }
      </div>
    </div>
    )
  }

  onTitleChange(event) {
    const {Hangup} = this.state
    Hangup.title = event.target.value.trim()
    this.setState({Hangup})
  }

  onDescriptionChange(event) {
    const {Hangup} = this.state
    Hangup.description = event.target.value.trim()
    this.setState({Hangup})
  }

  onLocationChange(event) {
    const {Hangup} = this.state
    Hangup.location = event.target.value.trim()
    this.setState({Hangup})
  }

  onTagsChange(event) {
    const {Hangup} = this.state
    Hangup.tags = event.target.value.split(',').map(x => x.trim())
    this.setState({Hangup})
  }

  onImageChange(event) {
    console.log(event)
    const file = event.target.files[0]

    uploadFile(file)
    .then(files => {
      console.log(files)

      const multihash = files[0].hash

      const {Hangup} = this.state
      Hangup.image = multihash
      this.setState({Hangup})

      this.setState({
        imageUrl: ipfsUrl(multihash)
      })
    })
    .catch(error => {
      console.error(error)
    })
  }

  onImageUrlChange(event) {
    const url = event.target.value.trim()

    uploadFromUrl(url)
    .then(files => {
      console.log(files)

      const multihash = files[0].hash

      const {Hangup} = this.state
      Hangup.image = multihash

      this.setState({
        Hangup,
        imageUrl: ipfsUrl(multihash)
      })
    })
    .catch(error => {
      console.error(error)
    })
  }

  onStartDateChange(momentDate) {
    const {Hangup} = this.state
    Hangup.start = momentDate.unix()
    this.setState({Hangup})
  }

  onEndDateChange(momentDate) {
    const {Hangup} = this.state
    Hangup.end = momentDate.unix()
    this.setState({Hangup})
  }

  async handleSubmit(event) {
    event.preventDefault()

    const {Hangup} = this.state
    Hangup.created = moment().unix()
    Hangup.organizer = getInstance().account

    if (!Hangup.title) {
      alert('Title is required')
      return false
    }

    const [result] = await uploadJson(Hangup)
    const {hash:ipfsHash} = result

    try {
      await getInstance().createHangup({ipfsHash})
      window.location.href = '#Hangups'
    } catch (error) {
      alert(error)
    }
  }

  async handleEditSubmit(event) {
    event.preventDefault()

    const {Hangup} = this.state
    Hangup.updated = moment().unix()

    if (!Hangup.title) {
      alert('Title is required')
      return false
    }

    const {id} = Hangup
    Hangup.organizer = getInstance().account

    const [result] = await uploadJson(Hangup)
    const {hash:ipfsHash} = result

    try {
      await getInstance().editHangup({id, ipfsHash})
      window.location.href = `#/Hangups/${id}`
    } catch (error) {
      alert(error)
    }
  }

  getHangup() {
    const {id} = this.state

    return getInstance()
    .getHangupById(id)
    .then(Hangup => {
      console.log(Hangup)
      this.setState({
        Hangup,
        imageUrl: Hangup.imageUrl
      })
    })
  }
}

module.exports = EditHangup
