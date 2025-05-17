import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import NavBar from './components/NavBar'

const App = () => {
  return (
    <div className="bg-light min-vh-100">
      <NavBar />
      <div className="container py-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  )
}

export default App