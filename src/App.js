import React, { Component } from 'react'
import './App.css'
import tiger from './tiger.jpg'
import * as ml5 from 'ml5'

class App extends Component {
  image = tiger

  constructor() {
    super()
    this.state = {
      message: `Loading image classification....`,
      predictions: [],
      searchTerm: 'animal,animals,pets',
      imageSrc: null
    }

    this.state = {
      ...this.state,
      apis: {
        picsum: 'https://picsum.photos/800/?random',
        unsplash: `https://source.unsplash.com/800x800/?${
          this.state.searchTerm
        }`
      }
    }
    this.setPredictions = this.setPredictions.bind(this)
    this.loadNewImage = this.loadNewImage.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.textBlur = this.textBlur.bind(this)
  }

  componentDidMount() {
    //once we've mounted classify image
    this.loadNewImage();
  }

  classifyImg = () => {
    //intitialize the  Image Classifier (using pre-trained Darknet ML model):
    const classifier = ml5.imageClassifier('MobileNet', () => {
      //when the model is loaded
      console.log('Model loaded bro')
    })
    // get a var ref to the image..... (can we not just use the react ref?)
    const  image = document.getElementById('image')
    //make a specified ncount of 5 predictions with the selected image
    classifier
      .predict(image, 5, (err, results) => {
        if (err) {
          alert(err)
        }
        console.log(results)
      })
      .then(results => this.setPredictions(results))
  }

  setPredictions = pred => {
    this.setState({
      message: `Completed classification`,
      predictions: pred
    })
  }

  loadNewImage() {
    this.setState({
      predictions: [],
      message: `Loading image classification....`
    })
    fetch(this.state.apis.unsplash)
      .then(response => this.setState({
        imageSrc : response.url
      }))
      
      .then(this.classifyImg())
      //.then(this.watchForImageLoad() )
  }

  watchForImageLoad() {
    if(!document.getElementById('image').complete)
    {
      console.log('image not complete, delaying classification...')
      setTimeout(this.watchForImageLoad(), 500)

    }else{
      console.log('image complete. classifying....')
      setTimeout(this.classifyImg(),  1000)
      
    }
  }

  handleChange(e) {
    const val = e.target.value
    const name = e.target.name
    this.setState(prevState => {
      return {
        [name]: val,
        apis: {
          ...prevState.apis,
          unsplash: `https://source.unsplash.com/800x800/?${val}`
        }
      }
    })
  }

  textFocus(e) {
    e.target.value = ''
  }

  textBlur(e) {
    if (e.target.value === '') {
      e.target.value = this.state[e.target.name]
    }
  }

  render() {
    let _predictions
    let _button
    if (this.state.predictions.length > 0) {
      _predictions = this.state.predictions.map((prediction, i) => {
        let probability = `${Math.floor(
          (prediction.confidence * 10000) / 100
        )} % confidence`
        return (
          <p key={i}>
            ({i + 1}) Prediction: {prediction.label}, {probability}.
          </p>
        )
      })
      _button = <button onClick={this.loadNewImage}>Check another image</button>
    }

    return (
      <div className="App">
        <h1>{this.state.message}</h1>
        <div className="predictions-container">
          <div className="predictions">{_predictions}</div>
          <div>
            <div>
              <label htmlFor="searchTerm">Image category:</label>
              <input
                type="text"
                name="searchTerm"
                placeholder="Enter image category"
                value={this.state.searchTerm}
                onChange={this.handleChange}
                onFocus={this.textFocus}
                onBlur={this.textBlur}
              />
            </div>
            <div>{_button}</div>
          </div>
        </div>
        <img
          src={this.state.imageSrc}
          id="image"
          width="800"
          alt="RAAWWRRR"
          crossOrigin="anonymous"
        />
      </div>
    )
  }
}

export default App
