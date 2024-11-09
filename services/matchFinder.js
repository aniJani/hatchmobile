import { BASE_URL } from '@env';
import axios from 'axios';

export const findUserMatch = async (queryIn, loggedInUserId) => {
    try {
        const response = await axios.post(`http://${BASE_URL}/user/match`, {
            query: queryIn,
        });

        // Filter out the logged-in user from the matched users
        const matchedUsers = response.data.filter(user => user._id !== loggedInUserId);

        return matchedUsers; // Return the list of matched users, excluding the logged-in user
    } catch (error) {
        console.error('Error finding user match:', error);
        throw error;
    }
};
/**
 * Searches for users by a given query.
 *
 * @param {string} query - The query to search for in user profiles.
 * The top 5 matched users will be returned like this:
 * [
    {
        "_id": "672d5a157f9a8dd351e946fc",
        "email": "zenithchetri377@gmail.com",
        "name": "Pratima",
        "description": "Kxhxiyd",
        "skills": [
            "Khchic"
        ],
        "openToCollaboration": true,
        "projectsOwned": [],
        "collaborations": [],
        "createdAt": "2024-11-08T00:23:49.717Z",
        "updatedAt": "2024-11-08T00:23:49.717Z",
        "__v": 0
    },
    {
        "_id": "672da27a5450f3d930fe841a",
        "email": "sarun.maharjan@usm.edu",
        "name": "Sarun",
        "description": "Hi. I am making frontend with C#",
        "skills": [
            "Python",
            "C#",
            "java"
        ],
        "openToCollaboration": true,
        "projectsOwned": [],
        "collaborations": [],
        "createdAt": "2024-11-08T05:32:42.715Z",
        "updatedAt": "2024-11-08T05:32:42.715Z",
        "__v": 0
    },
    {
        "_id": "672da70469672eb89e7a1857",
        "email": "rarachow2@gmail.com",
        "name": "Janit ",
        "description": "Backend coder",
        "skills": [
            "Python",
            "JavaScript"
        ],
        "openToCollaboration": true,
        "projectsOwned": [],
        "collaborations": [],
        "createdAt": "2024-11-08T05:52:04.432Z",
        "updatedAt": "2024-11-08T05:52:04.432Z",
        "__v": 0
    },
    {
        "_id": "672d9ddc6151bc282ddf2f67",
        "email": "testuser@example.com",
        "name": "Test User",
        "description": "An experienced software developer with expertise in AI and ML.",
        "skills": [],
        "openToCollaboration": true,
        "projectsOwned": [],
        "collaborations": [],
        "createdAt": "2024-11-08T05:13:00.483Z",
        "updatedAt": "2024-11-08T05:13:00.483Z",
        "__v": 0
    },
    {
        "_id": "672da02c6151bc282ddf2f6b",
        "email": "testusers@example.com",
        "name": "Test User",
        "description": "An experienced software developer with expertise in AI and ML.",
        "skills": [
            "JavaScript",
            " Python",
            "  Machine Learning"
        ],
        "openToCollaboration": true,
        "projectsOwned": [],
        "collaborations": [],
        "createdAt": "2024-11-08T05:22:52.025Z",
        "updatedAt": "2024-11-08T05:22:52.025Z",
        "__v": 0
    }
]
 */
