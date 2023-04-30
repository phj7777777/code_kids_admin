import ApiService from "./ApiService"

export async function apiGetCategoriesData () {
    return ApiService.fetchData({
        url: '/knowledge-base/categories',
        method: 'get'
    })
}

export async function apiQueryArticleList (data) {
    return ApiService.fetchData({
        url: '/knowledge-base/articles-query',
        method: 'post',
        data
    })
}


export async function apiGetArticle (params) {
    return ApiService.fetchData({
        url: '/blogs',
        method: 'get',
        params
    })
}

export async function apiPostArticle (data) {
    return ApiService.fetchData({
        url: '/blogs',
        method: 'post',
        data
    })
}

export async function apiPutArticle (data) {
    return ApiService.fetchData({
        url: '/blogs',
        method: 'put',
        data
    })
}

export async function apiDeleteArticle (id) {
    return ApiService.fetchData({
        url: '/blogs/' + id,
        method: 'delete',
    })
}



export async function apiGetOthersArticleList (params) {
    return ApiService.fetchData({
        url: '/knowledge-base/others-article',
        method: 'get',
        params
    })
}

export async function apiGetCategorizedArticles (params) {
    return ApiService.fetchData({
        url: '/blogs/categorized',
        method: 'get',
        params
    })
}

