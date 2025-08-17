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

    // This is the selector of the search input field
    // on the search results page
    searchInputSelector: 'input[placeholder="Search"]',

    // This is the selector of the search input field
    // on the jobs search results page
    jobsSearchInputSelector: 'input[type="text"]',

    // This is the text of the posts tab
    // on the search results page
    postsTabButtonText: 'Posts',

    // This is the text of the jobs tab
    // on the search results page
    jobsButtonText: 'Jobs',

    // This is the text of the sort by button
    // on the search results page
    sortByFilterButtonText: 'Sort by',

    // This is the selector of the latest posts filter option
    // on the search results page
    latestPostsFilterOptionSelector: 'label[for="sortBy-date_posted"]',

    // This is the text of the date posted filter button
    // on the search results page
    datePostedFilterButtonText: 'Date posted',

    // This is the selector of the past 24 hours filter option
    // on the search results page
    past24HoursFilterOptionSelector: 'label[for="datePosted-past-24h"]',

    // This is the text of the all filters button
    // on the search results page
    allFiltersButtonText: 'All filters',

    // This is the selector of the past 86400 seconds filter option
    // on the search results page
    past86400SecondsFilterOptionSelector: 'label[for="timePostedRange-r86400"]',

    // This button is on search results page
    // filter modal
    showResultsButtonText: 'Show results',

    // This is the selector of the posts container
    // on the search results page
    postsContainerSelector: '.search-results-container li',

    // This is the selector of the job posts container
    // on the search results page
    jobPostsContainerSelector: '.scaffold-layout__list>div:nth-child(2)',

    // This is the selector of the job posts
    // on the search results page
    jobPostsSelector: '.scaffold-layout__list li',

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
};

export const LINKEDIN_JOB_POST_URL =
    'https://www.linkedin.com/jobs/view/:jobId';

export const MONGODB_DATABASE_NAME = 'linkedin_scraper';

export const MONGODB_COLLECTIONS = {
    JOBS: 'jobs',
};

// PS: Checkout the video of crawl to understand what all
// page and components are used in the code
