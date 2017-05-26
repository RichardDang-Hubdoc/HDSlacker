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
const request = require("request");
const settings_1 = require("./settings");
class Emulator {
    static addUser(name, id) {
        const settings = settings_1.getSettings();
        let options = {
            url: `${this.serviceUrl}/emulator/${settings.conversation.conversationId}/users`,
            method: "POST",
            json: [{ name, id }]
        };
        request(options);
    }
    static removeUser(id) {
        const settings = settings_1.getSettings();
        let options = {
            url: `${this.serviceUrl}/emulator/${settings.conversation.conversationId}/users`,
            method: "DELETE",
            json: [{ id }]
        };
        request(options);
    }
    static removeRandomUser() {
        const settings = settings_1.getSettings();
        let options = {
            url: `${this.serviceUrl}/emulator/${settings.conversation.conversationId}/users`,
            method: "DELETE"
        };
        request(options);
    }
    static botContactAdded() {
        const settings = settings_1.getSettings();
        let options = {
            url: `${this.serviceUrl}/emulator/${settings.conversation.conversationId}/contacts`,
            method: "POST"
        };
        request(options);
    }
    static botContactRemoved() {
        const settings = settings_1.getSettings();
        let options = {
            url: `${this.serviceUrl}/emulator/${settings.conversation.conversationId}/contacts`,
            method: "DELETE"
        };
        request(options);
    }
    static typing() {
        const settings = settings_1.getSettings();
        let options = {
            url: `${this.serviceUrl}/emulator/${settings.conversation.conversationId}/typing`,
            method: "POST"
        };
        request(options);
    }
    static ping() {
        const settings = settings_1.getSettings();
        let options = {
            url: `${this.serviceUrl}/emulator/${settings.conversation.conversationId}/ping`,
            method: "POST"
        };
        request(options);
    }
    static deleteUserData() {
        const settings = settings_1.getSettings();
        let options = {
            url: `${this.serviceUrl}/emulator/${settings.conversation.conversationId}/userdata`,
            method: "DELETE"
        };
        request(options);
    }
    static updateShippingAddress(checkoutSession, paymentRequest, shippingAddress, shippingOptionId, cb) {
        const settings = settings_1.getSettings();
        let options = {
            url: `${this.serviceUrl}/emulator/${settings.conversation.conversationId}/invoke/updateShippingAddress`,
            method: "POST",
            json: [{ checkoutSession: checkoutSession, request: paymentRequest, shippingAddress: shippingAddress, shippingOptionId: shippingOptionId }],
        };
        let responseCallback = (err, resp, body) => {
            cb(err, resp.statusCode, body);
        };
        request(options, responseCallback);
    }
    static updateShippingOption(checkoutSession, paymentRequest, shippingAddress, shippingOptionId, cb) {
        const settings = settings_1.getSettings();
        let options = {
            url: `${this.serviceUrl}/emulator/${settings.conversation.conversationId}/invoke/updateShippingOption`,
            method: "POST",
            json: [{ checkoutSession: checkoutSession, request: paymentRequest, shippingAddress: shippingAddress, shippingOptionId: shippingOptionId }],
        };
        let responseCallback = (err, resp, body) => {
            cb(err, resp.statusCode, body);
        };
        request(options, responseCallback);
    }
    static paymentComplete(checkoutSession, paymentRequest, shippingAddress, shippingOptionId, payerEmail, payerPhone, cb) {
        const settings = settings_1.getSettings();
        let options = {
            url: `${this.serviceUrl}/emulator/${settings.conversation.conversationId}/invoke/paymentComplete`,
            method: "POST",
            json: [{ checkoutSession: checkoutSession, request: paymentRequest, shippingAddress: shippingAddress, shippingOptionId: shippingOptionId, payerEmail: payerEmail, payerPhone: payerPhone }],
        };
        let responseCallback = (err, resp, body) => {
            cb(err, resp.statusCode, body);
        };
        request(options, responseCallback);
    }
    static quitAndInstall() {
        const settings = settings_1.getSettings();
        let options = {
            url: `${this.serviceUrl}/emulator/system/quitAndInstall`,
            method: "POST"
        };
        request(options);
    }
}
exports.Emulator = Emulator;
//# sourceMappingURL=emulator.js.map