package com.rpieventhub.app.network


import retrofit2.Retrofit;
import retrofit2.converter.scalars.ScalarsConverterFactory;
import retrofit2.http.GET;

private const val BASE_URL =
    "https://rpieventhub.com/";

val retrofit = Retrofit.Builder()
    .addConverterFactory(ScalarsConverterFactory.create())
    .baseUrl(BASE_URL)
    .build()

interface RSSFetcherService {
    @GET("rss/v1")
    suspend fun getEvents() : String
}
