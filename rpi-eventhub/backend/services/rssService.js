const express = require('express');
var RSS = require('rss');
const Event = require('../models/Event');

/**
 * This method is used to get an RSS feed
 * app.get('/rss/v1/')
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
const getRSSFeed = async (req, res) => {
    const rss = new RSS({
        title: "EventHUB Events",
        feed_url: "https://rpieventhub.com/rss/v1",
        site_url: "https://rpieventhub.com/",
    });
    
    try {
        const events = await Event.find()
            .where("endDateTime").gt(Date.now())
            .limit(50)
            .sort('startDateTime');
        // get some items from the result
        // building rss feed
        for (i in events) {
            const event = events[i]
            rss.item({
                'title': event.title,
                'description': event.description,
                'date': event.startDateTime,
                'url': `https://rpieventhub.com/events/${event.id}`
            })
        }

        res.status(200).write(rss.xml());
        res.end();
    } catch (error) {
        res.status(500).json({ message: 'Error obtaining events', error: error.message });
    }
};

module.exports = { getRSSFeed };
