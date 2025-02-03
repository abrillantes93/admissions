'use client'

import MatchStudent from '../components/MatchStudentForm';
import AddStudent from '../components/AddStudent';
import Navbar from '../components/Nav';
import { useState, useEffect, useCallback } from 'react';

interface Student {
    name: string;
    preferences: { location: string };
}

interface College {
    name: string;
    properties: { location: string };
}

const Matechecker = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);

    // Separate loading states
    const [isLoadingStudents, setLoadingStudents] = useState(true);
    const [isLoadingColleges, setLoadingColleges] = useState(true);

    // For error messages (optional)
    const [error, setError] = useState<string>('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Ensure this is correctly set in your .env file

    // 1. Define a function to fetch students
    const fetchStudents = useCallback(async () => {
        try {
            setLoadingStudents(true);
            const response = await fetch(`${apiUrl}/students`);
            if (!response.ok) {
                throw new Error('Failed to fetch students.');
            }
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            console.error('Failed to fetch students:', err);
            setError('Failed to load students.');
        } finally {
            setLoadingStudents(false);
        }
    }, [apiUrl]);

    // 2. Define a function to fetch colleges
    const fetchColleges = useCallback(async () => {
        try {
            setLoadingColleges(true);
            const response = await fetch(`${apiUrl}/colleges`);
            if (!response.ok) {
                throw new Error('Failed to fetch colleges.');
            }
            const data = await response.json();
            setColleges(data);
        } catch (err) {
            console.error('Failed to fetch colleges:', err);
            setError('Failed to load colleges.');
        } finally {
            setLoadingColleges(false);
        }
    }, [apiUrl]);

    // Fetch both students and colleges on component mount
    useEffect(() => {
        fetchStudents();
        fetchColleges();
    }, [fetchStudents, fetchColleges]);

    // If either is still loading, show a loading screen
    if (isLoadingStudents || isLoadingColleges) {
        return (
            <div>
                <h1>Student Data Management</h1>
                <Navbar />
                {isLoadingStudents && <p>Loading students...</p>}
                {isLoadingColleges && <p>Loading colleges...</p>}
            </div>
        );
    }

    return (
        <div>
            <h1>Student Data Management</h1>
            <Navbar />

            {/* Display any error messages */}
            {error && <p className="text-red-500">{error}</p>}

            <h2>Students</h2>
            <ul className="mt-2">
                {students.length > 0 ? (
                    students.map((student, index) => (
                        <li key={index} className="py-2 border-b border-gray-200">
                            {student.name} (
                            {student.preferences.location || 'No location specified'})
                        </li>
                    ))
                ) : (
                    <li>No students found</li>
                )}
            </ul>

            <h2>Colleges</h2>
            <ul className="mt-2">
                {colleges.length > 0 ? (
                    colleges.map((college, index) => (
                        <li key={index} className="py-2 border-b border-gray-200">
                            {college.name} (
                            {college.properties.location || 'No location specified'})
                        </li>
                    ))
                ) : (
                    <li>No colleges found</li>
                )}
            </ul>

            {/* 
        Pass `fetchStudents` to AddStudent so that after adding 
        a student, you can re-fetch (update) the student list.
      */}
            <AddStudent onStudentAdded={fetchStudents} />

            {/* If your MatchStudent component needs data or 
          a callback, you can pass it in here as props */}
            <MatchStudent />
        </div>
    );
};

export default Matechecker;
