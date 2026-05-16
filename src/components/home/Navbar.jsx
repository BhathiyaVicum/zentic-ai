const Navbar = () => {
    return (
        <nav className="fixed w-full z-50  backdrop-blur-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                <a href="/" className="flex items-center gap-1">
                    <h1 className="text-2xl font-bold text-primary-text">
                        Zentic<span className="text-secondary-text">AI</span>
                    </h1>
                </a>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#" className="text-secondary-text hover:text-brand-hover transition duration-300 active:text-primary-text text-lg">Home</a>
                    <a href="#" className="text-secondary-text hover:text-brand-hover transition duration-300 active:text-primary-text text-lg">Features</a>
                    <a href="#" className="text-secondary-text hover:text-brand-hover transition duration-300 active:text-primary-text text-lg">Pricing</a>
                    <a href="#" className="text-secondary-text hover:text-brand-hover transition duration-300 active:text-primary-text text-lg">FAQ</a>
                </div>

                <div className="flex items-center gap-1">
                    <button className="px-4 py-2 text-lg font-normal text-primary-text hover:text-secondary-text duration-300 transition">
                        Login
                    </button>
                    <button className="px-4 py-1 text-lg font-normal bg-btn-primary rounded-lg text-white hover:opacity-80 transition duration-300">
                        Sign up
                    </button>

                    <button className="md:hidden p-2 text-primary-text">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;