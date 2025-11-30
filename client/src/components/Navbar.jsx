import React, {useContext} from 'react';
import {assets} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";
import {AppContent} from "../context/AppContext.jsx";

const Navbar = () => {
    const{isLoggedin,logoutUser}=useContext(AppContent)
    const navigate=useNavigate()
    return (
        <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
            <img src={assets.logo} alt="" className='w-28 sm:w-32'/>
            {isLoggedin?<button  onClick={logoutUser} className='flex items-center gap-2 border border-black rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>
                Logout<img src={assets.arrow_icon}/></button>
                :<button  onClick={()=>navigate('/login')} className='flex items-center gap-2 border border-black rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>
                login<img src={assets.arrow_icon}/></button>}
        </div>
    );
};

export default Navbar;