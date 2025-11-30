import React from "react";
import {createContext, useState,useEffect} from "react";
import axios from "axios";
import {toast} from "react-toastify";
export const AppContent = createContext();

export const AppContextProvider = (props)=>{

        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const [isLoggedin, setIsLoggedin] = useState(false);
        const [userData, setUserData] = useState(null);


    // Configure axios to send cookies
    axios.defaults.withCredentials = true;

    const getUserData = async () => {
        try {
            // Correct: lowercase 'data' matches axios response property
            const { data } = await axios.get(backendUrl + '/api/user/data');

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            // In catch block, use error.response.data or generic message
            toast.error(error.response?.data?.message || 'Failed to fetch user data');
        }
    }

    const logoutUser = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/logout');
            if (data.success) {
                setIsLoggedin(false);
                setUserData(null);
                toast.success('Logged out successfully');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    }

    const sendVerifyOtp = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
            if (data.success) {
                toast.success('OTP sent to your email');
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
            return false;
        }
    }




    useEffect(() => {
        const checkAuth = async () => {
            try {

                const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
                if (data.success) {
                    setIsLoggedin(true);
                    await getUserData();
                } else {
                    setIsLoggedin(false);
                    setUserData(null);
                }
            }
            catch (error) {
                setIsLoggedin(false);
                setUserData(null);
            }
        };
        checkAuth();
    }, []);

        const value={
            backendUrl,
            isLoggedin,setIsLoggedin,
            userData,setUserData,getUserData,logoutUser,sendVerifyOtp
        }
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}