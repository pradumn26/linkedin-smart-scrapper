import { LoadedRequest, Request } from '@crawlee/playwright';
import { PlaywrightCrawlingContext } from '@crawlee/playwright';
import { Dictionary } from 'crawlee';
import { Page } from 'playwright';

export type StringMatchingOptions = {
    exact?: boolean;
};

export type FindAndClickOptions = {
    role?: string;
    text?: string;
    locatorString?: string;
    page: Page;
    stringOptions?: StringMatchingOptions;
};

export type PlaywrightContextDefintion = Omit<
    PlaywrightCrawlingContext<Dictionary>,
    'request'
> & {
    request: LoadedRequest<Request<Dictionary>>;
};

export type Step = {
    step: string;
    locatorString?: string;
    text?: string;
    stringOptions?: StringMatchingOptions;
    func?: () => Promise<void>;
    seconds?: number;
    role?: 'button';
};

export type JobPost = {
    textContent: string[];
    link: string | null;
};

export type ActorInput = {
    jobsDatePostedSeconds: string;
};

export type Filter = {
    _id: string;
    name: string;
    value: string[];
};
