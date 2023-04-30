import React from 'react'
import authRoute from './authRoute'
import {APP_PREFIX_PATH} from "../../constants/route.constant";
import {ADMIN, USER} from "../../constants/roles.constant";

export const publicRoutes = [
    ...authRoute
]

export const protectedRoutes = [

    {
        key: 'appsknowledgeBase.manageArticles',
        path: `${APP_PREFIX_PATH}/knowledge-base/manage-articles`,
        component: React.lazy(() => import('views/knowledge-base/ManageArticles')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Manage Articles',
            headerContainer: true
        }
    },
    {
        key: 'appsknowledgeBase.editArticle',
        path: `${APP_PREFIX_PATH}/knowledge-base/edit-article`,
        component: React.lazy(() => import('views/knowledge-base/EditArticle')),
        authority: [ADMIN, USER],
    },
]