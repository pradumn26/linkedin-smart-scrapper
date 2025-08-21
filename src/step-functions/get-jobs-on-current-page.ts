import { Page } from 'playwright';

import {
    EMPLOYEE_COUNT_THRESHOLD,
    ERRORS,
    LINKEDIN_JOB_POST_URL,
    LINKEDIN_SPECIFIC_STRINGS,
} from '../utils/constants.js';
import { processPostsString, waitForXSeconds } from '../utils/helpers.js';
import { JobPost } from '../utils/types.js';

export const getJobsOnCurrentPage = async (page: Page, jobPosts: JobPost[]) => {
    const jobPostsLocator = await page
        .locator(LINKEDIN_SPECIFIC_STRINGS.jobPostsSelector)
        .all();

    // Extract the text and links from the job posts HTML
    const postsTextAndLinks = await Promise.all(
        jobPostsLocator.map(async (post) => {
            const text = await post.textContent();
            // hardcoding here because program is unable to recognize
            // outside variables inside the eval function, not sure why
            const jobId = await post.evaluate((el) =>
                el.getAttribute('data-occludable-job-id'),
            );
            const link = jobId
                ? LINKEDIN_JOB_POST_URL.replace(':jobId', jobId)
                : null;
            return [text, link];
        }),
    );

    // Filter out the job posts that don't have text content and links
    let jobPostsOnCurrentPage = postsTextAndLinks
        .filter((f) => f[0] !== null)
        .map((v) => {
            const postTextStrings = processPostsString(v[0] ?? '');
            const link = v[1];
            return {
                textContent: postTextStrings.slice(0, 3),
                link,
                jobId: link?.split('/').pop() ?? null,
                isSeen: false,
                employeeCount: null,
            } as JobPost;
        })
        .filter((f) => f.textContent.length > 1 && f.link !== null);

    // Check if the company has more than 500 employees
    for (let i = 0; i < jobPostsOnCurrentPage.length; i++) {
        await jobPostsLocator[i].click();
        await waitForXSeconds(2);
        const companyLogo = page
            .locator(LINKEDIN_SPECIFIC_STRINGS.companyLogoSelector)
            .first();
        await companyLogo.click();
        await waitForXSeconds(5);

        if (page.url().includes('/company/')) {
            const employeeCountSpan = page
                .locator('span', {
                    hasText: 'employees',
                })
                .first();
            const employeeCountText = await employeeCountSpan.textContent();
            const employeeCountRange = employeeCountText?.trim().split(' ')[0];
            let employeeCount = employeeCountRange?.split('-')[0];

            if (!employeeCount) {
                throw new Error(ERRORS.EMPLOYEE_COUNT_NOT_FOUND);
            }

            employeeCount = employeeCount.replace('+', '');
            employeeCount = employeeCount.replace('K', '000');
            const employeeCountInt = parseInt(employeeCount);
            jobPostsOnCurrentPage[i].employeeCount = employeeCountInt;
        }

        await page.goBack();
        await waitForXSeconds(1);
    }

    // Filter out the job posts that have fewer than 500 employees
    jobPostsOnCurrentPage = jobPostsOnCurrentPage.filter(
        (f) => f.employeeCount && f.employeeCount >= EMPLOYEE_COUNT_THRESHOLD,
    );

    jobPosts.push(...jobPostsOnCurrentPage);
};
