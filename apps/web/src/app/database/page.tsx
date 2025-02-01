import SearchStudent from '../components/SearchStudent';  // Import the SearchStudent component
import AddStudent from '../components/AddStudent'; // Import the SubmitStudent component
import Navbar from '../components/Nav';
const Home = () => {


    return (
        <div>
            <h1>Student Data Management</h1>
            <Navbar />
            {/* Student Data Submission Form */}
            <AddStudent />

            {/* Search for Student Form */}
            <SearchStudent />
        </div>
    );
};

export default Home;
