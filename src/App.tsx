import './App.css'

import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from './screens/Home'
import Lobby from './screens/Lobby'
import CreateRoom from './screens/CreateRoom'
import WaitingRoom from './screens/WaitingRoom'
import GameBoard from './screens/GameBoard'
import UpcomingQuestion from './components/game/UpcomingQuestion'
import { defaultUpcoming } from './models/UpcomingQuestionModel'
import GameQuestion from './components/game/GameQuestion'
import { defaultGameQuestion } from './models/GameQuestionModel'
import { GlobalContextProvider } from './context/globalContext'

export default function App(){
    return (

      // <GlobalContextProvider>
        // {/* // Use browser router instead of router for website (as opposed to mobile app) routing. */}
        <BrowserRouter>

          {/* ADD ALL PATHS FOR THE APP HERE. INCLUDING NESTED PATHS i.e /register/student */}
          <Route exact path="/" component={Home} />
          <Route exact path="/lobby" component={Lobby} />
          <Route exact path="/create-room" component={CreateRoom} />
          <Route exact path="/waiting-room" component={WaitingRoom} />
          <Route exact path="/game-board" component={GameBoard} />


          {/* TESTING COMPONENTS that later may not have own routes */}
          {/* <Route exact path="/upcoming-question"><UpcomingQuestion category="Default" value={200}/></Route> */}
          <Route exact path="/upcoming-question"><UpcomingQuestion {...defaultUpcoming}/></Route>
          <Route exact path="/game-question"><GameQuestion {...defaultGameQuestion}/></Route>

          {/* Use Link to get to the route whenever needed from anywhere */}

        </BrowserRouter>
      // </GlobalContextProvider>
    )
}