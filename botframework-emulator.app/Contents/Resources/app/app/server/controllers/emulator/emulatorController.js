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
const HttpStatus = require("http-status-codes");
const electron_1 = require("electron");
const settings_1 = require("../../settings");
const emulator_1 = require("../../emulator");
const jsonBodyParser_1 = require("../../jsonBodyParser");
const ResponseTypes = require("../../../types/responseTypes");
const responseTypes_1 = require("../../../types/responseTypes");
function getConversation(conversationId) {
    const settings = settings_1.getSettings();
    const activeBot = settings.getActiveBot();
    if (!activeBot) {
        throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "bot not found");
    }
    const conversation = emulator_1.emulator.conversations.conversationById(activeBot.botId, conversationId);
    if (!conversation) {
        throw ResponseTypes.createAPIException(HttpStatus.NOT_FOUND, responseTypes_1.ErrorCodes.BadArgument, "conversation not found");
    }
    return conversation;
}
class EmulatorController {
    static registerRoutes(server) {
        server.router.get('/emulator/:conversationId/users', this.getUsers);
        server.router.post('/emulator/:conversationId/users', jsonBodyParser_1.jsonBodyParser(), this.addUsers);
        server.router.del('/emulator/:conversationId/users', this.removeUsers);
        server.router.post('/emulator/:conversationId/contacts', this.contactAdded);
        server.router.del('/emulator/:conversationId/contacts', this.contactRemoved);
        server.router.post('/emulator/:conversationId/typing', this.typing);
        server.router.post('/emulator/:conversationId/ping', this.ping);
        server.router.del('/emulator/:conversationId/userdata', this.deleteUserData);
        server.router.post('/emulator/:conversationId/invoke/updateShippingAddress', jsonBodyParser_1.jsonBodyParser(), this.updateShippingAddress);
        server.router.post('/emulator/:conversationId/invoke/updateShippingOption', jsonBodyParser_1.jsonBodyParser(), this.updateShippingOption);
        server.router.post('/emulator/:conversationId/invoke/paymentComplete', jsonBodyParser_1.jsonBodyParser(), this.paymentComplete);
        server.router.post('/emulator/system/quitAndInstall', this.quitAndInstall);
    }
}
EmulatorController.getUsers = (req, res, next) => {
    try {
        const conversation = getConversation(req.params.conversationId);
        res.json(HttpStatus.OK, conversation.members);
        res.end();
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
    }
};
EmulatorController.addUsers = (req, res, next) => {
    try {
        const conversation = getConversation(req.params.conversationId);
        const members = req.body;
        members.forEach((member) => {
            conversation.addMember(member.id, member.name);
        });
        res.send(HttpStatus.OK);
        res.end();
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
    }
};
EmulatorController.removeUsers = (req, res, next) => {
    try {
        let conversation = getConversation(req.params.conversationId);
        let members = req.body;
        if (!members) {
            let settings = settings_1.getSettings();
            members = [...conversation.members];
            members = members.filter(member => member.id != settings.users.currentUserId && member.id != conversation.botId);
            members = members.slice(0);
        }
        members.forEach((member) => {
            conversation.removeMember(member.id);
        });
        res.send(HttpStatus.OK);
        res.end();
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
    }
};
EmulatorController.contactAdded = (req, res, next) => {
    try {
        const conversation = getConversation(req.params.conversationId);
        conversation.sendContactAdded();
        res.send(HttpStatus.OK);
        res.end();
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
    }
};
EmulatorController.contactRemoved = (req, res, next) => {
    try {
        const conversation = getConversation(req.params.conversationId);
        conversation.sendContactRemoved();
        res.send(HttpStatus.OK);
        res.end();
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
    }
};
EmulatorController.typing = (req, res, next) => {
    try {
        const conversation = getConversation(req.params.conversationId);
        conversation.sendTyping();
        res.send(HttpStatus.OK);
        res.end();
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
    }
};
EmulatorController.ping = (req, res, next) => {
    try {
        const conversation = getConversation(req.params.conversationId);
        conversation.sendPing();
        res.send(HttpStatus.OK);
        res.end();
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
    }
};
EmulatorController.deleteUserData = (req, res, next) => {
    try {
        const conversation = getConversation(req.params.conversationId);
        conversation.sendDeleteUserData();
        res.send(HttpStatus.OK);
        res.end();
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
    }
};
EmulatorController.updateShippingAddress = (req, res, next) => {
    try {
        const conversation = getConversation(req.params.conversationId);
        const body = req.body[0];
        conversation.sendUpdateShippingAddressOperation(body.checkoutSession, body.request, body.shippingAddress, body.shippingOptionId, (statusCode, body) => {
            if (statusCode === HttpStatus.OK) {
                res.send(HttpStatus.OK, body);
            }
            else {
                res.send(statusCode);
            }
            res.end();
        });
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
    }
};
EmulatorController.updateShippingOption = (req, res, next) => {
    try {
        const conversation = getConversation(req.params.conversationId);
        const body = req.body[0];
        conversation.sendUpdateShippingOptionOperation(body.checkoutSession, body.request, body.shippingAddress, body.shippingOptionId, (statusCode, body) => {
            if (statusCode === HttpStatus.OK) {
                res.send(HttpStatus.OK, body);
            }
            else {
                res.send(statusCode);
            }
            res.end();
        });
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
    }
};
EmulatorController.paymentComplete = (req, res, next) => {
    try {
        const conversation = getConversation(req.params.conversationId);
        const body = req.body[0];
        conversation.sendPaymentCompleteOperation(body.checkoutSession, body.request, body.shippingAddress, body.shippingOptionId, body.payerEmail, body.payerPhone, (statusCode, body) => {
            if (statusCode === HttpStatus.OK) {
                res.send(HttpStatus.OK, body);
            }
            else {
                res.send(statusCode);
            }
            res.end();
        });
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
    }
};
EmulatorController.quitAndInstall = (req, res, next) => {
    try {
        if (electron_1.autoUpdater) {
            electron_1.autoUpdater.quitAndInstall();
        }
        res.send(HttpStatus.OK);
        res.end();
    }
    catch (err) {
        ResponseTypes.sendErrorResponse(req, res, next, err);
    }
};
exports.EmulatorController = EmulatorController;
//# sourceMappingURL=emulatorController.js.map