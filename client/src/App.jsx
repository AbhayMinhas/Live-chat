import React, { Children, useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'


const PrivateRoute = ({children})=>{
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth"/>
  //if not authenticated navigate to the auth page
}

const AuthRoute = ({children})=>{
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ?  <Navigate to="/chat"/> : children;
  //if already authenticated redirect to the chat page
}
const App = () => {
  const {userInfo,setUserInfo}=useAppStore();
  const [loading, setloading] = useState(true);
  useEffect(()=>{
    const getUserData = async () => {
      try{
        const response = await apiClient.get(GET_USER_INFO,{withCredentials:true});
        console.log(response);
        if(response.status===200 && response.data.id){
          setUserInfo(response.data);
        }
        else{
          setUserInfo(undefined);
        }
        console.log({response});
      } catch(error){
        console.log(error);
        setUserInfo(undefined);
      }
      finally{
        setloading(false);
      }
    };
    if(!userInfo){
      getUserData();
    }else{
      setloading(false);
    }
  },[userInfo,setUserInfo]);
  if(loading){
    return <div>Loading...</div>
  }
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/auth' element={<AuthRoute><Auth/></AuthRoute>}/>
      <Route path='/chat' element={<PrivateRoute><Chat/></PrivateRoute>}/>
      <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>}/>
      <Route path='*' element={<Navigate to="/auth"/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App