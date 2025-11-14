package com.rpieventhub.app.network

object RSSFetcher {
    val retrofitService : RSSFetcherService by lazy {
        retrofit.create(RSSFetcherService::class.java)
    }
}