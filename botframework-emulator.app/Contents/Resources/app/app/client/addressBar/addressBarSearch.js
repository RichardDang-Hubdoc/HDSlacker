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
const Constants = require("../constants");
class AddressBarSearch extends React.Component {
    componentWillMount() {
        this.settingsUnsubscribe = settings_1.addSettingsListener(() => {
            this.forceUpdate();
        });
    }
    componentWillUnmount() {
        this.settingsUnsubscribe();
    }
    searchResultComponents() {
        const settings = settings_1.getSettings();
        return settings.addressBar.matchingBots.map((bot, index) => React.createElement(AddressBarSearchResult, { index: index, bot: bot, key: bot.botId }));
    }
    render() {
        const settings = settings_1.getSettings();
        if (!settings.addressBar.showSearchResults)
            return null;
        if (settings.addressBar.showBotCreds)
            return null;
        if (!settings.addressBar.matchingBots || !settings.addressBar.matchingBots.length)
            return null;
        return (React.createElement("div", { className: "addressbar-search" }, this.searchResultComponents()));
    }
}
exports.AddressBarSearch = AddressBarSearch;
class AddressBarSearchResult extends React.Component {
    selectBot() {
        addressBarOperators_1.AddressBarOperators.setText(this.props.bot.botUrl);
        addressBarOperators_1.AddressBarOperators.selectBot(this.props.bot);
        addressBarOperators_1.AddressBarOperators.clearMatchingBots();
        reducers_1.AddressBarActions.showBotCreds();
    }
    deleteBot() {
        const settings = settings_1.getSettings();
        if (settings.addressBar.selectedBot && settings.addressBar.selectedBot.botId === this.props.bot.botId) {
            addressBarOperators_1.AddressBarOperators.setText('');
            addressBarOperators_1.AddressBarOperators.selectBot(null);
        }
        const matchingBots = settings.addressBar.matchingBots.filter(bot => bot.botId !== this.props.bot.botId);
        addressBarOperators_1.AddressBarOperators.setMatchingBots(matchingBots);
        addressBarOperators_1.AddressBarOperators.deleteBot(this.props.bot.botId);
    }
    render() {
        return (React.createElement("div", { className: 'addressbar-searchresult' },
            React.createElement("div", { className: 'addressbar-searchresult-title', onClick: () => this.selectBot() },
                React.createElement("a", { className: 'addressbar-searchresult-a', href: 'javascript:void(0)', onClick: () => this.selectBot() }, this.props.bot.botUrl)),
            React.createElement("a", { href: 'javascript:void(0)', onClick: () => this.deleteBot() },
                React.createElement("div", { className: 'addressbar-searchresult-delete', onClick: () => this.deleteBot(), dangerouslySetInnerHTML: { __html: Constants.clearCloseIcon('', 16) } }))));
    }
}
//# sourceMappingURL=addressBarSearch.js.map