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
const electron_1 = require("electron");
const URL = require("url");
const QueryString = require("querystring");
const reducers_1 = require("./reducers");
const settings_1 = require("./settings");
const serverSettingsTypes_1 = require("../types/serverSettingsTypes");
const emulator_1 = require("./emulator");
const paymentEncoder_1 = require("../shared/paymentEncoder");
const log = require("./log");
const Electron = require("electron");
const { BrowserWindow } = require('electron').remote;
function navigate(url) {
    try {
        const parsed = URL.parse(url);
        if (parsed.protocol === "emulator:") {
            const params = QueryString.parse(parsed.query);
            if (parsed.host === 'inspect') {
                navigateInspectUrl(params);
            }
            else if (parsed.host === 'appsettings') {
                navigateAppSettingsUrl(params);
            }
            else if (parsed.host === 'botcreds') {
                navigateBotCredsUrl(params);
            }
            else if (parsed.host === 'command') {
                navigateCommandUrl(params);
            }
        }
        else if (parsed.protocol.startsWith(paymentEncoder_1.PaymentEncoder.PaymentEmulatorUrlProtocol)) {
            navigatePaymentUrl(parsed.path);
        }
        else if (parsed.protocol.startsWith('file:')) {
            // ignore
        }
        else if (parsed.protocol.startsWith('javascript:')) {
            // ignore
        }
        else {
            electron_1.shell.openExternal(url, { activate: true });
        }
    }
    catch (e) {
        log.error(e.message);
    }
}
exports.navigate = navigate;
function navigateInspectUrl(params) {
    try {
        const encoded = params['obj'];
        let json;
        let obj;
        try {
            json = decodeURIComponent(encoded);
        }
        catch (e) {
            json = encoded;
        }
        try {
            obj = JSON.parse(json);
        }
        catch (e) {
            obj = json;
        }
        if (obj) {
            if (obj.id) {
                settings_1.selectedActivity$().next({ id: obj.id });
            }
            else if (obj.replyToId) {
                settings_1.selectedActivity$().next({ id: obj.replyToId });
            }
            else {
                settings_1.selectedActivity$().next({});
            }
            reducers_1.InspectorActions.setSelectedObject({ activity: obj });
        }
        else {
            settings_1.selectedActivity$().next({});
        }
    }
    catch (e) {
        settings_1.selectedActivity$().next({});
        throw e;
    }
}
function navigateAppSettingsUrl(args) {
    reducers_1.AddressBarActions.showAppSettings();
}
function navigateBotCredsUrl(args) {
    args = args || [];
    if (!args.length) {
        const settings = settings_1.getSettings();
        const activeBotId = settings.serverSettings.activeBot;
        if (activeBotId) {
            const activeBot = new serverSettingsTypes_1.Settings(settings.serverSettings).botById(activeBotId);
            reducers_1.AddressBarActions.selectBot(activeBot);
        }
    }
    else {
        // todo
    }
    reducers_1.AddressBarActions.showBotCreds();
}
function navigateCommandUrl(params) {
    if (!params || !params['args'])
        return;
    const json = decodeURIComponent(params['args']);
    const args = JSON.parse(json);
    if (typeof args === 'string' && args.includes('autoUpdater.quitAndInstall')) {
        emulator_1.Emulator.quitAndInstall();
    }
}
function navigatePaymentUrl(payload) {
    const settings = settings_1.getSettings();
    Electron.ipcRenderer.send("createCheckoutWindow", {
        payload: payload,
        settings: settings,
        serviceUrl: emulator_1.Emulator.serviceUrl
    });
}
//# sourceMappingURL=hyperlinkHandler.js.map