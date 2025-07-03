import { useState } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import store from './redux/store'
import './App.css'
import UploadImage from './components/UploadImage'
import Community from './components/Community'
import Login from './Pages/Login'
import Register from './Pages/Register'
<<<<<<< HEAD
// import {Routes, Route, Outlet} from 'react-router-dom'
import Footer from './Pages/landingpage/components/Footer.jsx'
import Navbar from './Pages/landingpage/components/Navbar.jsx'
import Header from './Pages/landingpage/components/Header.jsx'


=======
import GroceryList from './Pages/GroceryList'
import LandingPage from './Pages/LandingPage'
import BMI from './Pages/bmi'
import Favorites from './Pages/Favorites'
import ChatBot from './components/Chatbot'
>>>>>>> 6ad258c2c49f402f1a457477df959b421a0a257c

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
<<<<<<< HEAD
      <Navbar/>
        <Outlet/>
      <Footer/>
=======
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
>>>>>>> 6ad258c2c49f402f1a457477df959b421a0a257c
    </>
  )
}

export default App
