import React, {useContext, useState} from 'react';
import {assets} from "../assets/assets.js";
import {AppContent} from "../context/AppContext.jsx";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const {isLoggedin, userData, sendVerifyOtp} = useContext(AppContent);
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyClick = async () => {
        setIsLoading(true);
        const success = await sendVerifyOtp();
        if (success) {
            console.log(success);
        } else {
            navigate('/emailverify');
        }
        setIsLoading(false); // Add this to reset loading state
    }

    return (
        <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
            <img src={assets.header_img}
                 alt="Profile header"
                 className='w-36 h-36 rounded-full mb-6'/>
            <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
                Hey {isLoggedin && userData ? userData.name : 'Developer'}
                <img src={assets.hand_wave} alt="Wave" className='w-8 aspect-square'/>
            </h1>
            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our app</h2>
            {isLoggedin && userData && !userData.isAccountVerified && (
                <>
                    <p className='mb-8 max-w-md'>Your email is not verified</p>
                    <button
                        disabled={isLoading}
                        onClick={handleVerifyClick}
                        className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>
                        {isLoading ? "Please wait" : "Click here to verify"}
                    </button>
                </>
            )}
        </div>
    );
};

export default Header;