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
const utils_1 = require("../../utils");
class CheckoutSettings {
    constructor() {
        this._settings = this.getSettings();
    }
    getSettings() {
        if (!this._settings) {
            this._settings = utils_1.loadSettings('checkout.json', {
                creditCards: [],
                shippingAddresses: [],
                email: '',
                phoneNumber: ''
            });
        }
        return Object.assign({}, this._settings);
    }
    updateEmail(email) {
        this._settings.email = email;
        this.saveCheckoutSettings();
    }
    updatePhoneNumber(phoneNumber) {
        this._settings.phoneNumber = phoneNumber;
        this.saveCheckoutSettings();
    }
    addCreditCard(creditCard) {
        this._settings.creditCards.push(creditCard);
        this.saveCheckoutSettings();
    }
    removeCreditCard(creditCard) {
        let idx = this._settings.creditCards.indexOf(creditCard);
        if (idx !== 1) {
            this._settings.creditCards.splice(idx, 1);
            this.saveCheckoutSettings();
        }
    }
    addShippingAddress(address) {
        this._settings.shippingAddresses.push(address);
        this.saveCheckoutSettings();
    }
    removeShippingAddress(address) {
        let idx = this._settings.shippingAddresses.indexOf(address);
        if (idx !== 1) {
            this._settings.shippingAddresses.splice(idx, 1);
            this.saveCheckoutSettings();
        }
    }
    saveCheckoutSettings() {
        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
            this.saveTimer = undefined;
        }
        this.saveTimer = setTimeout(() => {
            utils_1.saveSettings('checkout.json', this._settings);
        }, 1000);
    }
}
exports.CheckoutSettings = CheckoutSettings;
//# sourceMappingURL=checkoutSettings.js.map