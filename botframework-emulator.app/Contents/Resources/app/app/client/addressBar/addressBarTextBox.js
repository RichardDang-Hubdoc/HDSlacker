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
const serverSettingsTypes_1 = require("../../types/serverSettingsTypes");
const reducers_1 = require("../reducers");
const botTypes_1 = require("../../types/botTypes");
const addressBarOperators_1 = require("./addressBarOperators");
class AddressBarTextBox extends React.Component {
    onChange(text) {
        text = text || '';
        reducers_1.AddressBarActions.setText(text);
        const bots = addressBarOperators_1.AddressBarOperators.updateMatchingBots(text, null) || [];
        if (text.length) {
            if (!bots.length) {
                addressBarOperators_1.AddressBarOperators.selectBot(botTypes_1.newBot({ botUrl: text }));
                reducers_1.AddressBarActions.showBotCreds();
            }
            else if (bots.length === 1) {
                if (bots[0].botUrl.toLowerCase() === text.toLowerCase()) {
                    addressBarOperators_1.AddressBarOperators.selectBot(bots[0]);
                    reducers_1.AddressBarActions.showBotCreds();
                }
                else {
                    reducers_1.AddressBarActions.showSearchResults();
                }
            }
            else if (bots.length) {
                addressBarOperators_1.AddressBarOperators.selectBot(null);
                reducers_1.AddressBarActions.showSearchResults();
            }
        }
        else {
            reducers_1.AddressBarActions.showSearchResults();
        }
    }
    onFocus() {
        this.textBoxRef.select();
        const settings = settings_1.getSettings();
        const bots = addressBarOperators_1.AddressBarOperators.getMatchingBots(settings.addressBar.text, null);
        if (settings.addressBar.text.length) {
            const bot = addressBarOperators_1.AddressBarOperators.findMatchingBotForUrl(settings.addressBar.text, bots) || botTypes_1.newBot({ botUrl: settings.addressBar.text });
            if (bot) {
                addressBarOperators_1.AddressBarOperators.selectBot(bot);
                reducers_1.AddressBarActions.showBotCreds();
            }
            else {
                addressBarOperators_1.AddressBarOperators.updateMatchingBots(settings.addressBar.text, bots);
                reducers_1.AddressBarActions.showSearchResults();
            }
        }
        else {
            addressBarOperators_1.AddressBarOperators.updateMatchingBots(settings.addressBar.text, bots);
            reducers_1.AddressBarActions.showSearchResults();
        }
    }
    onBlur() {
        const settings = settings_1.getSettings();
        const activeBot = (new serverSettingsTypes_1.Settings(settings.serverSettings)).getActiveBot();
        //if (activeBot) {
        //    AddressBarActions.setText(activeBot.botUrl);
        //}
    }
    componentWillMount() {
        this.settingsUnsubscribe = settings_1.addSettingsListener((settings) => {
            this.forceUpdate();
        });
    }
    componentWillUnmount() {
        this.settingsUnsubscribe();
    }
    render() {
        const settings = settings_1.getSettings();
        return (React.createElement("div", { className: "addressbar-textbox" },
            React.createElement("input", { type: "text", ref: ref => this.textBoxRef = ref, value: settings.addressBar.text, onChange: e => this.onChange(e.target.value), onFocus: () => this.onFocus(), onBlur: () => this.onBlur(), placeholder: "Enter your endpoint URL" })));
    }
}
exports.AddressBarTextBox = AddressBarTextBox;
//# sourceMappingURL=addressBarTextBox.js.map