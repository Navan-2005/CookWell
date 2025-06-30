import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Provider} from 'react-redux'
import store from './redux/store'
import './App.css'
import UploadImage from './components/UploadImage'
import ChatBot from './components/Chatbot'
import Community from './components/Community'


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
