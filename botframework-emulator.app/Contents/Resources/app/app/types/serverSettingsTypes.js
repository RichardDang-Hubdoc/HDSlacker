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
class Settings {
    constructor(settings) {
        Object.assign(this, settings);
    }
    getActiveBot() {
        return this.botById(this.activeBot);
    }
    botById(botId) {
        return this.bots ? this.bots.find(value => value.botId === botId) : undefined;
    }
}
exports.Settings = Settings;
exports.frameworkDefault = {
    ngrokPath: '',
    bypassNgrokLocalhost: true
};
exports.windowStateDefault = {
    width: 800,
    height: 600,
    left: 100,
    top: 50
};
exports.usersDefault = {
    currentUserId: 'default-user',
    usersById: {
        'default-user': {
            id: 'default-user',
            name: 'User'
        }
    }
};
exports.settingsDefault = {
    framework: exports.frameworkDefault,
    bots: [
        {
            "botId": "default-bot",
            "botUrl": "http://127.0.0.1:3978/api/messages",
            "msaAppId": "",
            "msaPassword": ""
        }
    ],
    activeBot: '',
    windowState: exports.windowStateDefault,
    users: exports.usersDefault
};
//# sourceMappingURL=serverSettingsTypes.js.map