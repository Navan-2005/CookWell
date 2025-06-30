import { useState } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import store from './redux/store'
import './App.css'
import UploadImage from './components/UploadImage'
import ChatBot from './components/Chatbot'
import Community from './components/Community'
import Login from './Pages/Login'
import Register from './Pages/Register'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
