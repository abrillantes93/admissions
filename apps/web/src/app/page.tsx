import SearchStudent from './components/SearchStudent';  // Import the SearchStudent component
import SubmitStudent from './components/AddStudent';  // Import the SubmitStudent component
import Login from './components/Login';

const Home = () => {
    return (
        <div>
            <h1>Student Data Management</h1>

            <Login />

            {/* Student Data Submission Form */}
            <SubmitStudent />

            {/* Search for Student Form */}
            <SearchStudent />
        </div>
    );
};

export default Home;
