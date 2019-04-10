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
      predictions: []
    }
    this.setPredictions = this.setPredictions.bind(this)
    this.loadNewImage = this.loadNewImage.bind(this)
  }

  componentDidMount() {
    //once we've mounted classify image
    this.classifyImg()
  }

  classifyImg = () => {
    //intitialize the  Image Classifier (with MobileNet?):
    const classifier = ml5.imageClassifier('MobileNet', () => {
      //when the model is loaded
      console.log('Model loaded bro')
    })
    // get a var ref to the image..... (can we not just use the react ref?)
    const image = document.getElementById('image')
    //make a specified ncount of 5 predictions with the selected image
    classifier
      .predict(image, 5, (err, results) => {
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
    fetch('https://picsum.photos/800/?random').then(response => {
      document.getElementById('image').src = response.url
      this.classifyImg()
    })
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
      _button = <button onClick={this.loadNewImage}>Try something else</button>
    }

    return (
      <div className="App">
        <h1>{this.state.message}</h1>
        <div className="predictions-container">
          <div className="predictions">{_predictions}</div>
          {_button}
        </div>
        <img
          src={this.image}
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
