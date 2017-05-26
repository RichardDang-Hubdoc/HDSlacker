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
const rxjs_1 = require("rxjs");
const serverSettingsTypes_1 = require("../types/serverSettingsTypes");
const reducers_1 = require("./reducers");
const utils_1 = require("../utils");
const reducers_2 = require("./reducers");
const log = require("./log");
const emulator_1 = require("./emulator");
exports.selectedActivity$ = () => {
    if (!global['selectedActivity$']) {
        global['selectedActivity$'] = new rxjs_1.BehaviorSubject({});
    }
    return global['selectedActivity$'];
};
exports.deselectActivity = () => {
    exports.selectedActivity$().next({});
};
class PersistentSettings {
    constructor(settings) {
        Object.assign(this, {
            layout: {
                horizSplit: settings.layout.horizSplit,
                vertSplit: settings.layout.vertSplit
            },
            wordwrap: {
                wordwrap: settings.wordwrap.wordwrap
            }
        });
    }
}
exports.PersistentSettings = PersistentSettings;
class Settings {
    constructor(settings) {
        Object.assign(this, settings);
    }
}
exports.Settings = Settings;
exports.layoutDefault = {
    horizSplit: '33%',
    vertSplit: '33%'
};
exports.addressBarDefault = {
    text: '',
    matchingBots: [],
    selectedBot: null,
    showAbout: false,
    showAppSettings: false,
    showConversationSettings: false,
    showSearchResults: false,
    showBotCreds: false
};
exports.conversationDefault = {
    chatEnabled: false,
    conversationId: ''
};
exports.logDefault = {
    autoscroll: true
};
exports.wordWrapDefault = {
    wordwrap: false
};
exports.inspectorDefault = {
    selectedObject: null
};
exports.settingsDefault = {
    layout: exports.layoutDefault,
    addressBar: exports.addressBarDefault,
    conversation: exports.conversationDefault,
    log: exports.logDefault,
    wordwrap: exports.wordWrapDefault,
    inspector: exports.inspectorDefault,
    serverSettings: new serverSettingsTypes_1.Settings()
};
let store;
const getStore = () => {
    if (!store) {
        // Create the settings store with initial settings from disk.
        const initialSettings = utils_1.loadSettings('client.json', exports.settingsDefault);
        store = redux_1.createStore(redux_1.combineReducers({
            layout: reducers_2.layoutReducer,
            addressBar: reducers_2.addressBarReducer,
            conversation: reducers_2.conversationReducer,
            log: reducers_2.logReducer,
            wordwrap: reducers_2.wordWrapReducer,
            inspector: reducers_2.inspectorReducer,
            serverSettings: reducers_2.serverSettingsReducer
        }), initialSettings);
    }
    return store;
};
exports.dispatch = (obj) => getStore().dispatch(obj);
exports.getSettings = () => new Settings(getStore().getState());
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
    // When changes to settings are made, save to disk.
    let saveTimer;
    getStore().subscribe(() => {
        if (!acting) {
            acting = true;
            actors.forEach(actor => actor(exports.getSettings()));
            acting = false;
        }
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            utils_1.saveSettings('client.json', new PersistentSettings(getStore().getState()));
        }, 1000);
    });
    exports.selectedActivity$().subscribe((value) => {
        reducers_1.InspectorActions.setSelectedObject(value);
    });
    // Listen for new settings from the server.
    Electron.ipcRenderer.on('serverSettings', (event, ...args) => {
        const serverSettings = new serverSettingsTypes_1.Settings(args[0]);
        reducers_2.ServerSettingsActions.set(serverSettings);
    });
    // Listen for log messages from the server.
    Electron.ipcRenderer.on('log-log', (event, ...args) => {
        log.log(args[0], ...args.slice(1));
    });
    Electron.ipcRenderer.on('log-info', (event, ...args) => {
        log.info(args[0], ...args.slice(1));
    });
    Electron.ipcRenderer.on('log-trace', (event, ...args) => {
        log.trace(args[0], ...args.slice(1));
    });
    Electron.ipcRenderer.on('log-debug', (event, ...args) => {
        log.debug(args[0], ...args.slice(1));
    });
    Electron.ipcRenderer.on('log-warn', (event, ...args) => {
        log.warn(args[0], ...args.slice(1));
    });
    Electron.ipcRenderer.on('log-error', (event, ...args) => {
        log.error(args[0], ...args.slice(1));
    });
    Electron.ipcRenderer.on('show-about', () => {
        reducers_2.AddressBarActions.showAbout();
    });
    Electron.ipcRenderer.on('new-conversation', (event, ...args) => {
        reducers_1.ConversationActions.newConversation(args[0]);
    });
    Electron.ipcRenderer.on('listening', (event, ...args) => {
        emulator_1.Emulator.serviceUrl = args[0].serviceUrl;
    });
    // Let the server know we're done starting up. In response, it will send us it's current settings (bot list and such).
    Electron.ipcRenderer.send('clientStarted');
};
/**
 * Sends settings change requests to the server.
 * TODO: Pass this through the Emulator REST API rather than IPC (for future headless emulator support).
 */
exports.serverChangeSetting = (action, state) => {
    Electron.ipcRenderer.send('serverChangeSetting', action, state);
};
//# sourceMappingURL=settings.js.map