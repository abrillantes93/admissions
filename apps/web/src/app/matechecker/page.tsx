'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Nav';
import MatchStudent from '../components/MatchStudentForm';
import AddStudent from '../components/AddStudent';
import StudentList from '../components/StudentList';
import CollegeList from '../components/CollegeList';

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

    const [isLoadingStudents, setLoadingStudents] = useState(true);
    const [isLoadingColleges, setLoadingColleges] = useState(true);
    const [error, setError] = useState<string>('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    // Fetch students
    const fetchStudents = useCallback(async () => {
        try {
            setLoadingStudents(true);
            const response = await fetch(`${apiUrl}/students`);
            if (!response.ok) {
                throw new Error('Failed to fetch students');
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

    // Fetch colleges
    const fetchColleges = useCallback(async () => {
        try {
            setLoadingColleges(true);
            const response = await fetch(`${apiUrl}/colleges`);
            if (!response.ok) {
                throw new Error('Failed to fetch colleges');
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

    // Run both fetch operations on component mount
    useEffect(() => {
        fetchStudents();
        fetchColleges();
    }, [fetchStudents, fetchColleges]);

    // Show loading indicators if data is still being fetched
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

            {error && <p className="text-red-500">{error}</p>}

            {/* 
              Use a flex container (or grid) to place the CollegeList on the left
              and the StudentList on the right.
            */}
            <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                    <CollegeList colleges={colleges} />
                </div>
                <div>
                    <StudentList students={students} />
                </div>
            </div>


            {/* Add a new student (re-fetch after successful add) */}
            <AddStudent onStudentAdded={fetchStudents} />

            {/* Match a student to a college */}
            <MatchStudent />
        </div>
    );
};

export default Matechecker;
