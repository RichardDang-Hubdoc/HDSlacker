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
const React = require("react");
const settings_1 = require("../settings");
const addressBarOperators_1 = require("./addressBarOperators");
const remote = require('electron').remote;
class AddressBarBotCreds extends React.Component {
    constructor() {
        super(...arguments);
        this.appIdChanged = (text) => {
            const settings = settings_1.getSettings();
            let bot = Object.assign({}, settings.addressBar.selectedBot);
            bot.msaAppId = text;
            addressBarOperators_1.AddressBarOperators.addOrUpdateBot(bot);
        };
        this.appPasswordChanged = (text) => {
            const settings = settings_1.getSettings();
            let bot = Object.assign({}, settings.addressBar.selectedBot);
            bot.msaPassword = text;
            addressBarOperators_1.AddressBarOperators.addOrUpdateBot(bot);
        };
        this.localeChanged = (text) => {
            const settings = settings_1.getSettings();
            let bot = Object.assign({}, settings.addressBar.selectedBot);
            bot.locale = text.trim();
            addressBarOperators_1.AddressBarOperators.addOrUpdateBot(bot);
        };
        this.connectToBot = () => {
            const settings = settings_1.getSettings();
            const bot = settings.addressBar.selectedBot;
            if (bot) {
                addressBarOperators_1.AddressBarOperators.connectToBot(bot);
            }
        };
        this.onKeyPress = (e) => {
            if (!this.isVisible())
                return;
            if (e.key && e.key === 'Enter') {
                this.connectToBot();
            }
        };
        this.isVisible = () => {
            const settings = settings_1.getSettings();
            if (!settings.addressBar.showBotCreds)
                return false;
            if (settings.addressBar.showSearchResults)
                return false;
            if (!settings.addressBar.selectedBot)
                return false;
            return true;
        };
    }
    componentWillMount() {
        window.addEventListener('keypress', (e) => this.onKeyPress(e));
        this.settingsUnsubscribe = settings_1.addSettingsListener(() => {
            this.forceUpdate();
        });
    }
    componentWillUnmount() {
        window.removeEventListener('keypress', (e) => this.onKeyPress(e));
        this.settingsUnsubscribe();
    }
    render() {
        if (!this.isVisible())
            return null;
        const settings = settings_1.getSettings();
        return (React.createElement("div", { className: "addressbar-botcreds" },
            React.createElement("div", { className: "input-group" },
                React.createElement("label", { className: "form-label" }, "Microsoft App ID:"),
                React.createElement("input", { type: "text", className: "form-input addressbar-botcreds-input addressbar-botcreds-appid", value: settings.addressBar.selectedBot.msaAppId, onChange: e => this.appIdChanged(e.target.value) })),
            React.createElement("div", { className: "input-group" },
                React.createElement("label", { className: "form-label" }, "Microsoft App Password:"),
                React.createElement("input", { type: "password", className: "form-input addressbar-botcreds-input addressbar-botcreds-password", value: settings.addressBar.selectedBot.msaPassword, onChange: e => this.appPasswordChanged(e.target.value) })),
            React.createElement("div", { className: "input-group" },
                React.createElement("label", { className: "form-label" }, "Locale:"),
                React.createElement("input", { type: "text", className: "form-input addressbar-botcreds-input addressbar-botcreds-locale", value: settings.addressBar.selectedBot.locale || remote.app.getLocale(), onChange: e => this.localeChanged(e.target.value) })),
            React.createElement("div", { className: "input-group" },
                React.createElement("button", { className: "addressbar-botcreds-connect-button", onClick: () => this.connectToBot() }, "Connect")),
            React.createElement("div", { className: "addressbar-botcreds-callout" })));
    }
}
exports.AddressBarBotCreds = AddressBarBotCreds;
//# sourceMappingURL=addressBarBotCreds.js.map