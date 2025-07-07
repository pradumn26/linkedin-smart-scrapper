import 'dotenv/config';
import { Actor } from 'apify';
import { createPlaywrightRouter, PlaywrightCrawler } from 'crawlee';

import { ROUTE_LABELS } from './utils/constants.js';
import { postsHandler } from './handlers/posts-handler.js';
import { jobsHandler } from './handlers/jobs-handler.js';

await Actor.init();

const searchTopics = process.env.SEARCH_TOPICS?.split(',') || [];

const router = createPlaywrightRouter();
router.addHandler(ROUTE_LABELS.POSTS, postsHandler);
router.addHandler(ROUTE_LABELS.JOBS, jobsHandler);

const crawler = new PlaywrightCrawler({
    requestHandler: router,
    requestHandlerTimeoutSecs:
        searchTopics.length *
        (Number(process.env.INFINITE_SCROLL_TIMEOUT_SECS) + 60),
    // For local development, it's good to keep the browser visible
    headless: false,
    launchContext: {
        userDataDir: './user-data',
    },
    maxRequestRetries: Number(process.env.MAX_REQUEST_RETRIES) ?? 3,
});

await crawler.run([
    {
        url: 'https://linkedin.com/login',
        label: ROUTE_LABELS.JOBS,
        uniqueKey: ROUTE_LABELS.JOBS,
    },
    {
        url: 'https://linkedin.com/login',
        label: ROUTE_LABELS.POSTS,
        uniqueKey: ROUTE_LABELS.POSTS,
    },
]);

await Actor.exit();
