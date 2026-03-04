const context = require('../api.services/contextService');
const { messageSchema } = require('../api.validators/validationService');


class MessageHelper {
   async create(data) {
        const parsed = messageSchema.safeParse(data);
        if (!parsed.success) return { success: false, message: parsed.error.format() };
        const result = await context.sendMessage(parsed.data);
        return { success: true, data: result, message: 'Sent' }
    }

    findById(id) {
        return context.getMessageById(id);
    }

    findChatBetweenUsers(user1, user2) {
        return context.getMessagesBetweenUsers(user1, user2);
    }

    findUserContactMessages(userId) {
        return context.getUserConversations(userId);
    }

    updateMessageRead(messageId) {
        return context.updateMessageStatus(messageId);
    }

    getAllUSerMesssages(userId) {
        return context.getUserMessages(userId);
    }

    delete(id) {
        return context.deleteMessage(id);
    }
}

module.exports = new MessageHelper();