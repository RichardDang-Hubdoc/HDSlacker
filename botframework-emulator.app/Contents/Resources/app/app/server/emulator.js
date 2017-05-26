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
var http = require('http');
var https = require('https');
var ElectronProxyAgent = require('electron-proxy-agent');
const botFrameworkService_1 = require("./botFrameworkService");
const conversationManager_1 = require("./conversationManager");
const Settings = require("./settings");
const Electron = require("electron");
const main_1 = require("./main");
/**
 * Top-level state container for the Node process.
 */
class Emulator {
    constructor() {
        this.framework = new botFrameworkService_1.BotFrameworkService();
        this.conversations = new conversationManager_1.ConversationManager();
        // When the client notifies us it has started up, send it the configuration.
        // Note: We're intentionally sending and ISettings here, not a Settings. This
        // is why we're getting the value from getStore().getState().
        Electron.ipcMain.on('clientStarted', () => {
            // Use system proxy settings for outgoing requests
            const session = Electron.session.defaultSession;
            this.proxyAgent = new ElectronProxyAgent(session);
            http.globalAgent = this.proxyAgent;
            https.globalAgent = this.proxyAgent;
            main_1.windowManager.addMainWindow(main_1.mainWindow);
            Emulator.queuedMessages.forEach((msg) => {
                Emulator.send(msg.channel, ...msg.args);
            });
            Emulator.queuedMessages = [];
            Emulator.send('serverSettings', Settings.getStore().getState());
        });
        Settings.addSettingsListener(() => {
            Emulator.send('serverSettings', Settings.getStore().getState());
        });
        Electron.ipcMain.on('getSpeechToken', (event, args) => {
            // args is the conversation id
            this.getSpeechToken(event, args);
        });
        Electron.ipcMain.on('refreshSpeechToken', (event, args) => {
            // args is the conversation id
            this.getSpeechToken(event, args, true);
        });
    }
    getSpeechToken(event, conversationId, refresh = false) {
        const settings = Settings.getSettings();
        const activeBot = settings.getActiveBot();
        let tokenInfo;
        if (activeBot && activeBot.botId && conversationId) {
            let conversation = this.conversations.conversationById(activeBot.botId, conversationId);
            conversation.getSpeechToken(10, (tokenInfo) => {
                event.returnValue = tokenInfo;
            }, refresh);
        }
        else {
            event.returnValue = { error: 'No bot', error_Description: 'To use speech, you must connect to a bot and have an active conversation.' };
        }
    }
    /**
     * Loads settings from disk and then creates the emulator.
     */
    static startup() {
        Settings.startup();
        exports.emulator = new Emulator();
        exports.emulator.framework.startup();
    }
    /**
     * Sends a command to the client.
     */
    static send(channel, ...args) {
        if (main_1.windowManager && main_1.windowManager.hasMainWindow()) {
            main_1.windowManager.getMainWindow().webContents.send(channel, ...args);
        }
        else {
            Emulator.queuedMessages.push({ channel, args });
        }
    }
}
Emulator.queuedMessages = [];
exports.Emulator = Emulator;
//# sourceMappingURL=emulator.js.map