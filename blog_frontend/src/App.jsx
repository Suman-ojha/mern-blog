import {BrowserRouter , Route ,Routes} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Dashboard from './pages/Dashboard'
import Signin from './pages/Signin'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Header from './Components/Header'

const App = () => {
  return (

    <BrowserRouter>
          <Header/>
    <Routes>
      <Route  path="/"  element ={<Home/>} />
      <Route  path="/about"  element ={<About/>} />
      <Route  path="/dashboard"  element ={<Dashboard/>} />
      <Route  path="/projects"  element ={<Projects/>} />
      <Route  path="/sign-in"  element ={<Signin/>} />
      <Route  path="/sign-up"  element ={<SignUp/>} />
    </Routes>

    </BrowserRouter>
  )
}

export default App