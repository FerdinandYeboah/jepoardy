import React, { useState, useEffect, useContext } from "react";
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

    //Initialization logic
    useEffect(() => {
        console.log("Called useEffect");
        
        //Connect socket
        const socket = io("http://localhost:3001");
        setSocket(socket);
        console.log("Client socket: ", socket);

        //Create and expose a TypeSocket (custom) class that wraps socketio methods.

        //Add listeners? Nah I think add listeners later in relevant child components.

    }, [])

    //Return back provider exposing global data and methods. Could create a socket.on/emit proxy method
    return (
        <GlobalContext.Provider value={{
            socket
        }}>
            {children}
        </GlobalContext.Provider>
    )
}