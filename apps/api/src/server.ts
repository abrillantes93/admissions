import { json, urlencoded } from "body-parser";
import express, { type Express, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import fs from 'fs';
import path from 'path';
import axios from "axios";

interface StudentData {
  name: string;
  preferences: {
    location: string;
  }
}

interface CollegeData {
  name: string;
  properties: {
    location: string;
    // programs: string[]; // Array of programs
  }
}

const apiKey = "CmZ4GmhSXYMPZEJPXxG1jUdX5Gwv4u4zAv67qdgS";  // Your API key

export const createServer = (): Express => {
  const app = express();

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use(express.static(path.join(__dirname, '../public')))
    .get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'index.html'));
    })
    .get("/message/:name", (req, res) => {
      return res.json({ message: `Hello ${req.params.name}` });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .get('/colleges', async (req: Request, res: Response) => {
      const { state, city } = req.query; // Extract state and city from query parameters

      if (!state) {
        return res.status(400).send("State parameter is required.");
      }

      let page = 1;
      let allColleges: any[] = [];
      let morePages = true;

      try {
        // Prepare query parameters in the correct format
        const params: any = {
          api_key: apiKey,
          _fields: "id,school.name,school.state,school.city,academics.program_reporter.programs_offered", // Fields to include in response
          "school.state": state,
          per_page: 100, // Number of results per page
        };

        if (city) {
          params["school.city"] = city;
        }

        // Loop through pages until all data is retrieved
        while (morePages) {
          params.page = page; // Set the page number for each request
          const response = await axios.get(
            `https://api.data.gov/ed/collegescorecard/v1/schools`, { params }
          );

          const colleges = response.data.results;
          // Defensive check to ensure `school` and `school.name` exist
          // colleges.forEach((college: any) => {
          //   if (college.school && college.school.name) {
          //     console.log(`College: ${college.school.name}`);
          //     console.log(`Academics: ${college.academics ? college.academics.program_reporter.programs_offered : 'No CIPTITLE1 available'}`);
          //   } else {
          //     console.warn("Missing school data for college:", college);
          //   }
          // });

          allColleges = allColleges.concat(colleges); // Append the current page's data

          if (colleges.length < 100) {
            morePages = false; // No more pages, we have all results
          } else {
            page++; // Move to the next page
          }
        }

        // Return all the results
        return res.json(allColleges);

      } catch (error) {
        console.error("Error fetching data from API: ", error);
        return res.status(500).send("Error fetching colleges data");
      }
    })
    .get('/match-student', (req, res) => {
      const { name } = req.query;

      if (!name) {
        return res.status(400).send('Student name is required.');
      }

      const studentDataFile = path.join(__dirname, 'student-data.json');
      const collegeDataFile = path.join(__dirname, 'college-data.json');

      // Read the student data from the JSON file
      fs.readFile(studentDataFile, 'utf8', (err, studentData) => {
        if (err) return res.status(500).send('Error reading student data');

        let students = [];
        try {
          students = JSON.parse(studentData);
        } catch (parseError) {
          return res.status(500).send('Error parsing student data');
        }

        // Find the student based on the name
        const student = students.find(student => student.name.toLowerCase() === name.toLowerCase());

        if (!student) {
          return res.status(404).send('Student not found');
        }

        // Read the college data from the JSON file
        fs.readFile(collegeDataFile, 'utf8', (err, collegeData) => {
          if (err) return res.status(500).send('Error reading college data');

          let colleges = [];
          try {
            colleges = JSON.parse(collegeData);
          } catch (parseError) {
            return res.status(500).send('Error parsing college data');
          }

          // Match the student with colleges based on location
          const matchedColleges = colleges.filter(college =>
            college.properties.location.toLowerCase() === student.preferences.location.toLowerCase()
          );

          // Return matched colleges
          res.json({ student, matchedColleges });
        });
      });
    })
    .post('/new-student', (req: Request, res: Response) => {
      const studentData: StudentData = req.body; // Data sent in body of the request

      // File path for JSON file
      const filePath = path.join(__dirname, 'student-data.json');

      // Read existing data from JSON file
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return res.status(500).send('Internal server error');
        }

        let currentData: StudentData[] = [];
        if (data) {
          try {
            currentData = JSON.parse(data); // Parse existing data if available
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing stored data');
          }
        }

        // Add new student data to array
        currentData.push(studentData);

        // Write updated data back to the file
        fs.writeFile(filePath, JSON.stringify(currentData, null, 2), (err) => {
          if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Internal server error');
          }
          return res.status(200).send('Student record added successfully');
        });
      });
    })
    .post('/submit-student', (req, res) => {
      const studentData = req.body; // Get the student data from the request body
      const filePath = path.join(__dirname, 'student-data.json');

      // Read existing data from the JSON file
      fs.readFile(filePath, 'utf8', (err, data) => {
        let currentData = [];
        if (err && err.code !== 'ENOENT') {
          // If the file does not exist or other error occurs, respond with 500
          return res.status(500).send('Error reading file');
        }

        // Parse the existing data if the file exists
        if (data) {
          try {
            currentData = JSON.parse(data);
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing stored data');
          }
        }

        // Add the new student data to the array
        currentData.push(studentData);

        // Write the updated data back to the JSON file
        fs.writeFile(filePath, JSON.stringify(currentData, null, 2), (writeError) => {
          if (writeError) {
            console.error('Error writing to file:', writeError);
            return res.status(500).send('Error writing to file');
          }

          // Send a response indicating success
          res.json({ message: 'Student data saved successfully!' });
        });
      });
    })
    .post('/new-college', (req: Request, res: Response) => {
      const collegeData: CollegeData = req.body; // Data sent in body of the request

      // File path for JSON file
      const filePath = path.join(__dirname, 'college-data.json');

      // Read existing data from JSON file
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return res.status(500).send('Internal server error');
        }

        let currentData: CollegeData[] = [];
        if (data) {
          try {
            currentData = JSON.parse(data); // Parse existing data if available
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing stored data');
          }
        }

        // Add new college data to array
        currentData.push(collegeData);

        // Write updated data back to the file
        fs.writeFile(filePath, JSON.stringify(currentData, null, 2), (err) => {
          if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Internal server error');
          }
          return res.status(200).send('College record added successfully');
        });
      });
    });

  return app;
};
