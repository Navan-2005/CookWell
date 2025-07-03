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
// import {Routes, Route, Outlet} from 'react-router-dom'
import Footer from './Pages/landingpage/components/Footer.jsx'
import Navbar from './Pages/landingpage/components/Navbar.jsx'
import Header from './Pages/landingpage/components/Header.jsx'



function App() {
  const [count, setCount] = useState(0)
  return (
    <div className='bg-black'>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          {/*<Route path='recipes/:id' element={<RecipeDetail />} />*/}
        </Route>
      </Routes>
    </div>
  );

//   return (
//     <>
//       <Provider store={store}>
//         <BrowserRouter>
//           <Routes>
//             <Route path='/login' element={<Login />} />
//             <Route path='/register' element={<Register />} />
//           </Routes>
//         </BrowserRouter>
//       </Provider>
//     </>
//   )
 }
 function Layout(){
  return (
    <>
      <Navbar/>
        <Outlet/>
      <Footer/>
    </>
  )
}

export default App
