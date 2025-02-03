'use client';

import React from 'react';

interface College {
    name: string;
    properties: { location: string };
}

interface CollegeListProps {
    colleges: College[];
}

const CollegeList: React.FC<CollegeListProps> = ({ colleges }) => {
    return (
        <>
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
        </>
    );
};

export default CollegeList;
