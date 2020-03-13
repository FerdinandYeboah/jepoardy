import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from './screens/Home'
import './App.css'

export default function App(){
    return (
      // Use browser router instead of router for website (as opposed to mobile app) routing.
      <BrowserRouter>

        {/* ADD ALL PATHS FOR THE APP HERE. INCLUDING NESTED PATHS i.e /register/student */}
        <Route exact path="/" component={Home} />
        <Route exact path="/lobby" component={Home} />
        <Route exact path="/game-board" component={Home} />
        <Route exact path="/question" component={Home} />

        {/* Use Link to get to the route whenever needed from anywhere */}

    </BrowserRouter>
    )
}