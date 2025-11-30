import './App.css'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Timer from './components/Timer'
import Layout from './layout/Layout'
import Home from './pages/home'

function App() {

  return (
    <Layout>
      <Home />
    </Layout>
  )
}

export default App
