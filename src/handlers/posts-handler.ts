import 'dotenv/config';
import { Actor } from 'apify';

import {
    setupAndLoginLinkedin,
    processSteps,
    processPostsString,
} from '../utils/helpers.js';
import { LINKEDIN_SPECIFIC_STRINGS, ROUTE_LABELS } from '../utils/constants.js';
import { PlaywrightContextDefintion } from '../utils/types.js';

const searchTopics = process.env.SEARCH_TOPICS?.split(',') || [];

export const postsHandler = async (ctx: PlaywrightContextDefintion) => {
    const { page } = ctx;

    await setupAndLoginLinkedin(ROUTE_LABELS.POSTS, ctx);

    for (const topic of searchTopics) {
        await page.goto(
            `https://www.linkedin.com/search/results/content/?datePosted=%22past-24h%22&keywords=%22${topic}%22&sortBy=%22date_posted%22`,
        );

        const steps = [
            {
                step: 'wait',
                seconds: 5,
            },
            {
                step: 'infinite_scroll',
            },
        ];

        await processSteps(steps, page);

        // Get posts HTML and process them
        // and push them to the dataset
        const posts = await page
            .locator(LINKEDIN_SPECIFIC_STRINGS.postsContainerSelector)
            .all();
        const stringPosts = await Promise.all(
            [...posts].map(async (post) => {
                const text = await post.textContent();
                return text;
            }),
        );
        const arrayPosts = stringPosts
            .filter((f) => f !== null)
            .map(processPostsString)
            .filter((f) => f.length > 0);
        const result = arrayPosts.filter(
            (f) =>
                f[0] === LINKEDIN_SPECIFIC_STRINGS.stringToFilterOutFromPosts,
        );
        await Actor.pushData({
            topic,
            timestamp: new Date().toISOString(),
            result,
        });
    }
};
