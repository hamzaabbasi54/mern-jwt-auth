import React, {useContext, useEffect, useState} from 'react';
import {assets} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";
import {AppContent} from "../context/AppContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";

const ResetPassword = () => {

    const navigate = useNavigate();
    const{backendUrl} = useContext(AppContent);
    axios.defaults.withCredentials= true;
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false); // Change '' to false
    const [otp, setOtp] = useState(0);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

    const inputRefs = React.useRef([]);
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
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitEmail=async(e)=>{
        e.preventDefault()
        try{
            setIsLoading(true);
            const {data}=await axios.post(backendUrl + '/api/auth/send-reset-otp',{email})
            if(data.success){
                toast.success(data.message)
                setIsEmailSent(true);
            }
            else{
                toast.error(data.message);
            }
        }
        catch (error){

            toast.error(error.response?.data?.message || 'Failed to send OTP');
        }
        finally {
            setIsLoading(false); // Always reset loading state
        }
    }
    const onSubmitOtp=async(e)=> {
        e.preventDefault();
        try{
            const otpArray = inputRefs.current.map(e => e.value);
            setOtp(otpArray.join(''))
            setIsLoading(true);
            setIsOtpSubmitted(true);
        }
        catch (error){
            toast.error('Failed to submit OTP');
        }finally {
            setIsLoading(false);
        }

    }

    const onSubmitNewPassword=async(e)=>{
        e.preventDefault();
        try{
            setIsLoading(true);
            const {data}=await axios.post(backendUrl + '/api/auth/reset-password',{email, otp, newPassword})
            if(data.success){
                toast.success(data.message)
                navigate('/login');
            }
            else{
                toast.error(data.message);
            }
        }
        catch (error){

            toast.error(error.response?.data?.message || 'Failed to reset password');
        }
        finally {
            setIsLoading(false); // Always reset loading state
        }
    }
    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={() => navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' alt='' />

            {/*email input form for sending otp*/}
            {!isEmailSent &&
            <form onSubmit={onSubmitEmail}
                className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset password</h1>
                <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img src={assets.mail_icon} alt="" className='w-3 h-3'/>
                    <input type="email" placeholder='Email id'
                    className='bg-transparent outline-none text-white' onChange={(e)=>{setEmail(e.target.value)}}
                    value={email} required/>
                </div>
                <button
                disabled={isLoading}
                    className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>{isLoading?"Please Wait":"Send Reset Link"}</button>
            </form>}

            {/*otp input form for resetting pasword*/}
            {isEmailSent && !isOtpSubmitted &&
            <form onSubmit={onSubmitOtp}
                  className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>reset password otp</h1>
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
                <button
                    disabled={isLoading}
                    className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
                    {isLoading?"please wait":"Submit"}</button>
            </form>}

            {/* enter new password*/}
            {isEmailSent && isOtpSubmitted &&
            <form onSubmit={onSubmitNewPassword}
                className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset password</h1>
                <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                    <img src={assets.mail_icon} alt="" className='w-3 h-3'/>
                    <input type="password" placeholder='New Password'
                           className='bg-transparent outline-none text-white' onChange={(e)=>{setNewPassword(e.target.value)}}
                           value={newPassword} required/>
                </div>
                <button
                    disabled={isLoading}
                    className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
                    {isLoading?"Please wait":"submit"}</button>
            </form>}
        </div>
    );
};

export default ResetPassword;