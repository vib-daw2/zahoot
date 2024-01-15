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
import Participants from './test/participants';
import Question from './test/question';
import Create from './questions/create';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route element={<HomeLayout />}>
        <Route path='/' element={<Home />} />
        <Route path="/:id/participants" element={<Participants />} />
        <Route path="/:id/questions/:num" element={<Question />} />
        <Route path='/create' element={<Create />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
