const axios = require('axios');

// Replace with your Canvas API endpoint and access token
const apiBaseUrl = 'https://YOUR-INSTITUTION-HERE.instructure.com/api/v1';
const accessToken = 'YOUR-ACCESS-TOKEN-HERE';

// Course ID and assignment name
const courseId = YOUR-COURSE-ID-HERE; // CREA 202
// const assignmentName = 'Academic Honesty 🎓 - Quiz';
// const assignmentName = 'Syllabus, Orientation, and Onboarding - Quiz';
// const assignmentName = 'Who I Am';
// const assignmentName = '1.6 Chapter 1 Assessment';
const assignmentName = '1.7 Chapter 1 - Share Your Song';

// API endpoint to get a list of courses
const coursesEndpoint = `${apiBaseUrl}/courses`;

// API endpoint to get assignments in the course
const assignmentsEndpoint = `${apiBaseUrl}/courses/${courseId}/assignments`;

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
        late_policy_status: 'none',
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
    console.error(`Request error: ${error.message}`);
  }
}

async function getAssignmentGrades() {
  try {
    // Get the list of assignments in the course
    const response = await axios.get(assignmentsEndpoint, { headers });

    // Check for a successful response (status code 200)
    if (response.status === 200) {
      const assignmentsData = response.data;

      // Find the assignment with the specified name
      const assignment = assignmentsData.find(
        (assign) => assign.name === assignmentName
      );

      if (assignment) {
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
        for (const submission of gradesData) {
          updateAssignmentGrade(assignment.id, submission.user_id);
        }
      } else {
        console.error(
          `Assignment "${assignmentName}" not found in the course.`
        );
      }
    } else {
      console.error(
        `Error fetching assignments: ${response.status} - ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(`Request error: ${error.message}`);
  }
}

// Call the async function to get courses and their corresponding ID's
// getCourses();

// Call the async function to get assignment grades
getAssignmentGrades();
