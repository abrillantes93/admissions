'use client';

import React from 'react';

interface Student {
    name: string;
    preferences: {
        location: string;
    };
}

interface StudentListProps {
    students: Student[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
    if (!students || students.length === 0) {
        return <p>No students found</p>;
    }

    return (
        <ul className="mt-2">
            {students.map((student, index) => (
                <li key={index} className="py-2 border-b border-gray-200">
                    {student.name} ({student.preferences.location || 'No location specified'})
                </li>
            ))}
        </ul>
    );
};

export default StudentList;
