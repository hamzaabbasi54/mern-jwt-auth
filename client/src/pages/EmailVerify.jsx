import React, {useContext, useEffect} from 'react';
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {AppContent} from "../context/AppContext.jsx";
import {toast} from "react-toastify";

const EmailVerify = () => {

    axios.defaults.withCredentials= true;
    const navigate = useNavigate();
    const inputRefs = React.useRef([]);
      const {backendUrl,isLoggedin,userData,getUserData} = useContext(AppContent);

    const handleInput=(e, index)=> {
        const value = e.target.value;
        if (value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    }
    const handleKeyDown=(e, index)=> {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }
    const handlePaste=(e)=> {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        pasteData.split('').forEach((char, idx) => {
            if (inputRefs.current[idx]) {
                inputRefs.current[idx].value = char;
            }
        });
        if (pasteData.length < 6) {
            inputRefs.current[pasteData.length].focus();
        } else {
            inputRefs.current[5].focus();
        }
    }
    const onSubmitHandler=async (e)=> {
       try {
           e.preventDefault();
              const otp = inputRefs.current.map(e => e.value).join('');
              // You can now use the otp variable to send to your backend for verification
           const {data}=await axios.post(backendUrl + '/api/auth/verify-account',{otp})
              if(data.success){
                toast.success(data.message);
                await getUserData();
                navigate('/');
              }
              else{
                  toast.error(data.message);
              }
       }
       catch (e) {
                toast.error(e.message);
       }

    }
    useEffect(() => {
        if (isLoggedin && userData) {
            if (userData.isAccountVerified) {
                navigate('/');
            }
        }
    }, [isLoggedin, userData]);

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' alt='' />
            <form onSubmit={onSubmitHandler}
                className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email verify otp</h1>
                <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email</p>
                <div className='flex justify-between mb-8'>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <input
                            type='text'
                            maxLength={1}
                            key={index}
                            required
                            className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-2xl'
                            ref={(e)=>inputRefs.current[index] = e}
                            onInput={(e)=> handleInput(e, index)}
                            onKeyDown={(e)=> handleKeyDown(e, index)}
                            onPaste={(e)=> handlePaste(e, index)}
                        />
                    ))}
                </div>
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Verify Email</button>
            </form>
        </div>
    );
};

export default EmailVerify;
