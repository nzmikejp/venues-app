import React, { Component } from 'react'
import Venue from './Venue'
import Modal from 'react-bootstrap/Modal'
import './App.css'

var clientId = 'PN4Y5ISZD1GXUQPTPFC4VYD5ZXXMIYR2TLPUKU5YCYM5L0O1'
var clientSecret = 'N110GTRJL4RHVLOY5T5UCNRLNEKUMAECV0GJ4HW4GXFAZYV1'
var key = '?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20200801'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      venues: [],
      isModalOpen: false,
      modalVenue: {
        address: "57-59 Wakefield St.",
        category: "Asian",
        description: undefined,
        id: "4e8e37c59a5297144c8f2909",
        name: "Jin Hai Wan",
        photo: "https://fastly.4sqi.net/img/general/300x300/17335843_egWSWga8en-8n6wzSHtiRM71qqNd7taD0r7GObQsgnE.jpg"
      }
    }
  }

  loadVenues = () => {

    var latlong = '-36.856659,174.764489'
    var url = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=' + latlong

    //Make AJAX request to endpoint
    fetch(url)
      .then((res) => {
        return res.json()
      })

      .then((data) => {
        return data.response.groups[0].items
      })

      .then((data) => {
        return data.map((item) => {
          var venue = {
            id: item.venue.id,
            name: item.venue.name,
            address: item.venue.location.address,
            category: item.venue.categories[0].shortName
          }
          return venue
        })
      })

      .then((data) => {
        this.setState({
          venues: data
        })
      })
  }

  loadVenue = (id) => {
    var url = 'https://api.foursquare.com/v2/venues/' + id + key

    fetch(url)
      .then(res => res.json())
      .then(data => {
        var item = data.response.venue
        var venue = {
          id: item.id,
          name: item.name,
          category: item.categories[0].shortName,
          address: item.location.address,
          description: item.description,
          photo: item.bestPhoto.prefix + '300x300' + item.bestPhoto.suffix
        }
        return venue
      })
      .then(data => {
        this.setState({
          modalVenue: data
        })
      })
  }

  openModal = () => {
    this.setState({
      isModalOpen: true
    })
  }

  closeModal = () => {
    this.setState({
      isModalOpen: false
    })
  }

  componentDidMount() {
    this.loadVenues()
  }

  render() {
    return (
      <div className="app">
        <div className="container">
          <div className="venues">
            {
              this.state.venues.map((venue) => {
                var props = {
                  key: venue.id,
                  openModal: this.openModal,
                  loadVenue: this.loadVenue,
                  ...venue,
                }

                return (
                  <Venue {...props} />
                )
              })
            }

          </div>

          <div className="venue-filters">

            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <div role="group" className="btn-group btn-group-toggle">
                <label className="venue-filter btn active btn-primary">
                  <input name="venue-filter" type="radio" autoComplete="off" value="all" checked="" />All
              </label>
                <label className="venue-filter btn btn-primary">
                  <input name="venue-filter" type="radio" autoComplete="off" value="food" />Food
              </label>
                <label className="venue-filter btn btn-primary">
                  <input name="venue-filter" type="radio" autoComplete="off" value="drinks" />Drinks
              </label>
                <label className="venue-filter btn btn-primary">
                  <input name="venue-filter" type="radio" autoComplete="off" value="others" />Others
              </label>
              </div>
            </div>

          </div>
        </div>

        <Modal show={this.state.isModalOpen} onHide={this.closeModal}>
          <Modal.Body>
            <div className="venue-popup-body row">
              <div className="col-6">
                <h1 className="venue-name">{this.state.modalVenue.name}</h1>
                <p>{this.state.modalVenue.address}</p>
                <p>Auckland</p>
                <p><span className="badge venue-type">{this.state.modalVenue.category}</span></p>
              </div>
              <div className="col-6">
                <img src={this.state.modalVenue.photo} className="img-fluid" alt="" />
              </div>
            </div>

          </Modal.Body>
        </Modal>

      </div>
    )
  }
}

export default App;
