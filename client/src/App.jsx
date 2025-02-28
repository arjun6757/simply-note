import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthProvider';

export default function App() {

  const { user } = useAuth();

  return (
    <Routes>
      {/* <Route path='/' element={user ? <Home /> : <Navigate to={'/login'} />} />  */}
      {/* to strict so i thought it is better to use it even when not logged in */}
      <Route path='/' element={<Home />} />
      <Route path='/login' element={user ? <Navigate to={'/'} /> : <Login />} />
      <Route path='/signup' element={user ? <Navigate to={'/'} /> : <Signup />} />
    </Routes>
  )
}
