'use client';
import { useState, useEffect } from 'react';

const MatchStudent = () => {
    const [studentName, setStudentName] = useState('');
    const [matchedColleges, setMatchedColleges] = useState<any[]>([]);
    const [statusMessage, setStatusMessage] = useState('');


    // Handle student search and college match
    const handleMatchStudent = async (event: React.FormEvent) => {
        event.preventDefault();

        // Use the environment variable for the API URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${apiUrl}/match-student?name=${encodeURIComponent(studentName)}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use the token in the request
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (response.ok) {
            setMatchedColleges(data.matchedColleges);
        } else {
            setStatusMessage(data.message || 'No matching colleges found.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">Match Student</h2>

            <form onSubmit={handleMatchStudent}>
                <div className="mb-4">
                    <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">
                        Enter Student Name
                    </label>
                    <input
                        type="text"
                        id="studentName"
                        name="studentName"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Match Student
                </button>
            </form>

            {/* Display Matched Colleges */}
            <h3 className="text-xl font-medium mt-6">Matched Colleges:</h3>
            <ul className="mt-2">
                {matchedColleges.length > 0 ? (
                    matchedColleges.map((college: any, index: number) => (
                        <li key={index} className="py-2 border-b border-gray-200">
                            {college.name} ({college.properties ? college.properties.location : 'No location specified'})
                        </li>
                    ))
                ) : (
                    <li>No colleges found</li>
                )}
            </ul>

            {/* Display status message */}
            {statusMessage && (
                <p className="mt-4 text-center text-sm font-semibold text-red-500">{statusMessage}</p>
            )}
        </div>
    );
};

export default MatchStudent;
