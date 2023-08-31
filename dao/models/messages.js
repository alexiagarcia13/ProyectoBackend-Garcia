const Message = require('./dao/models/messages');

function saveMessage(user, messageText) {
    const message = new Message({
        user: user,
        message: messageText
    });
    return message.save();
}
