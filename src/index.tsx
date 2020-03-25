import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GlobalContextProvider } from './context/globalContext';

ReactDOM.render(
    <GlobalContextProvider>
        <App />
    </GlobalContextProvider>, 
    document.getElementById('root')
);