
import { createServer } from 'miragejs'
import appConfig from 'configs/app.config'  

import { signInUserData } from './data/authData'

import { authFakeApi,  knowledgeBaseFakeApi } from './fakeApi'
import { helpCenterCategoriesData, helpCenterArticleListData } from './data/knowledgeBaseData'
const { apiPrefix } = appConfig

export default function mockServer({ environment = 'test' }) {
    return createServer({
        environment,
        seeds(server) {
			server.db.loadData({
				signInUserData,
                helpCenterCategoriesData,
                helpCenterArticleListData,
			})
		},
        routes() {
            this.urlPrefix = ''
            this.namespace = ''
            this.passthrough(request => {
                let isExternal = request.url.startsWith('http')
                return isExternal
            })
            this.passthrough()

            knowledgeBaseFakeApi(this, apiPrefix)
            authFakeApi(this, apiPrefix)
        },
    })
}