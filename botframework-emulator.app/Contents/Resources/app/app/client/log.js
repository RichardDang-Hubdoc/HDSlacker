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
const logView_1 = require("./logView");
function clear() {
    logView_1.LogView.clear();
}
exports.clear = clear;
function log(message, ...args) {
    logView_1.LogView.add(logView_1.Severity.log, message, ...args);
}
exports.log = log;
function info(message, ...args) {
    logView_1.LogView.add(logView_1.Severity.info, message, ...args);
}
exports.info = info;
function trace(message, ...args) {
    logView_1.LogView.add(logView_1.Severity.trace, message, ...args);
}
exports.trace = trace;
function debug(message, ...args) {
    logView_1.LogView.add(logView_1.Severity.debug, message, ...args);
}
exports.debug = debug;
function warn(message, ...args) {
    logView_1.LogView.add(logView_1.Severity.warn, message, ...args);
}
exports.warn = warn;
function error(message, ...args) {
    logView_1.LogView.add(logView_1.Severity.error, message, ...args);
}
exports.error = error;
//# sourceMappingURL=log.js.map