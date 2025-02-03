'use client'

import MatchStudent from '../components/MatchStudent';
import AddStudent from '../components/AddStudent';
import Navbar from '../components/Nav';
import { useState, useEffect, useCallback } from 'react';

interface Student {
    name: string;
    preferences: { location: string };
}

const Matechecker = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setLoading] = useState(true);

    // 1. Define a function to fetch students
    const fetchStudents = useCallback(async () => {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${apiUrl}/students`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // 2. Pass `fetchStudents` as a prop to AddStudent
    return (
        <div>
            <h1>Student Data Management</h1>
            <Navbar />

            {isLoading ? (
                <p>Loading students...</p>
            ) : (
                <>
                    <AddStudent onStudentAdded={fetchStudents} />

                    <ul className="mt-2">
                        {students.length > 0 ? (
                            students.map((student, index) => (
                                <li key={index} className="py-2 border-b border-gray-200">
                                    {student.name} (
                                    {student.preferences.location
                                        ? student.preferences.location
                                        : 'No location specified'}
                                    )
                                </li>
                            ))
                        ) : (
                            <li>No students found</li>
                        )}
                    </ul>
                </>
            )}

            <MatchStudent />
        </div>
    );
};

export default Matechecker;
