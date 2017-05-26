//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
//
// Bot Framework Emulator Github:
// https://github.com/Microsoft/BotFramwork-Emulator
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../../settings");
const emulator_1 = require("../../emulator");
const HttpStatus = require("http-status-codes");
const ResponseTypes = require("../../../types/responseTypes");
const responseTypes_1 = require("../../../types/responseTypes");
const attachmentsController_1 = require("./attachmentsController");
const log = require("../../log");
const log_1 = require("../../log");
const jsonBodyParser_1 = require("../../jsonBodyParser");
const versionManager_1 = require("../../versionManager");
class ConversationsController {
    static registerRoutes(server, auth) {
        server.router.post('/v3/conversations', [auth.verifyBotFramework], jsonBodyParser_1.jsonBodyParser(), [this.createConversation]);
        server.router.post('/v3/conversations/:conversationId/activities', [auth.verifyBotFramework], jsonBodyParser_1.jsonBodyParser(), [this.sendToConversation]);
        server.router.post('/v3/conversations/:conversationId/activities/:activityId', [auth.verifyBotFramework], jsonBodyParser_1.jsonBodyParser(), [this.replyToActivity]);
        server.router.put('/v3/conversations/:conversationId/activities/:activityId', [auth.verifyBotFramework], jsonBodyParser_1.jsonBodyParser(), [this.updateActivity]);
        server.router.del('/v3/conversations/:conversationId/activities/:activityId', auth.verifyBotFramework, this.deleteActivity);
        server.router.get('/v3/conversations/:conversationId/members', auth.verifyBotFramework, this.getConversationMembers);
        server.router.get('/v3/conversations/:conversationId/activities/:activityId/members', auth.verifyBotFramework, this.getActivityMembers);
        server.router.post('/v3/conversations/:conversationId/attachments', [auth.verifyBotFramework], jsonBodyParser_1.jsonBodyParser(), [this.uploadAttachment]);
    }
}
// Create conversation API
ConversationsController.createConversation = (req, res, next) => {
    let conversationParameters = req.body;
    try {
        const settings = settings_1.getSettings();
        // look up bot
        const activeBot = settings.getActiveBot();
        if (!activeBot)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "bot not found");
        const users = settings.users;
        if (conversationParameters.members == null)
            throw ResponseTypes.createAPIException(HttpStatus.BAD_REQUEST, responseTypes_1.ErrorCodes.MissingProperty, "members missing");
        if (conversationParameters.members.length != 1)
            throw ResponseTypes.createAPIException(HttpStatus.BAD_REQUEST, responseTypes_1.ErrorCodes.BadSyntax, "Emulator only supports creating conversation with 1 user");
        if (conversationParameters.members[0].id !== settings.users.currentUserId)
            throw ResponseTypes.createAPIException(HttpStatus.BAD_REQUEST, responseTypes_1.ErrorCodes.BadSyntax, "Emulator only supports creating conversation with the current user");
        if (conversationParameters.bot == null)
            throw ResponseTypes.createAPIException(HttpStatus.BAD_REQUEST, responseTypes_1.ErrorCodes.MissingProperty, "missing Bot property");
        if (conversationParameters.bot.id != activeBot.botId)
            throw ResponseTypes.createAPIException(HttpStatus.BAD_REQUEST, responseTypes_1.ErrorCodes.BadArgument, "conversationParameters.bot.id doesn't match security bot id");
        let newUsers = [];
        // merge users in
        for (let key in conversationParameters.members) {
            newUsers.push({
                id: conversationParameters.members[key].id,
                name: conversationParameters.members[key].name
            });
        }
        settings_1.getStore().dispatch({
            type: "Users_AddUsers",
            state: { users: newUsers }
        });
        let newConversation;
        if (conversationParameters.conversationId) {
            newConversation = emulator_1.emulator.conversations.conversationById(activeBot.botId, conversationParameters.conversationId);
        }
        if (!newConversation) {
            newConversation = emulator_1.emulator.conversations.newConversation(activeBot.botId, users.usersById[conversationParameters.members[0].id], conversationParameters.conversationId);
        }
        let activityId = null;
        if (conversationParameters.activity != null) {
            // set routing information for new conversation
            conversationParameters.activity.conversation = { id: newConversation.conversationId };
            conversationParameters.activity.from = { id: activeBot.botId };
            conversationParameters.activity.recipient = { id: conversationParameters.members[0].id };
            let response = newConversation.postActivityToUser(conversationParameters.activity);
            activityId = response.id;
        }
        var response = ResponseTypes.createConversationResponse(newConversation.conversationId, activityId);
        res.send(HttpStatus.OK, response);
        res.end();
        log.api('createConversation', req, res, conversationParameters, response, getActivityText(conversationParameters.activity));
        // Tell the client side to start a new conversation.
        emulator_1.Emulator.send('new-conversation', newConversation.conversationId);
    }
    catch (err) {
        var error = ResponseTypes.sendErrorResponse(req, res, next, err);
        log.api('createConversation', req, res, conversationParameters, error, getActivityText(conversationParameters.activity));
    }
};
// SendToConversation
ConversationsController.sendToConversation = (req, res, next) => {
    let activity = req.body;
    try {
        const parms = req.params;
        // look up bot
        const activeBot = settings_1.getSettings().getActiveBot();
        if (!activeBot)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "bot not found");
        activity.id = null;
        activity.replyToId = req.params.activityId;
        // look up conversation
        const conversation = emulator_1.emulator.conversations.conversationById(activeBot.botId, parms.conversationId);
        if (!conversation)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "conversation not found");
        // post activity
        let response = conversation.postActivityToUser(activity);
        res.send(HttpStatus.OK, response);
        res.end();
        log.api(`Send[${activity.type}]`, req, res, activity, response, getActivityText(activity));
    }
    catch (err) {
        let error = ResponseTypes.sendErrorResponse(req, res, next, err);
        log.api(`Send[${activity.type}]`, req, res, activity, error, getActivityText(activity));
    }
};
// replyToActivity
ConversationsController.replyToActivity = (req, res, next) => {
    let activity = req.body;
    try {
        const parms = req.params;
        // look up bot
        const activeBot = settings_1.getSettings().getActiveBot();
        if (!activeBot)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "bot not found");
        versionManager_1.VersionManager.checkVersion(req.header("User-agent"));
        activity.id = null;
        activity.replyToId = req.params.activityId;
        // look up conversation
        const conversation = emulator_1.emulator.conversations.conversationById(activeBot.botId, parms.conversationId);
        if (!conversation)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "conversation not found");
        // if we found the activity to reply to
        //if (!conversation.activities.find((existingActivity, index, obj) => existingActivity.id == activity.replyToId))
        //    throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, ErrorCodes.BadArgument, "replyToId is not a known activity id");
        // post activity
        let response = conversation.postActivityToUser(activity);
        res.send(HttpStatus.OK, response);
        res.end();
        log.api(`Reply[${activity.type}]`, req, res, activity, response, getActivityText(activity));
    }
    catch (err) {
        let error = ResponseTypes.sendErrorResponse(req, res, next, err);
        log.api(`Reply[${activity.type}]`, req, res, activity, error, getActivityText(activity));
    }
};
// updateActivity
ConversationsController.updateActivity = (req, res, next) => {
    let activity = req.body;
    try {
        const parms = req.params;
        // look up bot
        const activeBot = settings_1.getSettings().getActiveBot();
        if (!activeBot)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "bot not found");
        activity.replyToId = req.params.activityId;
        if (activity.id != parms.activityId)
            throw ResponseTypes.createAPIException(HttpStatus.BAD_REQUEST, responseTypes_1.ErrorCodes.BadArgument, "uri activity id does not match payload activity id");
        // look up conversation
        const conversation = emulator_1.emulator.conversations.conversationById(activeBot.botId, parms.conversationId);
        if (!conversation)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "conversation not found");
        // post activity
        let response = conversation.updateActivity(activity);
        res.send(HttpStatus.OK, response);
        res.end();
        log.api(`Update[${activity.id}]`, req, res, activity, response, getActivityText(activity));
    }
    catch (err) {
        let error = ResponseTypes.sendErrorResponse(req, res, next, err);
        log.api(`Update[${activity.id}]`, req, res, activity, error, getActivityText(activity));
    }
};
// deleteActivity
ConversationsController.deleteActivity = (req, res, next) => {
    const parms = req.params;
    try {
        // look up bot
        const activeBot = settings_1.getSettings().getActiveBot();
        if (!activeBot)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "bot not found");
        // look up conversation
        const conversation = emulator_1.emulator.conversations.conversationById(activeBot.botId, parms.conversationId);
        if (!conversation)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "conversation not found");
        conversation.deleteActivity(parms.activityId);
        res.send(HttpStatus.OK);
        res.end();
        log.api(`DeleteActivity(${parms.activityId})`, req, res);
    }
    catch (err) {
        let error = ResponseTypes.sendErrorResponse(req, res, next, err);
        log.api(`DeleteActivity(${parms.activityId})`, req, res, null, error);
    }
};
// get members of a conversation
ConversationsController.getConversationMembers = (req, res, next) => {
    const parms = req.params;
    try {
        // look up bot
        const activeBot = settings_1.getSettings().getActiveBot();
        if (!activeBot)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "bot not found");
        // look up conversation
        const conversation = emulator_1.emulator.conversations.conversationById(activeBot.botId, parms.conversationId);
        if (!conversation)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "conversation not found");
        res.send(HttpStatus.OK, conversation.members);
        res.end();
        log.api(`GetConversationMembers(${parms.conversationId})`, req, res, null, conversation.members);
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
        log.api(`GetConversationMembers(${parms.conversationId})`, req, res, null, log_1.error);
    }
};
// get members of an activity
ConversationsController.getActivityMembers = (req, res, next) => {
    const parms = req.params;
    try {
        // look up bot
        const activeBot = settings_1.getSettings().getActiveBot();
        if (!activeBot)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "bot not found");
        let activity = req.body;
        // look up conversation
        const conversation = emulator_1.emulator.conversations.conversationById(activeBot.botId, parms.conversationId);
        if (!conversation)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "conversation not found");
        res.send(HttpStatus.OK, conversation.members);
        res.end();
        log.api(`GetActivityMembers(${parms.activityId})`, req, res, null, conversation.members);
    }
    catch (err) {
        let error = ResponseTypes.sendErrorResponse(req, res, next, err);
        log.error(`GetActivityMembers(${parms.activityId})`, req, res, null, error);
    }
};
// upload attachment
ConversationsController.uploadAttachment = (req, res, next) => {
    let attachmentData = req.body;
    try {
        // look up bot
        const activeBot = settings_1.getSettings().getActiveBot();
        if (!activeBot)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "bot not found");
        const parms = req.params;
        // look up conversation
        const conversation = emulator_1.emulator.conversations.conversationById(activeBot.botId, parms.conversationId);
        if (!conversation)
            throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "conversation not found");
        let resourceId = attachmentsController_1.AttachmentsController.uploadAttachment(attachmentData);
        let resourceResponse = { id: resourceId };
        res.send(HttpStatus.OK, resourceResponse);
        res.end();
        log.api('UploadAttachment()', req, res, attachmentData, resourceResponse, attachmentData.name);
    }
    catch (err) {
        let error = ResponseTypes.sendErrorResponse(req, res, next, err);
        log.api('UploadAttachment()', req, res, attachmentData, error, attachmentData.name);
    }
};
exports.ConversationsController = ConversationsController;
function getActivityText(activity) {
    if (activity) {
        if (activity.attachments && activity.attachments.length > 0)
            return activity.attachments[0].contentType;
        else {
            if (activity.text && activity.text.length > 50)
                return activity.text.substring(0, 50) + '...';
            return activity.text;
        }
    }
    return '';
}
//# sourceMappingURL=conversationsController.js.map