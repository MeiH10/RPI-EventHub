package com.rpieventhub.app.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.prof18.rssparser.model.RssItem

@Composable
fun HomeScreen(
    marsUiState: List<RssItem>,
    modifier: Modifier = Modifier,
    contentPadding: PaddingValues = PaddingValues(0.dp),
) {
    ResultScreen(marsUiState, modifier.padding(top = contentPadding.calculateTopPadding()))
}

/**
 * ResultScreen displaying number of rss items retrieved.
 */
@Composable
fun ResultScreen(items: List<RssItem>, modifier: Modifier = Modifier) {
    if (items.isEmpty()) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = modifier
        ) {
            Text(text = "No items were able to be fetched.")
        }
    } else {
        LazyColumn(
            modifier = modifier.padding(16.dp)
        ) {
            items(items) { item ->
                if (item.title != null && item.description != null) {
                    Text(text = item.title!!)
                    Text(text = item.description!!)
                    Spacer(Modifier.height(16.dp))
                }
            }

            item {
                Text(text = "Total items: ${items.size}")
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ResultScreenPreview() {
    ResultScreen(ArrayList())
}