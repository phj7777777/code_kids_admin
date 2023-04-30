import {APP_PREFIX_PATH, PAGES_PREFIX_PATH} from "../constants/route.constant";

const appConfig = {
    apiPrefix2: 'http://localhost:5000/api/v1',
    apiPrefix: 'http://localhost:5000/api/v1',
    authenticatedEntryPath: `${APP_PREFIX_PATH}/knowledge-base/manage-articles`,
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: `${PAGES_PREFIX_PATH}/welcome`,
    enableMock: false
}

export default appConfig