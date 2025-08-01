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

const proxyConfiguration = await Actor.createProxyConfiguration({
    groups: ['RESIDENTIAL'],
    countryCode: 'US', // Optional: specify a country
});

const crawler = new PlaywrightCrawler({
    proxyConfiguration,
    requestHandler: router,
    requestHandlerTimeoutSecs: 1800,
    // For local development, it's good to keep the browser visible
    headless: false,
    // headless: true,
    launchContext: {
        userDataDir: './user-data',
        launchOptions: {
            slowMo: 200,
        },
    },
    maxRequestRetries: Number(process.env.MAX_REQUEST_RETRIES) ?? 3,
    useSessionPool: true,
    persistCookiesPerSession: true,
    browserPoolOptions: {
        useFingerprints: true,
    },
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
