import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaTimes, FaChevronDown, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

const DashboardNavbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate("/signin");
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="bg-brand-dark/50 backdrop-blur-lg border-b border-brand-light/20 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <h1 className="text-2xl font-bold text-primary-text">
                    Zentic<span className="text-secondary-text">AI</span>
                </h1>

                <div className="md:flex items-center gap-6">

                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-md font-body text-white border border-brand-light/20 ring-white/5 hover:bg-white/20 transition"
                        >
                            <FaUser className="size-4 me-1" />
                            Profile
                            <FaChevronDown className={`size-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setDropdownOpen(false)}
                                />
                                <div className="absolute right-0 z-20 mt-2 w-56 rounded-md bg-brand-dark shadow-lg border border-brand-light/20 focus:outline-none">
                                    <div className="py-1">
                                        <div className="px-4 py-2 text-sm text-gray-300 border-b border-white/10">
                                            <div className="font-medium truncate">{user?.email}</div>
                                        </div>
                                        <a
                                            href="#"
                                            className="block mt-1 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                                        >
                                            <FaCog className="inline-block mr-2" />
                                            Account settings
                                        </a>
                                        <button
                                            onClick={handleSignOut}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                                        >
                                            <FaSignOutAlt className="inline-block mr-2" />

                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;