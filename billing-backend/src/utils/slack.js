const axios = require('axios');
const logger = require('../config/logger');

/**
 * Sends a Slack message to a given channel with expense details.
 * 
 * @param {string} expenseId - The ID of the expense.
 * @param {string} reason - The reason/name for the expense.
 * @param {string} amount - The amount of the expense.
 * @param {string} channel - Slack channel to send the message to.
 * @param {string} type - Type of message.
 */
const sendSlackNotification = async ({ expense_id, reason, amount, channel, type }) => {
    const url = process.env.SLACK_MESSAGE_URL;
    const headers = {
        Authorization: `Bearer ${process.env.SLACK_SECRET}`,
        'Content-Type': 'application/json',
    };

    const text = type === 'full_message' 
        ? reason 
        : `Hello @here, a new expense has been added! \n*ID:* ${expense_id}\n*Reason:* ${reason}\n*Amount:* ₹${amount}`;

    const slackChannel = channel.startsWith('#') ? channel : `#${channel}`;

    const data = {
        channel: slackChannel,
        text,
    };

    try {
        const response = await axios.post(url, data, { headers });
        if (!response.data.ok) {
            throw new Error(`Slack API Error: ${response.data.error}`);
        }
        logger.info(`Slack Response: ${JSON.stringify(response.data)}`);
    } catch (error) {
        logger.error(`Error sending Slack message: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`);
    }
};

module.exports = { sendSlackNotification };
