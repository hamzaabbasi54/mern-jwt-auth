import React, {useContext} from 'react';
import {assets} from "../assets/assets.js";
import { useNavigate} from "react-router-dom";
import {AppContent} from "../context/AppContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";
const Login = () => {
    const navigate = useNavigate();
    const {backendUrl,setIsLoggedin} = useContext(AppContent);

    const [state,setState] = React.useState('signup')
    const[name, setName] = React.useState('')
    const[email, setEmail] = React.useState('')
    const[password, setPassword] = React.useState('')
    const[isLoading, setIsLoading] = React.useState(false);

    const onSubmitHandler= async(e)=>{

        try{
            axios.defaults.withCredentials = true;
            setIsLoading(true);
            e.preventDefault();
            if (state==='signup'){
                const {data}= await axios.post(backendUrl + '/api/auth/register',{name,email,password})
                if(data.success){
                    setIsLoggedin(true);
                    navigate('/')
                                    }
                else{
                    toast.error(data.message)
                }
            }
            else{
                const {data}= await axios.post(backendUrl + '/api/auth/login',{email,password})
                if(data.success){
                    setIsLoggedin(true);
                    navigate('/')
                }
                else{
                    toast.error(data.message)
                }
            }
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
        finally {
            setIsLoading(false);
        }

    }

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img onClick={()=>navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' alt=""/>
            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96
            text-indigp-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state==='signup'?'Create account':'Login '}</h2>
                <p className='text-center text-sm mb-6 text-white' >{state==='signup'?'Create your account':'Login to your account'}</p>

                <form onSubmit={onSubmitHandler} >
                    {state==='signup'&& (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5
                     rounded-full bg-[#333A5C]'>
                        <img src={assets.person_icon} alt=""/>
                <input
                    onChange={(e)=>setName(e.target.value)}
                    value={name}
                    className='bg-transparent outline-none '
                    type="text" placeholder="Full Name" required/>
            </div>)}

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5
                     rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt=""/>
                        <input onChange={(e)=>setEmail(e.target.value)}
                               value={email}
                               className='bg-transparent outline-none '
                               type="email" placeholder="Email id" required/>

                    </div>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5
                     rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt=""/>
                        <input
                            onChange={(e)=>setPassword(e.target.value)}
                            value={password}
                            className='bg-transparent outline-none '
                            type="password" placeholder="Password" required/>
                    </div>
                    <p onClick={()=>navigate('/resetpassword')} className='mb-4 text-white cursor-pointer'>Forget Password?</p>
                    <button
                        disabled={isLoading}
                        className=' text-white w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 '>
                        {isLoading?"Please wait":state}
                    </button>
                </form>
                {state==='signup'? ( <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{''}
                    <span onClick={()=> setState('login')} className='text-blue-400 cursor-pointer underline'>Login here</span></p>)
                    : (  <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{''}
                        <span onClick={()=> setState('signup')} className='text-blue-400 cursor-pointer underline'>Sign up</span></p>)}


            </div>
        </div>
    );
};

export default Login;