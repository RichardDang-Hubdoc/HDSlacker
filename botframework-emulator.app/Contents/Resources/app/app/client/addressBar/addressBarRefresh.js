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
const Constants = require("../constants");
const reducers_1 = require("../reducers");
const settings_1 = require("../settings");
class AddressBarRefresh extends React.Component {
    constructor() {
        super(...arguments);
        this.refreshClicked = () => {
            const settings = settings_1.getSettings();
            let enabled = ((settings.serverSettings.activeBot || '').length > 0 && (settings.conversation.conversationId || '').length > 0);
            if (enabled) {
                reducers_1.ConversationActions.newConversation();
            }
        };
    }
    render() {
        const settings = settings_1.getSettings();
        let enabled = ((settings.serverSettings.activeBot || '').length > 0 && (settings.conversation.conversationId || '').length > 0);
        return (React.createElement("a", { className: 'undecorated-text', href: 'javascript:void(0)', title: 'Start new conversation' },
            React.createElement("div", { className: 'addressbar-refresh', dangerouslySetInnerHTML: { __html: Constants.reloadIcon("toolbar-button" + (enabled ? "" : " toolbar-button-disabled"), 24) }, onClick: () => this.refreshClicked() })));
    }
}
exports.AddressBarRefresh = AddressBarRefresh;
//# sourceMappingURL=addressBarRefresh.js.map