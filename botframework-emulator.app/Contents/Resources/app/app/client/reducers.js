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
const utils_1 = require("../utils");
const log = require("./log");
const settings_1 = require("./settings");
class LayoutActions {
    static rememberHorizontalSplitter(size) {
        settings_1.dispatch({
            type: 'Splitter_RememberHorizontal',
            state: {
                size: Number(size)
            }
        });
    }
    static rememberVerticalSplitter(size) {
        settings_1.dispatch({
            type: 'Splitter_RememberVertical',
            state: {
                size: Number(size)
            }
        });
    }
}
exports.LayoutActions = LayoutActions;
class WordWrapAction {
    static setWordWrap(wordwrap) {
        settings_1.dispatch({
            type: 'Log_SetWordWrap',
            state: {
                wordwrap: wordwrap
            }
        });
    }
}
exports.WordWrapAction = WordWrapAction;
class AddressBarActions {
    static setText(text) {
        settings_1.dispatch({
            type: 'AddressBar_SetText',
            state: {
                text
            }
        });
    }
    static setMatchingBots(matchingBots) {
        settings_1.dispatch({
            type: 'AddressBar_SetMatchingBots',
            state: {
                matchingBots
            }
        });
    }
    static selectBot(bot) {
        settings_1.dispatch({
            type: 'AddressBar_SelectBot',
            state: {
                bot
            }
        });
    }
    static showAbout() {
        this.hideBotCreds();
        this.hideSearchResults();
        settings_1.dispatch({
            type: 'AddressBar_ShowAbout'
        });
    }
    static hideAbout() {
        settings_1.dispatch({
            type: 'AddressBar_HideAbout'
        });
    }
    static showAppSettings() {
        this.hideBotCreds();
        this.hideSearchResults();
        settings_1.dispatch({
            type: 'AddressBar_ShowAppSettings'
        });
    }
    static hideAppSettings() {
        settings_1.dispatch({
            type: 'AddressBar_HideAppSettings'
        });
    }
    static showConversationSettings() {
        this.hideBotCreds();
        this.hideSearchResults();
        settings_1.dispatch({
            type: 'AddressBar_ShowConversationSettings'
        });
    }
    static hideConversationSettings() {
        settings_1.dispatch({
            type: 'AddressBar_HideConversationSettings'
        });
    }
    static showSearchResults() {
        this.hideBotCreds();
        settings_1.dispatch({
            type: 'AddressBar_ShowSearchResults'
        });
    }
    static hideSearchResults() {
        settings_1.dispatch({
            type: 'AddressBar_HideSearchResults'
        });
    }
    static showBotCreds() {
        this.hideSearchResults();
        settings_1.dispatch({
            type: 'AddressBar_ShowBotCreds'
        });
    }
    static hideBotCreds() {
        settings_1.dispatch({
            type: 'AddressBar_HideBotCreds'
        });
    }
}
exports.AddressBarActions = AddressBarActions;
class ConversationActions {
    static newConversation(conversationId) {
        settings_1.dispatch({
            type: 'Conversation_SetConversationId',
            state: {
                conversationId: conversationId || utils_1.uniqueId()
            }
        });
    }
    static endConversation() {
        settings_1.dispatch({
            type: 'Conversation_SetConversationId',
            state: {
                conversationId: null
            }
        });
    }
    static joinConversation(conversationId) {
        settings_1.dispatch({
            type: 'Conversation_SetConversationId',
            state: {
                conversationId
            }
        });
    }
}
exports.ConversationActions = ConversationActions;
class LogActions {
    static setAutoscroll(autoscroll) {
        settings_1.dispatch({
            type: 'Log_SetAutoscroll',
            state: {
                autoscroll
            }
        });
    }
    static clear() {
        log.clear();
    }
}
exports.LogActions = LogActions;
class InspectorActions {
    static setSelectedObject(selectedObject) {
        settings_1.dispatch({
            type: 'Inspector_SetSelectedObject',
            state: {
                selectedObject
            }
        });
    }
    static clear() {
        settings_1.dispatch({
            type: 'Inspector_Clear'
        });
    }
}
exports.InspectorActions = InspectorActions;
class ServerSettingsActions {
    static set(value) {
        settings_1.dispatch({
            type: 'ServerSettings_Set',
            state: {
                value
            }
        });
    }
    static remote_addOrUpdateBot(bot) {
        settings_1.serverChangeSetting('Bots_AddOrUpdateBot', { bot });
    }
    static remote_deleteBot(botId) {
        settings_1.serverChangeSetting('Bots_RemoveBot', { botId });
    }
    static remote_setActiveBot(botId) {
        settings_1.serverChangeSetting('ActiveBot_Set', { botId });
    }
    static remote_setCurrentUser(user) {
        settings_1.serverChangeSetting('Users_SetCurrentUser', { user });
    }
    static remote_setFrameworkServerSettings(state) {
        settings_1.serverChangeSetting('Framework_Set', state);
    }
}
exports.ServerSettingsActions = ServerSettingsActions;
exports.layoutReducer = (state = settings_1.layoutDefault, action) => {
    switch (action.type) {
        case 'Splitter_RememberHorizontal':
            return Object.assign({}, state, { horizSplit: action.state.size });
        case 'Splitter_RememberVertical':
            return Object.assign({}, state, { vertSplit: action.state.size });
        default:
            return state;
    }
};
exports.wordWrapReducer = (state = settings_1.wordWrapDefault, action) => {
    switch (action.type) {
        case 'Log_SetWordWrap':
            return Object.assign({}, state, { wordwrap: action.state.wordwrap });
        default:
            return state;
    }
};
exports.addressBarReducer = (state = settings_1.addressBarDefault, action) => {
    switch (action.type) {
        case 'AddressBar_SetText':
            return Object.assign({}, state, { text: action.state.text });
        case 'AddressBar_SetMatchingBots':
            return Object.assign({}, state, { matchingBots: action.state.matchingBots });
        case 'AddressBar_SelectBot':
            return Object.assign({}, state, { selectedBot: action.state.bot });
        case 'AddressBar_ShowAbout':
            return Object.assign({}, state, { showAbout: true });
        case 'AddressBar_HideAbout':
            return Object.assign({}, state, { showAbout: false });
        case 'AddressBar_ShowAppSettings':
            return Object.assign({}, state, { showAppSettings: true });
        case 'AddressBar_HideAppSettings':
            return Object.assign({}, state, { showAppSettings: false });
        case 'AddressBar_ShowConversationSettings':
            return Object.assign({}, state, { showConversationSettings: true });
        case 'AddressBar_HideConversationSettings':
            return Object.assign({}, state, { showConversationSettings: false });
        case 'AddressBar_ShowSearchResults':
            return Object.assign({}, state, { showSearchResults: true });
        case 'AddressBar_HideSearchResults':
            return Object.assign({}, state, { showSearchResults: false });
        case 'AddressBar_ShowBotCreds':
            return Object.assign({}, state, { showBotCreds: true });
        case 'AddressBar_HideBotCreds':
            return Object.assign({}, state, { showBotCreds: false });
        default:
            return state;
    }
};
exports.conversationReducer = (state = settings_1.conversationDefault, action) => {
    switch (action.type) {
        case 'Conversation_SetConversationId':
            return Object.assign({}, state, { conversationId: action.state.conversationId });
        default:
            return state;
    }
};
exports.logReducer = (state = settings_1.logDefault, action) => {
    switch (action.type) {
        case 'Log_SetAutoscroll':
            return Object.assign({}, state, { autoscroll: action.state.autoscroll });
        default:
            return state;
    }
};
exports.inspectorReducer = (state = settings_1.inspectorDefault, action) => {
    switch (action.type) {
        case 'Inspector_SetSelectedObject':
            return Object.assign({}, state, { selectedObject: action.state.selectedObject ? action.state.selectedObject.activity : null });
        case 'Inspector_Clear':
            return Object.assign({}, state, { selectedObject: null });
        default:
            return state;
    }
};
exports.serverSettingsReducer = (state = {}, action) => {
    switch (action.type) {
        case 'ServerSettings_Set':
            return Object.assign({}, action.state.value);
        default:
            return state;
    }
};
//# sourceMappingURL=reducers.js.map