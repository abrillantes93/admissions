'use client'
import { useState } from 'react';

const SubmitStudent = () => {
    const [studentName, setStudentName] = useState('');
    const [studentLocation, setStudentLocation] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    // Handle student data submission
    const handleSubmitStudent = async (event: React.FormEvent) => {
        event.preventDefault();

        const studentData = {
            name: studentName,
            preferences: { location: studentLocation },
        };

        // Use the environment variable for the API URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${apiUrl}/api/submit-student`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData),
        });

        const data = await response.json();
        if (response.ok) {
            setStatusMessage('Student data submitted successfully!');
        } else {
            setStatusMessage('Error: ' + data.message);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">Submit Student Data</h2>

            <form onSubmit={handleSubmitStudent}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="preferences[location]"
                        value={studentLocation}
                        onChange={(e) => setStudentLocation(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Submit
                </button>
            </form>

            {/* Status Message */}
            {statusMessage && (
                <p className="mt-4 text-center text-sm font-semibold text-green-500">{statusMessage}</p>
            )}
        </div>
    );
};

export default SubmitStudent;
