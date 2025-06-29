import { ROUTE_LABELS } from '../utils/constants';
import { setupAndLoginLinkedin } from '../utils/helpers';
import { PlaywrightContextDefintion } from '../utils/types';

export const jobsHandler = async (ctx: PlaywrightContextDefintion) => {
    const { page } = ctx;

    await setupAndLoginLinkedin(ROUTE_LABELS.JOBS, ctx);
};
