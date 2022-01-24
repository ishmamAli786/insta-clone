import React,{useContext} from 'react';
import Login from '../modules/Login';
import {UserContext} from '../App';
import {Navigate} from 'react-router-dom';


export default function PrivateSignin() {
    const {state,dispatch} =useContext(UserContext)
    return (
        <>
        {state==null ? <Login/>: <Navigate to="/"/>}
        </>
    )
}
