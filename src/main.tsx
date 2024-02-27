import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from './layouts/root-layout';
import HomeLayout from './layouts/home-layout';
import Home from './home/home';
import Participants from './games/participants';
import Question from './games/question';
import Create from './questions/create';
import Login from './auth/login';
import Signup from './auth/signup';
import LoginLayout from './layouts/login-layout';
import { AnimatePresence } from 'framer-motion';
import Sets from './test-sets/sets';
import { CookiesProvider } from 'react-cookie';
import Play from './play/play';
import Leaderboard from './games/leaderboard';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route element={<HomeLayout />}>
        <Route path='/' element={<Home />} />
        <Route path="/games/:id/participants" element={<Participants />} />
        <Route path="/games/:id/test" element={<Question />} />
        <Route path='/games/:id/leaderboard' element={<Leaderboard />} />
        <Route path='/create' element={<Create />} />
        <Route path='/sets' element={<Sets />} />
        <Route path='/play' element={<Play />} />
        <Route element={<LoginLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          R</Route>
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AnimatePresence mode='wait'>
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
  </AnimatePresence>
)
