package com.rpieventhub.app.ui

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.TopAppBarScrollBehavior
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.res.stringResource
import androidx.lifecycle.viewmodel.compose.viewModel
import com.rpieventhub.app.ui.screens.EventsViewModel
import com.rpieventhub.app.ui.screens.HomeScreen


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RPIEventhubApp() {
    val scrollBehavior = TopAppBarDefaults.enterAlwaysScrollBehavior()
    Scaffold(
        modifier = Modifier.nestedScroll(scrollBehavior.nestedScrollConnection),
        // topBar = { TopAppBar(scrollBehavior = scrollBehavior) }
    ) {
        innerPadding: PaddingValues ->
        Surface(Modifier.fillMaxSize()) {
            val marsViewModel: EventsViewModel = viewModel()
            HomeScreen(
                marsUiState = marsViewModel.marsUiState,
                contentPadding = innerPadding,
            )
        }
    }
}

//@OptIn(ExperimentalMaterial3Api::class)
//@Composable
//fun TopAppBar(scrollBehavior: TopAppBarScrollBehavior, modifier: Modifier = Modifier) {
//    CenterAlignedTopAppBar(
//        scrollBehavior = scrollBehavior,
//        title = {
//            Text(
//                text = "Top Bar",
//                style = MaterialTheme.typography.headlineSmall,
//            )
//        },
//        modifier = modifier
//    )
//}

