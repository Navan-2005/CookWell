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
import Wrapper from './Pages/Wrapper.jsx'
import ProfilePage from './Pages/Profile.jsx'
import GroceryListApp from './Pages/GroceryList.jsx'
import Groceries from './Pages/Groceries.jsx'

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
  return (
    <Provider store={store}>
      <BrowserRouter>
      <div className='mt-15'>

      </div>
        <div className='bg-black'>
            <Navbar />
          <Routes>
            <Route path='/' element={<Wrapper><Layout/></Wrapper>} />      
            <Route path='/bmi' element={<BMICalculator />}/>
            <Route path='/diet' element={<Wrapper><DietForm /></Wrapper>} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/favorites' element={<Wrapper><Favorites /></Wrapper>} />
            <Route path='/recipe/:recipeId' element={<Wrapper><RecipeDetails /></Wrapper>}/>
            <Route path='/chat' element={<Wrapper><RecipeChatBot /></Wrapper>}/>
            <Route path='/community' element={<Wrapper><Community /></Wrapper>}/>
            <Route path='/contact' element ={<Wrapper><ContactForm /></Wrapper>}/>
            <Route path='/profile' element={<Wrapper><ProfilePage/></Wrapper>}/>
            <Route path='/grocery' element={<Wrapper><GroceryListApp/></Wrapper>}/>
            <Route path='/groceries' element={<Wrapper><Groceries/></Wrapper>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App
