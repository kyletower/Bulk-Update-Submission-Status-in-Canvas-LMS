import os
from dotenv import load_dotenv
import requests
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Canvas API configuration
API_URL = os.getenv("API_URL")
ACCESS_TOKEN = os.getenv("CANVAS_ACCESS_TOKEN")
# Date to compare submissions against
CUTOFF_DATE = datetime(
    2025, 9, 1, 23, 59, 59
)  # All assignments submitted late but prior to this cutoff will have the late penalty removed

# Function to get all pages of a resource
def get_all_pages(url, headers, params=None):
    print(f"👉 get_all_pages({url}, headers, params)")
    results = []
    while url:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        results.extend(response.json())

        # Check if there's a next page
        url = response.links.get("next", {}).get("url")

    return results


# Function to get submissions for a course
def get_submissions(course_id, assignment_id):
    print("👉 get_submissions()")
    url = f"{API_URL}/courses/{course_id}/assignments/{assignment_id}/submissions"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    params = {
        "submitted_since": "2024-08-31T23:59:59Z", # 🔴 Refactor
        "include[]": "submission_history",
    }

    submissions = get_all_pages(url, headers, params)
    return submissions


# Function to update the late_policy_status
def update_late_policy_status(course_id, assignment_id, user_id, hours_late):
    print("👉 update_late_policy_status()")
    url = f"{API_URL}/courses/{course_id}/assignments/{assignment_id}/submissions/{user_id}"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    comment = (
        f"Late penalty ({hours_late} hours late) removed on {datetime.today().date()}."
    )
    data = {"submission[late_policy_status]": "none", "comment[text_comment]": comment}

    try:
        response = requests.put(url, headers=headers, data=data)
        response.raise_for_status()
        print(
            f"Updated late_policy_status for submission {user_id} in assignment {assignment_id}"
        )

    except requests.exceptions.HTTPError as e:
        if response.status_code == 404:
            print(
                f"Submission {user_id} or assignment {assignment_id} not found (404 error)."
            )
        else:
            print(
                f"Failed to update submission {user_id} in assignment {assignment_id}: {e}"
            )


# Main function to process submissions
def process_late_submissions(course_id):
    print("👉 process_late_submissions()")
    # Get all assignments in the course
    assignments_url = f"{API_URL}/courses/{course_id}/assignments"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}

    # Get all assignments with pagination
    assignments = get_all_pages(assignments_url, headers)

    for assignment in assignments:
        assignment_id = assignment["id"]
        due_at = assignment.get("due_at")

        if due_at:
            # Convert due_at to a datetime object if needed
            due_date = datetime.strptime(due_at, "%Y-%m-%dT%H:%M:%SZ")

        if due_date > CUTOFF_DATE:
            continue # assignment due after cutoff, skip

        submissions = get_submissions(course_id, assignment_id)

        for submission in submissions:
            submitted_at = submission.get("submitted_at")
            seconds_late = submission.get("seconds_late")
            hours_late = seconds_late / (60 * 60)
            late = submission.get("late")

            if submitted_at:
                # Check if the submission was late and before or on the cutoff date
                submission_date = datetime.strptime(
                    submission["submitted_at"], "%Y-%m-%dT%H:%M:%SZ"
                )
                if (
                    late or submission_date > due_date
                ) and submission_date <= CUTOFF_DATE:
                    user_id = submission["user_id"]

                    # Update the late_policy_status to 'none'
                    update_late_policy_status(
                        course_id, assignment_id, user_id, hours_late
                    )


def update_discussion_sorting(course_id):
    """
    Update discussion sorting to sort by rating
    Discontinued by Canvas LMS team in late 2022.
    """
    print("👉 update_discussion_sorting()")
    url = f"{API_URL}/courses/{course_id}/discussion_topics"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}

    # Get all discussions in the course
    discussions = get_all_pages(url, headers)

    for discussion in discussions:
        discussion_id = discussion["id"]

        if discussion["sort_by_rating"]:
            print(f"id: {discussion_id} already {discussion['sort_by_rating']}")
            continue

        update_url = f"{url}/{discussion_id}"
        data = {"sort_by_rating": True}

        try:
            response = requests.put(update_url, headers=headers, json=data)
            response.raise_for_status()
            print(f"Updated discussion {discussion_id} to sort by rating")
            response_data = response.json()
        except requests.exceptions.HTTPError as e:
            print(f"Failed to update discussion {discussion_id}: {e}")

        print(response_data["sort_by_rating"])


if __name__ == "__main__":
    COURSE_ID = os.getenv("CREA_391_FALL_2025")

    # update_discussion_sorting(COURSE_ID)
    process_late_submissions(COURSE_ID)
