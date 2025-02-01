import { json, urlencoded } from "body-parser";
import express, { type Express, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import fs from 'fs/promises'; // Use fs.promises for async/await
import path from 'path';
import axios from "axios";
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  }
}

const apiKey = process.env.API_KEY;  // Your API key
const authRoutes = require('./routes/auth');

let users = [
  { id: 1, username: 'testuser', password: '$2a$10$...' }, // hashed password
];

const SECRET_KEY = 'your-secret-key';


export const createServer = (): Express => {
  const app = express();

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(express.json())
    .use(cors({
      origin: 'http://localhost:3000', // Adjust according to your frontend server
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true, // Allow cookies to be sent across origins if using cookies
    }))
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
    .get('/match-student', async (req: Request, res: Response) => {
      const { name } = req.query;

      if (!name) {
        return res.status(400).send('Student name is required.');
      }

      const studentDataFile = path.join(__dirname, 'student-data.json');
      const collegeDataFile = path.join(__dirname, 'college-data.json');

      try {
        // Read student data
        const studentData = await fs.readFile(studentDataFile, 'utf8');
        const students: StudentData[] = JSON.parse(studentData);

        // Find the student based on the name
        const student = students.find(student => student.name.toLowerCase() === name.toLowerCase());

        if (!student) {
          return res.status(404).send('Student not found');
        }

        // Read college data
        const collegeData = await fs.readFile(collegeDataFile, 'utf8');
        const colleges: CollegeData[] = JSON.parse(collegeData);

        // Match the student with colleges based on location
        const matchedColleges = colleges.filter(college =>
          college.properties.location.toLowerCase() === student.preferences.location.toLowerCase()
        );

        // Return matched colleges
        res.json({ student, matchedColleges });

      } catch (error) {
        console.error("Error reading or parsing files:", error);
        return res.status(500).send("Error reading or parsing student/college data");
      }
    })
    .post('/submit-student', async (req: Request, res: Response) => {
      const studentData: StudentData = req.body; // Data sent in body of the request
      const filePath = path.join(__dirname, 'student-data.json');

      try {
        // Read existing student data
        let currentData: StudentData[] = [];
        try {
          const data = await fs.readFile(filePath, 'utf8');
          currentData = JSON.parse(data);
        } catch (err) {
          if (err.code !== 'ENOENT') throw err; // Only handle file not found error
        }

        // Add new student data to array
        currentData.push(studentData);

        // Write updated data back to the JSON file
        await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));

        res.json({ message: 'Student data saved successfully!' });

      } catch (error) {
        console.error('Error handling student data:', error);
        return res.status(500).send('Error saving student data');
      }
    })
    .post('/api/register', async (req: Request, res: Response) => { //move to 
      console.log("Register endpoint hit");
      try {
        const { username, password } = req.body;

        // Check if the username already exists
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
          return res.status(409).send({ message: 'Username already exists' });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { id: Date.now(), username, password: hashedPassword };
        users.push(newUser);

        // Generate a JWT token
        const token = jwt.sign({ userId: newUser.id, username: newUser.username }, SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ token, message: 'User registered successfully' });
      } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    })
    .post('/api/auth/login', async (req: Request, res: Response) => {
      const { username, password } = req.body;

      // Find the user by username
      const user = users.find((u) => u.username === username);
      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      // Compare the provided password with the stored hashed password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ token });
    })
    .post('/new-college', async (req: Request, res: Response) => {
      const collegeData: CollegeData = req.body; // Data sent in body of the request
      const filePath = path.join(__dirname, 'college-data.json');

      try {
        // Read existing college data
        let currentData: CollegeData[] = [];
        try {
          const data = await fs.readFile(filePath, 'utf8');
          currentData = JSON.parse(data);
        } catch (err) {
          if (err.code !== 'ENOENT') throw err; // Only handle file not found error
        }

        // Add new college data to array
        currentData.push(collegeData);

        // Write updated data back to the JSON file
        await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));

        res.json({ message: 'College data saved successfully!' });

      } catch (error) {
        console.error('Error handling college data:', error);
        return res.status(500).send('Error saving college data');
      }
    });

  return app;
};
