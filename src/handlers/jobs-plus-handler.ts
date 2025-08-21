import { Actor } from 'apify';

import { setupAndLoginLinkedin, processSteps } from '../utils/helpers.js';
import { LINKEDIN_SPECIFIC_STRINGS, ROUTE_LABELS } from '../utils/constants.js';
import {
    PlaywrightContextDefintion,
    JobPost,
    ActorInput,
    Handler,
} from '../utils/types.js';
import { getJobsOnCurrentPage } from '../step-functions/get-jobs-on-current-page.js';

const searchTopics = process.env.SEARCH_TOPICS?.split(',') || [];

export const jobsPlusHandler: Handler = async (ctx) => {
    const { page } = ctx;
    const actorInput = await Actor.getInput<ActorInput>();
    const jobsDatePostedSeconds = actorInput?.jobsDatePostedSeconds || '3700';

    await setupAndLoginLinkedin(ROUTE_LABELS.JOBS_PLUS, ctx);

    for (const topic of searchTopics) {
        let jobPosts: JobPost[] = [];
        await page.goto(
            `https://www.linkedin.com/jobs/search/?f_TPR=r${jobsDatePostedSeconds}&keywords=%22${topic}%22&sortBy=DD`,
        );

        let isContinue = true;

        while (isContinue) {
            const steps = [
                {
                    step: 'wait',
                    seconds: 5,
                },
                {
                    step: 'scroll_to_bottom',
                    locatorString:
                        LINKEDIN_SPECIFIC_STRINGS.jobPostsContainerSelector,
                },
                {
                    step: 'wait',
                    seconds: 5,
                },
                {
                    step: 'custom',
                    func: async () => {
                        await getJobsOnCurrentPage(page, jobPosts);
                    },
                },
                {
                    step: 'custom',
                    func: async () => {
                        const nextButton = page
                            .locator(
                                LINKEDIN_SPECIFIC_STRINGS.nextButtonSelector,
                            )
                            .first();
                        if (await nextButton.isVisible()) {
                            await nextButton.click();
                        } else {
                            isContinue = false;
                        }
                    },
                },
            ];

            await processSteps(steps, page);
        }

        await Actor.pushData({
            label: ROUTE_LABELS.JOBS_PLUS,
            topic,
            timestamp: new Date().toISOString(),
            result: jobPosts,
        });
    }
};
