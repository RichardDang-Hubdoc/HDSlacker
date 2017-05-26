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
const Electron = require("electron");
const redux_1 = require("redux");
const frameworkReducer_1 = require("./reducers/frameworkReducer");
const botReducer_1 = require("./reducers/botReducer");
const windowStateReducer_1 = require("./reducers/windowStateReducer");
const usersReducer_1 = require("./reducers/usersReducer");
const utils_1 = require("../utils");
const serverSettingsTypes_1 = require("../types/serverSettingsTypes");
class PersistentSettings {
    constructor(settings) {
        Object.assign(this, {
            framework: settings.framework,
            bots: settings.bots,
            windowState: settings.windowState,
            users: settings.users
        });
    }
}
exports.PersistentSettings = PersistentSettings;
let started = false;
let store;
exports.getStore = () => {
    console.assert(started, 'getStore() called before startup!');
    if (!store) {
        // Create the settings store with initial settings from disk.
        const initialSettings = utils_1.loadSettings('server.json', serverSettingsTypes_1.settingsDefault);
        // TODO: Validate the settings still apply.
        store = redux_1.createStore(redux_1.combineReducers({
            framework: frameworkReducer_1.frameworkReducer,
            bots: botReducer_1.botsReducer,
            activeBot: botReducer_1.activeBotReducer,
            windowState: windowStateReducer_1.windowStateReducer,
            users: usersReducer_1.usersReducer
        }), initialSettings);
    }
    return store;
};
exports.dispatch = (obj) => exports.getStore().dispatch(obj);
exports.getSettings = () => {
    return new serverSettingsTypes_1.Settings(exports.getStore().getState());
};
let acting = false;
let actors = [];
exports.addSettingsListener = (actor) => {
    actors.push(actor);
    var isSubscribed = true;
    return function unsubscribe() {
        if (!isSubscribed) {
            return;
        }
        isSubscribed = false;
        let index = actors.indexOf(actor);
        actors.splice(index, 1);
    };
};
exports.startup = () => {
    // Listen for settings change requests from the client.
    Electron.ipcMain.on('serverChangeSetting', (event, ...args) => {
        // Apply change requests to the settings store.
        exports.getStore().dispatch({
            type: args[0],
            state: args[1]
        });
    });
    // Guard against calling getSettings before startup.
    started = true;
    // When changes to settings are made, save to disk.
    let saveTimer;
    exports.getStore().subscribe(() => {
        if (!acting) {
            acting = true;
            actors.forEach(actor => actor(exports.getSettings()));
            acting = false;
        }
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            utils_1.saveSettings('server.json', new PersistentSettings(exports.getStore().getState()));
        }, 1000);
    });
};
exports.authenticationSettings = {
    tokenEndpoint: 'https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token',
    openIdMetadata: 'https://login.microsoftonline.com/botframework.com/v2.0/.well-known/openid-configuration',
    tokenIssuer: 'https://sts.windows.net/d6d49420-f39b-4df7-a1dc-d59a935871db/',
    tokenAudience: 'https://api.botframework.com',
    stateEndpoint: 'https://state.botframework.com'
};
exports.v30AuthenticationSettings = {
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    tokenScope: 'https://graph.microsoft.com/.default',
    openIdMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    tokenIssuer: 'https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/',
    tokenAudience: 'https://graph.microsoft.com',
    stateEndpoint: 'https://state.botframework.com'
};
exports.speechSettings = {
    tokenEndpoint: 'https://login.botframework.com/v3/speechtoken'
};
//# sourceMappingURL=settings.js.map