import { Actor } from 'apify';

import {
    setupAndLoginLinkedin,
    processSteps,
    processPostsString,
} from '../utils/helpers.js';
import {
    LINKEDIN_JOB_POST_URL,
    LINKEDIN_SPECIFIC_STRINGS,
    ROUTE_LABELS,
} from '../utils/constants.js';
import {
    PlaywrightContextDefintion,
    JobPost,
    ActorInput,
} from '../utils/types.js';

const searchTopics = process.env.SEARCH_TOPICS?.split(',') || [];

export const jobsHandler = async (ctx: PlaywrightContextDefintion) => {
    const { page } = ctx;
    const actorInput = await Actor.getInput<ActorInput>();
    const jobsDatePostedSeconds = actorInput?.jobsDatePostedSeconds || '86400';

    await setupAndLoginLinkedin(ROUTE_LABELS.JOBS, ctx);

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
                        const jobPostsLocator = await page
                            .locator(LINKEDIN_SPECIFIC_STRINGS.jobPostsSelector)
                            .all();
                        const postsTextAndLinks = await Promise.all(
                            jobPostsLocator.map(async (post) => {
                                const text = await post.textContent();
                                // hardcoding here because program is unable to recognize
                                // outside variables inside the eval function, not sure why
                                const jobId = await post.evaluate((el) =>
                                    el.getAttribute('data-occludable-job-id'),
                                );
                                const link = jobId
                                    ? LINKEDIN_JOB_POST_URL.replace(
                                          ':jobId',
                                          jobId,
                                      )
                                    : null;
                                return [text, link];
                            }),
                        );
                        const jobPostsOnCurrentPage = postsTextAndLinks
                            .filter((f) => f[0] !== null)
                            .map((v) => {
                                const postTextStrings = processPostsString(
                                    v[0] ?? '',
                                );
                                const link = v[1];
                                return {
                                    textContent: postTextStrings,
                                    link,
                                };
                            })
                            .filter((f) => f.textContent.length > 1);
                        jobPosts = [...jobPosts, ...jobPostsOnCurrentPage];
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
            label: ROUTE_LABELS.JOBS,
            topic,
            timestamp: new Date().toISOString(),
            result: jobPosts,
        });
    }
};
