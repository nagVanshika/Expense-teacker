const axios = require('axios');
const logger = require('../config/logger');

/**
 * Sends a Slack message to a given channel with expense or collection details.
 */
const sendSlackNotification = async ({ 
    expense_id, 
    reason, 
    amount, 
    channel, 
    type,
    categoryName,
    paidBy,
    customerName
}) => {
    const url = process.env.SLACK_MESSAGE_URL;
    const headers = {
        Authorization: `Bearer ${process.env.SLACK_SECRET}`,
        'Content-Type': 'application/json',
    };

    let text = '';
    if (type === 'full_message') {
        text = reason;
    } else if (type === 'Collection') {
        text = `Hello @here, a new collection has been added! \n*Customer:* ${customerName}\n*Category:* ${categoryName || 'Manual'}\n*Amount:* ₹${amount}`;
    } else {
        // Default to Expense or generic
        text = `Hello @here, a new ${type || 'expense'} has been added! \n*ID:* ${expense_id}\n*Reason:* ${reason}\n*Amount:* ₹${amount}`;
        if (categoryName) text += `\n*Category:* ${categoryName}`;
        if (paidBy) text += `\n*Paid By:* ${paidBy}`;
    }

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
