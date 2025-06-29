import { Locator, Page } from 'playwright';

import {
    FindAndClickOptions,
    PlaywrightContextDefintion,
    StringMatchingOptions,
} from './types';
import { LINKEDIN_SPECIFIC_STRINGS } from './utils/constants';

const defaultStringMatchingOptions: StringMatchingOptions = {
    exact: true,
};

export const waitForXSeconds = async (seconds: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });

export const findAndClick = async (options: FindAndClickOptions) => {
    const { page, role, text, locatorString, stringOptions } = options;

    let element: Locator;
    if (role) {
        element = page
            .getByRole(role as any, { name: text, ...options })
            .first();
    } else if (locatorString) {
        element = page.locator(locatorString).first();
    } else {
        element = page.getByText(text as string, { ...stringOptions }).first();
    }
    console.log('findAndClick', element);
    await element.click({ force: true });
    return element;
};

export const findAndFill = async (query: string, fill: string, page: Page) => {
    const element = page.locator(query);
    await element.fill(fill);
    return element;
};

export const getPostsFromLocatorArray = async (posts: Locator[]) => {
    const stringPosts = await Promise.all(
        [...posts].map(async (post) => {
            const text = await post.textContent();
            return text;
        }),
    );
    const arrayPosts = stringPosts
        .filter((f) => f !== null)
        .map((postString) =>
            postString
                .split('\n')
                .filter((f) => f.trim() !== '')
                .map((v) => v.trim()),
        );
    return arrayPosts;
};

export const setupAndLoginLinkedin = async (
    label: string,
    playwrightCtx: PlaywrightContextDefintion,
) => {
    const { page, log, session } = playwrightCtx;
    log.info(`Processing ${label}...`);

    await page.setViewportSize({ width: 1400, height: 850 });

    // Login page
    // Enter credentials and login
    if (!session || !session.isUsable()) {
        await findAndFill(
            LINKEDIN_SPECIFIC_STRINGS.loginUsernameId,
            process.env.LINKEDIN_PHONE || 'phone_not_available',
            page,
        );
        await findAndFill(
            LINKEDIN_SPECIFIC_STRINGS.loginPasswordId,
            process.env.LINKEDIN_PASSWORD || 'password_not_available',
            page,
        );
        await findAndClick({
            locatorString: LINKEDIN_SPECIFIC_STRINGS.loginSubmitId,
            page,
        });
        await waitForXSeconds(5);
    }
};
