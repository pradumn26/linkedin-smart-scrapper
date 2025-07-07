import { Locator, Page } from 'playwright';

import {
    FindAndClickOptions,
    PlaywrightContextDefintion,
} from '../utils/types.js';
import { LINKEDIN_SPECIFIC_STRINGS } from './constants.js';
import { Step } from './types.js';
import { playwrightUtils } from 'crawlee';

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
    await element.click({ force: true });
    return element;
};

export const findAndFill = async (query: string, fill: string, page: Page) => {
    const element = page.locator(query).first();
    await element.fill(fill);
    return element;
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
    if (process.env.IS_HEADLESS === 'true') {
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

export const processSteps = async (steps: Step[], page: Page) => {
    for (const step of steps) {
        switch (step.step) {
            case 'wait':
                await waitForXSeconds(step.seconds!);
                break;
            case 'click':
                await findAndClick({ page, ...step });
                break;
            case 'custom':
                await step.func?.();
                break;
            case 'fill_input':
                await findAndFill(step.locatorString!, step.text!, page);
                break;
            case 'press_enter':
                await page.keyboard.press('Enter');
                break;
            case 'infinite_scroll':
                await playwrightUtils.infiniteScroll(page, {
                    timeoutSecs:
                        Number(process.env.INFINITE_SCROLL_TIMEOUT_SECS) || 10,
                });
                break;
            case 'scroll_to_bottom':
                await scrollToBottom(step.locatorString!, page);
                break;
        }
    }
};

export const scrollToBottom = async (locatorString: string, page: Page) => {
    const element = page.locator(locatorString);

    // not using waitForXSeconds because program is unable to recognize
    // outside variables inside the eval function, not sure why
    await element.evaluate(async (el) => {
        let scrollPosition = el.clientHeight;
        while (scrollPosition <= el.scrollHeight) {
            el.scrollTo(0, scrollPosition);
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            scrollPosition += el.clientHeight;
        }
    });
};

export const processPostsString = (text: string) => {
    return text
        .split('\n')
        .filter((f) => f.trim() !== '')
        .map((v) => v.trim());
};
