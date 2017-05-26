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
const reducers_1 = require("../reducers");
const addressBarOperators_1 = require("./addressBarOperators");
const addressBarStatus_1 = require("./addressBarStatus");
const addressBarTextBox_1 = require("./addressBarTextBox");
const addressBarRefresh_1 = require("./addressBarRefresh");
const addressBarMenu_1 = require("./addressBarMenu");
const addressBarSearch_1 = require("./addressBarSearch");
const addressBarBotCreds_1 = require("./addressBarBotCreds");
class AddressBar extends React.Component {
    constructor() {
        super(...arguments);
        this.pageClicked = (ev) => {
            if (ev.defaultPrevented)
                return;
            const settings = settings_1.getSettings();
            let target = ev.srcElement;
            while (target) {
                // NOTE: Sometimes target.className is not a string. In one observed instance it was an SVGAnimatedString which didn't have an 'includes' function.
                if (target.className && target.className.toString().includes("addressbar")) {
                    ev.preventDefault();
                    return;
                }
                target = target.parentElement;
            }
            // Click was outside the address bar. Close open subpanels.
            addressBarOperators_1.AddressBarOperators.clearMatchingBots();
            if (settings.addressBar.showSearchResults)
                reducers_1.AddressBarActions.hideSearchResults();
            if (settings.addressBar.showBotCreds)
                reducers_1.AddressBarActions.hideBotCreds();
        };
    }
    componentWillMount() {
        window.addEventListener('click', (e) => this.pageClicked(e));
    }
    componentWillUnmount() {
        window.removeEventListener('click', (e) => this.pageClicked(e));
    }
    render() {
        return (React.createElement("div", { className: "addressbar" },
            React.createElement(addressBarStatus_1.AddressBarStatus, null),
            React.createElement(addressBarTextBox_1.AddressBarTextBox, null),
            React.createElement(addressBarRefresh_1.AddressBarRefresh, null),
            React.createElement(addressBarMenu_1.AddressBarMenu, null),
            React.createElement(addressBarSearch_1.AddressBarSearch, null),
            React.createElement(addressBarBotCreds_1.AddressBarBotCreds, null)));
    }
}
exports.AddressBar = AddressBar;
//# sourceMappingURL=addressBar.js.map