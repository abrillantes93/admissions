'use client';

import React from 'react';

interface Student {
    name: string;
    preferences: { location: string };
}

interface StudentListProps {
    students: Student[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
    return (
        <>
            <h2>Students</h2>
            <ul className="mt-2">
                {students.length > 0 ? (
                    students.map((student, index) => (
                        <li key={index} className="py-2 border-b border-gray-200">
                            {student.name} (
                            {student.preferences.location || 'No location specified'}
                            )
                        </li>
                    ))
                ) : (
                    <li>No students found</li>
                )}
            </ul>
        </>
    );
};

export default StudentList;
