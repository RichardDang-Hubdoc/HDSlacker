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
const settings_1 = require("../settings");
const reducers_1 = require("../reducers");
const reducers_2 = require("../reducers");
class AddressBarOperators {
    static getMatchingBots(text, bots) {
        const settings = settings_1.getSettings();
        text = text || settings.addressBar.text;
        bots = bots || settings.serverSettings.bots;
        if (text.length === 0)
            return bots;
        const lower = text.toLowerCase();
        return bots.filter(bot => bot.botUrl.toLowerCase().includes(lower));
    }
    static findMatchingBotForUrl(text, bots) {
        const settings = settings_1.getSettings();
        text = text || settings.addressBar.text;
        bots = bots || settings.serverSettings.bots;
        let bot = null;
        if (bots && text && text.length) {
            const lower = text.toLowerCase();
            bot = bots.find(bot => lower === bot.botUrl.toLowerCase());
        }
        return bot;
    }
    static selectBotForUrl(text, bots) {
        const bot = AddressBarOperators.findMatchingBotForUrl(text, bots);
        reducers_2.AddressBarActions.selectBot(bot);
        return bot;
    }
    static selectBot(bot) {
        reducers_2.AddressBarActions.selectBot(bot);
    }
    static clearMatchingBots() {
        reducers_2.AddressBarActions.setMatchingBots([]);
    }
    static addOrUpdateBot(bot) {
        const settings = settings_1.getSettings();
        if (settings.addressBar.selectedBot && settings.addressBar.selectedBot.botId === bot.botId) {
            reducers_2.AddressBarActions.selectBot(bot);
        }
        reducers_2.ServerSettingsActions.remote_addOrUpdateBot(bot);
    }
    static setMatchingBots(bots) {
        reducers_2.AddressBarActions.setMatchingBots(bots);
    }
    static updateMatchingBots(text, bots) {
        const settings = settings_1.getSettings();
        text = text || settings.addressBar.text;
        bots = bots || settings.serverSettings.bots;
        const matchingBots = AddressBarOperators.getMatchingBots(text, bots);
        reducers_2.AddressBarActions.setMatchingBots(matchingBots);
        return matchingBots;
    }
    static setText(text) {
        reducers_2.AddressBarActions.setText(text);
    }
    static deleteBot(botId) {
        const settings = settings_1.getSettings();
        if (botId === settings.serverSettings.activeBot) {
            reducers_2.ServerSettingsActions.remote_setActiveBot('');
        }
        reducers_2.ServerSettingsActions.remote_deleteBot(botId);
    }
    static activateBot(bot) {
        reducers_2.ServerSettingsActions.remote_setActiveBot(bot.botId);
    }
    static isActiveBot(bot) {
        const settings = settings_1.getSettings();
        return !settings.serverSettings.activeBot ||
            settings.serverSettings.activeBot.length === 0 ||
            settings.serverSettings.activeBot === bot.botId; // active bot matches current bot
    }
    static connectToBot(bot) {
        if (!AddressBarOperators.isActiveBot(bot)) {
            reducers_1.LogActions.clear();
        }
        AddressBarOperators.selectBot(null);
        AddressBarOperators.addOrUpdateBot(bot);
        AddressBarOperators.activateBot(bot);
        reducers_2.ConversationActions.newConversation();
        reducers_2.AddressBarActions.hideBotCreds();
        reducers_2.AddressBarActions.hideSearchResults();
    }
    static assignBot(botContext) {
        const bot = AddressBarOperators.selectBotForUrl(botContext.endpoint, null) ||
            botContext.toBot();
        // update the bot with the passed in information
        const updatedBot = botContext.updateBot(bot);
        if (!AddressBarOperators.isActiveBot(updatedBot)) {
            reducers_1.LogActions.clear();
        }
        AddressBarOperators.setText(botContext.endpoint);
        AddressBarOperators.selectBot(updatedBot);
        AddressBarOperators.connectToBot(updatedBot);
        AddressBarOperators.selectBot(updatedBot);
    }
}
exports.AddressBarOperators = AddressBarOperators;
//# sourceMappingURL=addressBarOperators.js.map