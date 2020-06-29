import React, { useState, useEffect, useContext } from "react";
import { RoomFrontendModel, RoomBackendModel, convertRoomModelListBE2FE, State } from '../models/Room';
import io from "socket.io-client";

// Create context and create hook for it
const GlobalContext = React.createContext()

// Create hook for context. Will be consumed
export function useGlobalContext() {
    return useContext(GlobalContext)
}

// Create Provider (React Component) for context. Will be consumed
export function GlobalContextProvider({children}) {
    const [socket, setSocket] = useState();
    const [rooms, setRooms] = useState(); //type: RoomFrontendModel[]

    //Initialization logic
    useEffect(() => {
        console.log("Called useEffect");
        
        //Connect socket
        const socket = io(`http://${window.location.hostname}:3001`);
        setSocket(socket);
        console.log("Client socket: ", socket);

        //Create and expose a TypeSocket (custom) class that wraps socketio methods.

        //Add global listeners here. 
        socket.on("roomListUpdated", setRoomList);

    }, [])

    function setRoomList(data){ // data: RoomBackendModel[]
        //Set the rooms state object
        console.log("Converted frontend room models: ", convertRoomModelListBE2FE(data));
        setRooms(convertRoomModelListBE2FE(data))
      }

    //Return back provider exposing global data and methods. Could create a socket.on/emit proxy method
    return (
        <GlobalContext.Provider value={{
            socket,
            rooms
        }}>
            {children}
        </GlobalContext.Provider>
    )
}