package com.rpieventhub.app.ui.screens

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.ViewModel
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.prof18.rssparser.RssParser
import com.prof18.rssparser.model.RssChannel
import com.prof18.rssparser.model.RssItem
import com.rpieventhub.app.network.RSSFetcher
import kotlinx.coroutines.launch

private const val LOG_TAG = "EventsViewModel"

class EventsViewModel : ViewModel() {
    var marsUiState: List<RssItem> by mutableStateOf(ArrayList())
        private set


    init {
        getEvents()
    }

    private fun getEvents() {
        viewModelScope.launch {
            val fetchResult = RSSFetcher.retrofitService.getEvents()

            // parse the RSS
            val rssParser: RssParser = RssParser()
            val rssChannel: RssChannel = rssParser.parse(fetchResult)
            val items: List<RssItem> = rssChannel.items

            Log.d(LOG_TAG, "Parsed events feed, had ${items.size}")


            marsUiState = rssChannel.items
        }
    }
}