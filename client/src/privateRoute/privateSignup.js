import React,{useContext} from 'react';
import Signup from '../modules/Signup';
import {UserContext} from '../App';
import {Navigate} from 'react-router-dom';


export default function PrivateSignup() {
    const {state,dispatch} =useContext(UserContext)
    return (
        <>
        {state==null ? <Signup />:<Navigate to="/"/>}
        </>
    )
}
