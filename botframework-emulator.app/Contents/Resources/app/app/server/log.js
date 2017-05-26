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
const emulator_1 = require("./emulator");
const utils_1 = require("../utils");
const sendMessage = (method, message, ...args) => {
    emulator_1.Emulator.send(method, message, ...args);
};
exports.log = (message, ...args) => {
    sendMessage('log-log', message, ...args);
};
exports.info = (message, ...args) => {
    sendMessage('log-info', message, ...args);
};
exports.trace = (message, ...args) => {
    sendMessage('log-trace', message, ...args);
};
exports.debug = (message, ...args) => {
    sendMessage('log-debug', message, ...args);
};
exports.warn = (message, ...args) => {
    sendMessage('log-warn', message, ...args);
};
exports.error = (message, ...args) => {
    sendMessage('log-error', message, ...args);
};
exports.makeLinkMessage = (text, link, title) => {
    return {
        messageType: 'link',
        text,
        link,
        title
    };
};
exports.ngrokConfigurationLink = (text) => {
    return exports.makeLinkMessage(text, 'emulator://appsettings?tab=NgrokConfig');
};
exports.botCredsConfigurationLink = (text) => {
    return exports.makeLinkMessage(text, 'emulator://botcreds');
};
exports.api = (operation, req, res, request, response, text) => {
    if (res.statusCode >= 400) {
        exports.error('<-', exports.makeInspectorLink(`${req.method}`, request), exports.makeInspectorLink(`${res.statusCode}`, response, `(${res.statusMessage})`), operation, text);
    }
    else {
        exports.info('<-', exports.makeInspectorLink(`${req.method}`, request), exports.makeInspectorLink(`${res.statusCode}`, response, `(${res.statusMessage})`), operation, text);
    }
};
exports.makeInspectorLink = (text, obj, title) => {
    if (obj) {
        const json = utils_1.safeStringify(obj);
        return exports.makeLinkMessage(text, `emulator://inspect?obj=${encodeURIComponent(json)}`, title);
    }
    else {
        return text;
    }
};
exports.makeCommandLink = (text, args, title) => {
    const json = JSON.stringify(args);
    return exports.makeLinkMessage(text, `emulator://command?args=${encodeURIComponent(json)}`, title);
};
//# sourceMappingURL=log.js.map