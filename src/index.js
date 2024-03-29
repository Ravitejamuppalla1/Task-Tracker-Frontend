import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from './Store/configurestore'

const store = configureStore()
console.log(store.getState())

store.getState(() => {
    console.log(store.getState())
})

const Root = ReactDOM.createRoot(document.getElementById('root'))

Root.render(<Provider store={store} >
    <BrowserRouter>
        <App />
    </BrowserRouter>
</Provider>)

