import 'dotenv/config';
import { Actor } from 'apify';

import {
    getPostsFromLocatorArray,
    setupAndLoginLinkedin,
    clickShowResultsButton,
    processSteps,
} from '../utils/helpers.js';
import { LINKEDIN_SPECIFIC_STRINGS, ROUTE_LABELS } from '../utils/constants.js';
import { PlaywrightContextDefintion } from '../utils/types.js';

const searchTopics = process.env.SEARCH_TOPICS?.split(',') || [];

export const postsHandler = async (ctx: PlaywrightContextDefintion) => {
    const { page } = ctx;

    await setupAndLoginLinkedin(ROUTE_LABELS.POSTS, ctx);

    for (const topic of searchTopics) {
        const steps = [
            {
                step: 'fill_input',
                locatorString: LINKEDIN_SPECIFIC_STRINGS.searchInputSelector,
                text: topic,
            },
            {
                step: 'press_enter',
            },
            {
                step: 'wait',
                seconds: 5,
            },
            {
                step: 'click',
                text: LINKEDIN_SPECIFIC_STRINGS.postsTabButtonText,
                role: 'button',
                stringOptions: { exact: true },
            },
            {
                step: 'wait',
                seconds: 5,
            },
            {
                step: 'click',
                text: LINKEDIN_SPECIFIC_STRINGS.sortByFilterButtonText,
                role: 'button',
                stringOptions: { exact: false },
            },
            {
                step: 'wait',
                seconds: 1,
            },
            {
                step: 'click',
                locatorString:
                    LINKEDIN_SPECIFIC_STRINGS.latestPostsFilterOptionSelector,
            },
            {
                step: 'custom',
                func: async () => clickShowResultsButton(page),
            },
            {
                step: 'wait',
                seconds: 5,
            },
            {
                step: 'click',
                text: LINKEDIN_SPECIFIC_STRINGS.datePostedFilterButtonText,
                role: 'button',
                stringOptions: { exact: false },
            },
            {
                step: 'wait',
                seconds: 1,
            },
            {
                step: 'click',
                locatorString:
                    LINKEDIN_SPECIFIC_STRINGS.past24HoursFilterOptionSelector,
            },
            {
                step: 'custom',
                func: async () => clickShowResultsButton(page),
            },
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
        const result = (await getPostsFromLocatorArray(posts)).filter(
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
