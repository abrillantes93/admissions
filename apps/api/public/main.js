document.addEventListener('DOMContentLoaded', function () {
    // Event listener for submitting the student data form
    document.getElementById('studentForm').addEventListener('submit', function (event) {
        event.preventDefault();  // Prevent the default form submission

        const formData = new FormData(this);
        const data = {};

        formData.forEach((value, key) => {
            if (key.startsWith('preferences')) {
                const preferenceKey = key.split('[')[1].split(']')[0];
                if (!data.preferences) data.preferences = {};
                data.preferences[preferenceKey] = value;
            } else {
                data[key] = value;
            }
        });

        // Send the data via fetch to the server
        fetch('/submit-student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Student data submitted successfully!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an error submitting the data');
            });
    });

    // Event listener for submitting the student search form
    document.getElementById('studentSearchForm').addEventListener('submit', function (event) {
        event.preventDefault();  // Prevent the default form submission

        const studentName = document.getElementById('studentName').value;

        // Send the student's name to the server to fetch matched colleges
        fetch(`/match-student?name=${encodeURIComponent(studentName)}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.matchedColleges.length > 0) {
                    const collegeList = document.getElementById('collegeList');
                    collegeList.innerHTML = ''; // Clear previous results

                    // List matched colleges
                    data.matchedColleges.forEach(college => {
                        const li = document.createElement('li');
                        li.textContent = `${college.name} (${college.properties.location})`;
                        collegeList.appendChild(li);
                    });
                } else {
                    alert('No matching colleges found.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error finding the student or matching colleges.');
            });
    });
});
