import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
  useLocation,
} from "react-router-dom";
import RootLayout from './layouts/root-layout';
import HomeLayout from './layouts/home-layout';
import Home from './home/home';
import Participants from './test/participants';
import Question from './test/question';
import Create from './questions/create';
import Login from './auth/login';
import Signup from './auth/signup';
import LoginLayout from './layouts/login-layout';
import { AnimatePresence } from 'framer-motion';
import Sets from './test-sets/sets';
import { CookiesProvider } from 'react-cookie';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route element={<HomeLayout />}>
        <Route path='/' element={<Home />} />
        <Route path="/:id/participants" element={<Participants />} />
        <Route path="/:id/test" element={<Question />} />
        <Route path='/create' element={<Create />} />
        <Route path='/sets' element={<Sets />} />
        <Route element={<LoginLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AnimatePresence mode='wait'>
      <CookiesProvider>
        <RouterProvider router={router} />
      </CookiesProvider>
    </AnimatePresence>
  </React.StrictMode>,
)
