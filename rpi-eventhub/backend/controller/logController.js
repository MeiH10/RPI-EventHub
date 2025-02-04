const { readLogFile } = require('../services/eventsLogService');

/**
 * app.get('/logs/:date')
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getLogContent = async (req, res) => {
    const { date } = req.params;
    try {
        const logContent = await readLogFile('rpieventhub-logs', 'events_change', date);
        res.status(200).send(logContent);
    } catch (error) {
        console.error('Error reading log file:', error.message);
        res.status(500).json({ message: 'Error reading log file', error: error.message });
    }
};

module.exports = { getLogContent };