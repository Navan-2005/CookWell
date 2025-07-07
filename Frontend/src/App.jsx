import { useState } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import store from './redux/store'
import './App.css'

// Components
import UploadImage from './components/UploadImage'
import Community from './components/Community'

// Pages
import Login from './Pages/Login'
import Register from './Pages/Register'
import Footer from './Pages/landingpage/components/Footer.jsx'
import Navbar from './Pages/landingpage/components/Navbar.jsx'
import Header from './Pages/landingpage/components/Header.jsx'
import Landing from './Pages/landingpage/Home.jsx'
import BMICalculator from './Pages/bmi.jsx'
import DietForm from './Pages/DietForm.jsx'
import Favorites from './Pages/Favorites.jsx'
import RecipeDetails from './Pages/RecipeDetails.jsx'
import RecipeChatBot from './chatbolt.jsx'
import { Layout } from './Pages/Layout.jsx'
import ContactForm from './components/ContactForm.jsx'

// Layout component
// function Layout() {
//   return (
//     <div className='flex flex-col w-full h-screen'>
//       <Navbar />
//       <Outlet />
//       <Footer />
//     </div>
//   )
// }

// Main App
function App() {
  const [count, setCount] = useState(0)

  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className='bg-black'>
            <Navbar />
          <Routes>
            {/* Routes using shared Layout */}
            {/* <Route path='/' element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path='community' element={<Community />} />
              <Route path='upload' element={<UploadImage />} />
              {/* Add more nested routes here if needed 
            </Route> */}

            <Route path='/' element={<Layout/>} />
            {/* <Route path='/bmi' element={<BMICalculator />} />
            <Route path='/bmi' element={<BMICalculator />} /> */}
            
            <Route path='/bmi' element={<BMICalculator />}/>
            
            {/* Standalone routes outside of Layout */}
            {/* <Route path='/bmi' element={<BMICalculator />} /> */}
            <Route path='/diet' element={<DietForm/>} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/favorites' element={<Favorites />} />
            <Route path='/recipe/:recipeId' element={<RecipeDetails/>}/>
            <Route path='/chat' element={<RecipeChatBot/>}/>
            <Route path='/community' element={<Community/>}/>
            <Route path='/contact' element ={<ContactForm/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App
