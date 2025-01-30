// Read the Docs: https://canvas.instructure.com/doc/api/submissions.html
const axios = require('axios');

// Replace with your Canvas API endpoint and access token
const apiBaseUrl = 'https://YOUR-INSTITUTION-HERE.instructure.com/api/v1';
const accessToken = 'YOUR-ACCESS-TOKEN-HERE';

// Course ID and assignment name
const courseId = YOUR - COURSE - ID - HERE; // CREA 202

const assignmentNames202 = [
  'Academic Honesty 🎓 - Quiz',
  'Syllabus, Orientation, and Onboarding - Quiz',
  'Who I Am (OPTIONAL, UNGRADED)',
  '1.6 Chapter 1 Assessment',
  '1.7 Chapter 1 - Share Your Song',
  '2.6 Chapter 2 Assessment',
];

const assignmentNames330 = [
  'Academic Honesty - Quiz',
  'Syllabus, Orientation, and Onboarding - Quiz',
  'Who I Am - Assignment (OPTIONAL, UNGRADED)',
  '1.1 Pre-Lecture Quiz',
  '1.1 Post-Lecture Quiz',
  '1.1 Assignment - Reading the Docs',
  '1.2 Pre-Lecture Quiz',
  '1.2 Post-Lecture Quiz',
  '1.2 Assignment - Introduction to GitHub',
  '1.3 Pre-Lecture Quiz',
  '1.3 Post-Lecture Quiz',
  '1.3 Assignment - Analyze an Inaccessible Website',
  'Module 1 Quiz',
  'Module 1 Project - Custom Video Player 📺 - Video Submission',
  'Module 1 Project - Custom Video Player 📺 - URL Submission',
  '2.1 Pre-Lecture Quiz',
  '2.1 Post-Lecture Quiz',
  '2.1 Quiz - Shopping Cart Data Types',
  '2.2 Pre-Lecture Quiz',
  '2.2 Post-Lecture Quiz',
  '2.2 Quiz - Create Functions',
];

const assignmentNames391 = [
  'Academic Honesty 🎓 - Quiz',
  'Syllabus, Orientation, and Onboarding - Quiz',
  'Who I Am (OPTIONAL, UNGRADED)',
  '1.1.1 Assessment - History of Game Development',
  '1.1.2 Assessment - History of Video Game Technology',
  '1.1.3 Assessment - Evolution of the Game Industry',
  '1.1.4 Assessment - Exploring Non-Digital Games',
  '1.1.5 Assessment - Exploring Video Game Genres',
  '1.1.6 Assessment - Iconic Video Game Designers and Developers',
  'Getting Acquainted with GameMaker Studio - Quiz',
  'Getting Acquainted with GameMaker - Video Submission',
  'Designing Good Games by Mark Overmars - Quiz',
  'The Foundations of Good Game Design by Mark Alexander - Quiz',
  '1.2 Assessment - Industry Terminology',
  'Level 01, Lesson 01 - Moving Around - Quiz',
  'Level 01, Lesson 02 - Shooting Stuff - Quiz',
  'Level 01, Lesson 03 - Collisions - Quiz',
  'Level 01, Lesson 04 - Parenting Smaller Asteroids - Quiz',
  'Level 01, Lesson 05 - Score Tracking - Quiz',
  '1.3.0 Game Theory Quiz 1',
  '1.3.1 Strategic Decision Making Quiz 1',
  '1.3.2 Core Components of Game Theory Quiz 1',
  '1.3.3 Game Theory Examples in Video Games Quiz 1',
  'Level 01, Lesson 06 - Sound Effects - Quiz',
  'Level 01, Lesson 07 - Spawners - Quiz',
  'Level 01, Lesson 08 - Dying - Quiz',
  'Level 01, Lesson 09 - Game Over - Quiz',
  'Level 01, Lesson 10 - Lives and Respawning - Quiz',
  'Level 01, Lesson 11 - Invincibility with Alarms - Quiz',
];

// API endpoint to get a list of courses
const coursesEndpoint = `${apiBaseUrl}/courses`;

// Set up headers with the access token
const headers = {
  Authorization: `Bearer ${accessToken}`,
};

async function getCourses() {
  try {
    const response = await axios.get(coursesEndpoint, { headers });

    // Check for a successful response (status code 200)
    if (response.status === 200) {
      const coursesData = response.data;
      coursesData.forEach((course) => {
        console.log(`Course Name: ${course.name}, ID: ${course.id}`);
      });
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Request error: ${error.message}`);
  }
}

async function getUserInfo(userId) {
  try {
    const userEndpoint = `${apiBaseUrl}/users/${userId}`;
    const response = await axios.get(userEndpoint, { headers });

    if (response.status === 200) {
      const userData = response.data;
      return `${userData.first_name} ${userData.last_name}`;
    } else {
      console.error(
        `Error fetching user info for ID ${userId}: ${response.status} - ${response.statusText}`
      );
      return '';
    }
  } catch (error) {
    console.error(
      `Request error in getUserInfo for ID ${userId}: ${error.message}`
    );
    return '';
  }
}

async function updateAssignmentGrade(assignmentId, userId) {
  try {
    // API endpoint to update the assignment submission
    const submissionEndpoint = `${apiBaseUrl}/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}`;

    // Define the data for updating the grade
    const updateData = {
      submission: {
        // posted_grade: null, // Set the grade to null to mark as excused
        // excuse: true, // Mark the submission as excused
        late_policy_status: 'none',
      },
      comment: {
        text_comment: 'Late penalty removed.',
      },
    };

    // Make a PUT request to update the grade
    const response = await axios.put(submissionEndpoint, updateData, {
      headers,
    });

    if (response.status === 200) {
      console.log(`Successfully updated grade for user ID ${userId}.`);
    } else {
      console.error(
        `Error updating grade: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(`updateAssignmentGrade -> Request error: ${error.message}`);
  }
}

async function getAssignmentGrades(assignmentName) {
  try {
    // API endpoint to get assignments in the course, accounting for pagination (1 page assumed, 100 per page)
    let page = 1;
    let assignmentsData = [];
    let pageAssignments = [];

    do {
      const assignmentsEndpoint = `${apiBaseUrl}/courses/${courseId}/assignments?page=${page}&per_page=100`;
      // Get the list of assignments in the course
      const assignmentsResponse = await axios.get(assignmentsEndpoint, {
        headers,
      });
      // Check for a successful assignmentsResponse (status code 200)
      if (assignmentsResponse.status === 200) {
        // console.log(assignmentsResponse.status);
        pageAssignments = assignmentsResponse.data;
        assignmentsData = assignmentsData.concat(pageAssignments);
        page++;
        // console.log('Number of assignments:', assignmentsData.length);
      } else {
        console.error(
          `Error fetching assignments: ${response.status} - ${response.statusText}`
        );
      }
    } while (pageAssignments.length >= 100);

    // Find the assignment with the specified name
    const assignment = assignmentsData.find(
      (assign) => assign.name === assignmentName
    );

    if (assignment) {
      // console.log(`found ${assignment.name}`);
      // Get grades for the assignment with pagination
      let page = 1;
      let gradesData = [];

      while (true) {
        const gradesEndpoint = `${apiBaseUrl}/courses/${courseId}/assignments/${assignment.id}/submissions?page=${page}&per_page=100`;
        const gradesResponse = await axios.get(gradesEndpoint, { headers });

        if (gradesResponse.status === 200) {
          const pageGrades = gradesResponse.data;
          gradesData = gradesData.concat(pageGrades);

          // Check if there are more pages of data
          if (pageGrades.length < 100) {
            break; // All data retrieved
          }

          page++;
        } else {
          console.error(
            `Error fetching grades: ${gradesResponse.status} - ${gradesResponse.statusText}`
          );
          break;
        }
      }

      // Process and display the grades
      // If any submission is late (due_at < submitted_at), update the grade
      for (const submission of gradesData) {
        // console.log(submission);
        // Can use points_deducted or late
        if (submission.late > 0) {
          console.log('Late submission detected via late property.');
          await updateAssignmentGrade(assignment.id, submission.user_id);
        }
      }
    } else {
      console.error(`Assignment "${assignmentName}" NOT found in the course.`);
    }
  } catch (error) {
    console.error(`getAssignmentGrades -> Request error: ${error.message}`);
  }
}

// Call the async function to get courses and their corresponding ID's
// getCourses();

// Call the async function to get assignment grades
assignmentNames391.forEach((assignmentName) => {
  getAssignmentGrades(assignmentName);
});
