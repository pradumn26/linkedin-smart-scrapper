export const LINKEDIN_SPECIFIC_STRINGS = {
    // This is the id of the username input field
    // on the login form
    loginUsernameId: '#username',

    // This is the id of the password input field
    // on the login form
    loginPasswordId: '#password',

    // This is the selector of the submit button
    // on the login form
    loginSubmitId: 'button[type="submit"]',

    // This is the selector of the posts container
    // on the search results page
    postsContainerSelector: '.search-results-container li',

    // This is the selector of the job posts container
    // on the search results page
    jobPostsContainerSelector: '.scaffold-layout__list>div:nth-child(2)',

    // This is the selector of the job posts
    // on the search results page
    jobPostsSelector: '.scaffold-layout__list-item',

    // This is the selector of the company logo
    // on the jobs search results page
    companyLogoSelector: '.job-view-layout img',

    // This is the string to filter out from the posts
    // on the search results page
    stringToFilterOutFromPosts: 'Feed post',

    // This is the selector of the next button
    // on the search results page
    nextButtonSelector: 'button[aria-label="View next page"]',
};

export const ROUTE_LABELS = {
    POSTS: 'POSTS',
    JOBS: 'JOBS',
    JOBS_PLUS: 'JOBS_PLUS',
};

export const LINKEDIN_JOB_POST_URL =
    'https://www.linkedin.com/jobs/view/:jobId';

export const MONGODB_DATABASE_NAME = 'linkedin_scraper';

export const MONGODB_COLLECTIONS = {
    JOBS: 'jobs',
};

export const EMPLOYEE_COUNT_THRESHOLD = 500;

export const ERRORS = {
    EMPLOYEE_COUNT_NOT_FOUND: 'Employee count not found',
};

// PS: Checkout the video of crawl to understand what all
// page and components are used in the code
