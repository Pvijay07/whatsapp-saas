"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHANNELS = exports.QUEUE_NAMES = exports.META_GRAPH_URL = exports.META_API_VERSION = exports.WHATSAPP_24H_WINDOW_MS = void 0;
exports.isWithin24HourWindow = isWithin24HourWindow;
exports.slugify = slugify;
exports.generateApiKeyPrefix = generateApiKeyPrefix;
exports.WHATSAPP_24H_WINDOW_MS = 24 * 60 * 60 * 1000;
exports.META_API_VERSION = 'v21.0';
exports.META_GRAPH_URL = 'https://graph.facebook.com';
exports.QUEUE_NAMES = {
    SEND_MESSAGE: 'send-message',
    WEBHOOK_EVENTS: 'webhook-events',
    BROADCAST: 'broadcast',
    WORKFLOW: 'workflow',
    AI_SUGGESTION: 'ai-suggestion',
    WEBHOOK_DELIVERY: 'webhook-delivery',
};
exports.CHANNELS = {
    WHATSAPP: 'whatsapp',
    INSTAGRAM: 'instagram',
    MESSENGER: 'messenger',
};
function isWithin24HourWindow(lastCustomerMessageAt) {
    if (!lastCustomerMessageAt)
        return false;
    return Date.now() - lastCustomerMessageAt.getTime() < exports.WHATSAPP_24H_WINDOW_MS;
}
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);
}
function generateApiKeyPrefix(key) {
    return key.substring(0, 8);
}
//# sourceMappingURL=index.js.map