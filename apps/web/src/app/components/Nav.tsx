import LogoutButton from "./buttons/LogoutButton"; // Adjust the path based on your file structure

const Navbar = () => {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <ul className="flex space-x-4">
                <li><a href="/">Login</a></li>
                <li><a href="/database">Database</a></li>
                <li><LogoutButton /></li>
            </ul>
        </nav>
    );
};

export default Navbar;
