package com.rpieventhub.app.ui.screens

import androidx.compose.runtime.getValue
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.ViewModel
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.rpieventhub.app.network.RSSFetcher
import kotlinx.coroutines.launch


class EventsViewModel : ViewModel() {
    var marsUiState: String by mutableStateOf("")
        private set


    init {
        getEvents()
    }

    private fun getEvents() {
        viewModelScope.launch {
            val listResult = RSSFetcher.retrofitService.getEvents()
            marsUiState = listResult
        }
    }
}