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
import UpdateQuestions from './questions/update';
import Login from './auth/login';
import Signup from './auth/signup';
import LoginLayout from './layouts/login-layout';
import { AnimatePresence } from 'framer-motion';
import Sets from './test-sets/sets';
import { CookiesProvider } from 'react-cookie';
import Play from './play/play';
import Leaderboard from './games/leaderboard';
import NotFound from './notFound/notFound';
import Settings from './settings/settings';
import SettingsLayout from './layouts/settings-layout';
import Profile from './settings/profile';
import About from './settings/about';
import Game from './games/game';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route element={<HomeLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/games/:id' element={<Game />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path='/sets/create' element={<UpdateQuestions action='create' />} />
        <Route path='/sets/:id/edit' element={<UpdateQuestions action='edit' />} />
        <Route
          path='/sets'
          element={<Sets />}
        />
        <Route path='/play' element={<Play />} />
        <Route element={<LoginLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<SettingsLayout />}>
          <Route path='/settings' element={<Settings />} />
          <Route path='/settings/profile' element={<Profile />} />
          <Route path='/settings/about' element={<About />} />
        </Route>
        <Route path='*' element={<NotFound />} />
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
