import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(true);

    const showNavbar = !(location.pathname === '/login' || location.pathname === '/register');

    useEffect(() => {
        const checkLoggedIn = () => {
            if (localStorage.getItem("usertoken")) setLoggedIn(true);
            else setLoggedIn(false);
        }
        checkLoggedIn();
    }, []);

    const links = [
        {
            id: 1,
            name: "Home",
            path: "/",
        },
        {
            id: 2,
            name: "Todo",
            path: "/todo",
        }
    ]

    return (
        <>
            {showNavbar ?
                <div className="w-full h-16 top-0 shadow-lg flex justify-between items-center p-2">
                    <a href='/' className="logo cursor-pointer">Logo</a>

                    <div className="links flex gap-4 justify-center items-center">
                        {links.map((l) => (
                            <Link key={l.id} to={l.path} className="hover:underline text-blue-500 text-xl ">{l.name}</Link>
                        ))}
                    </div>

                    <div className='login/signout'>
                        {loggedIn ?
                            <a href='/login' className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white" onClick={() => localStorage.removeItem("usertoken")}>Signout</a>
                            :
                            <a href='/login' className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white" >Login</a>
                        }
                    </div>
                </div>
                :

                <></>
            }
        </>
    )
}

export default Navbar
