import { useState } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import store from './redux/store'
import './App.css'
import UploadImage from './components/UploadImage'
import Community from './components/Community'
import Login from './Pages/Login'
import Register from './Pages/Register'
import GroceryList from './Pages/GroceryList'
import LandingPage from './Pages/LandingPage'
import BMI from './Pages/bmi'
import Favorites from './Pages/Favorites'
import ChatBot from './components/Chatbot'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/grocery' element={<GroceryList/>}/>
            <Route path='/bmi' element={<BMI/>}/>
            <Route path='/favourites' element={<Favorites/>}/>
            <Route path='/chat' element={<ChatBot/>}/>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
