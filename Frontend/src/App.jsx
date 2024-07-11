import { Link, Navigate, Route, Routes } from "react-router-dom"
import Layout from "./Layout"
import Login from "./pages/Login"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"

import axios from 'axios'
import LogOut from "./pages/LogOut"
import Account from "./pages/Account"
import userAtom from "../atoms/userAtom"
import { useRecoilValue } from "recoil"
import PlacePage from "./pages/PlacePage"
import Place from "./pages/Place"
import EditPlace from "./pages/EditPlace"
import BookingPage from "./pages/BookingPage"

function App() {
  const user=useRecoilValue(userAtom)
  // axios.default.baseURL='https://gofindbackend.onrender.com'
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
      <Route index element={user?<Home/>:<Navigate to={'/login'}/>}/>
      <Route  path='/login' element={!user?<Login/>:<Navigate to={'/'}/>} />
      <Route path="/logout" element={<LogOut/>}/>
      <Route path="/account/:subpage?" element={<Account/>}/>
      <Route path="/account/:subpage/:action?" element={<Account/>}/>
      {/* <Route path='/account/bookings' */}
      {/* <Route path="/account/:subpage/:action" element={<Account/>}/> */}
      <Route path="/account/places/:id" element={<PlacePage/>}/>
      <Route path="/account/booking/:id" element={<BookingPage/>}/>

      <Route path="/account/place/edit/:id" element={<EditPlace/>}/>



      <Route path="/signup" element={<SignUp/>}/>
      </Route>
    </Routes>
   
  )
}

export default App
