"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const React = require("react");
const ReactDOM = require("react-dom");
const Electron = require("electron");
const selectShippingMethod_1 = require("./selectShippingMethod");
const selectShippingAddress_1 = require("./selectShippingAddress");
const selectCreditCard_1 = require("./selectCreditCard");
const addCreditCardView_1 = require("./addCreditCardView");
const addShippingAddressView_1 = require("./addShippingAddressView");
const paymentDetails_1 = require("./paymentDetails");
const checkoutTypes_1 = require("./checkoutTypes");
const emulator_1 = require("../emulator");
const reducers_1 = require("../reducers");
const button_1 = require("./button");
const checkoutSettings_1 = require("./checkoutSettings");
const utils_1 = require("../../utils");
const remote = require('electron').remote;
class CheckoutView extends React.Component {
    constructor(props) {
        super(props);
        let param = location.search;
        let paymentRequest;
        if (param) {
            if (param.startsWith('?')) {
                param = param.substring(1);
            }
            paymentRequest = JSON.parse(decodeURI(param));
        }
        this.checkoutSettings = new checkoutSettings_1.CheckoutSettings();
        let cache = this.checkoutSettings.getSettings();
        this.local = {
            paymentRequest: paymentRequest,
            selectedCreditCard: undefined,
            creditCards: [],
            selectedShippingAddress: undefined,
            shippingAddresses: [],
            emailAddress: cache.email,
            phoneNumber: cache.phoneNumber,
            selectCreditCardIsVisible: false,
            selectShippingAddressIsVisible: false,
            selectShippingMethodIsVisible: false,
            addCreditCardIsVisible: false,
            addShippingAddressIsVisible: false,
            isInValidationMode: false
        };
        cache.creditCards.forEach(x => this.local.creditCards.push(x));
        cache.shippingAddresses.forEach(x => this.local.shippingAddresses.push(x));
        this.state = this.local;
        this.emailChanged = this.emailChanged.bind(this);
        this.phoneChanged = this.phoneChanged.bind(this);
        this.setShippingMethodSelectorIsVisible = this.setShippingMethodSelectorIsVisible.bind(this);
        this.getShippingMethodSelectorIsVisible = this.getShippingMethodSelectorIsVisible.bind(this);
        this.getSelectedShippingMethod = this.getSelectedShippingMethod.bind(this);
        this.selectShippingMethod = this.selectShippingMethod.bind(this);
        this.setShippingAddressSelectorIsVisible = this.setShippingAddressSelectorIsVisible.bind(this);
        this.getShippingAddressSelectorIsVisible = this.getShippingAddressSelectorIsVisible.bind(this);
        this.getSelectedShippingAddress = this.getSelectedShippingAddress.bind(this);
        this.selectShippingAddress = this.selectShippingAddress.bind(this);
        this.addShippingAddress = this.addShippingAddress.bind(this);
        this.removeShippingAddress = this.removeShippingAddress.bind(this);
        this.onSaveShippingAddress = this.onSaveShippingAddress.bind(this);
        this.onCancelAddShippingAddress = this.onCancelAddShippingAddress.bind(this);
        this.setCreditCardSelectorIsVisible = this.setCreditCardSelectorIsVisible.bind(this);
        this.getCreditCardSelectorIsVisible = this.getCreditCardSelectorIsVisible.bind(this);
        this.getSelectedCreditCard = this.getSelectedCreditCard.bind(this);
        this.selectCreditCard = this.selectCreditCard.bind(this);
        this.addCreditCard = this.addCreditCard.bind(this);
        this.removeCreditCard = this.removeCreditCard.bind(this);
        this.onSaveCreditCard = this.onSaveCreditCard.bind(this);
        this.onCancelAddCreditCard = this.onCancelAddCreditCard.bind(this);
        this.pay = this.pay.bind(this);
        this.onPageMouseDown = this.onPageMouseDown.bind(this);
        let checkoutState = Electron.ipcRenderer.sendSync('getCheckoutState');
        this.checkoutSession = {
            paymentActivityId: checkoutState.paymentActivityId,
            checkoutConversationId: utils_1.uniqueId(),
            checkoutFromId: utils_1.uniqueId(),
        };
        this.settings = checkoutState.settings;
        emulator_1.Emulator.serviceUrl = checkoutState.serviceUrl;
        reducers_1.ConversationActions.joinConversation(this.settings.conversation.conversationId);
        reducers_1.ServerSettingsActions.set(this.settings.serverSettings);
    }
    emailChanged(text) {
        this.updateState({ emailAddress: text });
        this.checkoutSettings.updateEmail(text);
    }
    phoneChanged(text) {
        this.updateState({ phoneNumber: text });
        this.checkoutSettings.updatePhoneNumber(text);
    }
    setShippingAddressSelectorIsVisible(isVisible) {
        if (isVisible) {
            this.setCreditCardSelectorIsVisible(false);
            this.setShippingMethodSelectorIsVisible(false);
        }
        this.updateState({ selectShippingAddressIsVisible: isVisible });
    }
    getShippingAddressSelectorIsVisible() {
        return this.state.selectShippingAddressIsVisible;
    }
    getSelectedShippingAddress() {
        return this.state.selectedShippingAddress;
    }
    selectShippingAddress(value) {
        this.updateState({ selectedShippingAddress: value });
        let shippingOption = this.getSelectedShippingMethod();
        emulator_1.Emulator.updateShippingAddress(this.checkoutSession, this.state.paymentRequest, checkoutTypes_1.PaymentTypeConverter.convertAddress(value), shippingOption ? shippingOption.id : undefined, (err, statusCode, result) => {
            if (!err && result && result.details) {
                this.updatePaymentDetails(result.details);
            }
        });
    }
    addShippingAddress() {
        this.updateState({ addShippingAddressIsVisible: true });
    }
    removeShippingAddress(item) {
        let idx = this.local.shippingAddresses.indexOf(item);
        if (idx !== -1) {
            if (this.local.selectedShippingAddress === item) {
                this.local.selectedShippingAddress = undefined;
            }
            this.local.shippingAddresses.splice(idx, 1);
            this.updateState(this.local);
            this.checkoutSettings.removeShippingAddress(item);
        }
    }
    onSaveShippingAddress(item) {
        this.local.shippingAddresses.push(item);
        this.local.selectedShippingAddress = item;
        this.local.addShippingAddressIsVisible = false;
        this.updateState(this.local);
        this.checkoutSettings.addShippingAddress(item);
        this.selectShippingAddress(item);
    }
    onCancelAddShippingAddress() {
        this.updateState({ addShippingAddressIsVisible: false });
    }
    setShippingMethodSelectorIsVisible(isVisible) {
        if (isVisible) {
            this.setCreditCardSelectorIsVisible(false);
            this.setShippingAddressSelectorIsVisible(false);
        }
        this.updateState({ selectShippingMethodIsVisible: isVisible });
    }
    getShippingMethodSelectorIsVisible() {
        return this.state.selectShippingMethodIsVisible;
    }
    getSelectedShippingMethod(state) {
        if (!state) {
            state = this.state;
        }
        if (state.paymentRequest.details.shippingOptions) {
            let selected = state.paymentRequest.details.shippingOptions.filter(option => option.selected);
            return selected && selected.length >= 1 ? selected[0] : undefined;
        }
        return undefined;
    }
    selectShippingMethod(value) {
        if (this.local.paymentRequest.details.shippingOptions) {
            this.local.paymentRequest.details.shippingOptions.forEach(option => {
                if (option.id === value.id) {
                    option.selected = true;
                }
                else {
                    option.selected = false;
                }
            });
        }
        this.updatePaymentDetails(this.local.paymentRequest.details);
        emulator_1.Emulator.updateShippingOption(this.checkoutSession, this.local.paymentRequest, checkoutTypes_1.PaymentTypeConverter.convertAddress(this.local.selectedShippingAddress), value.id, (err, statusCode, result) => {
            if (!err && result && result.details) {
                this.updatePaymentDetails(result.details);
            }
        });
    }
    setCreditCardSelectorIsVisible(isVisible) {
        if (isVisible) {
            this.setShippingMethodSelectorIsVisible(false);
            this.setShippingAddressSelectorIsVisible(false);
        }
        this.updateState({ selectCreditCardIsVisible: isVisible });
    }
    getCreditCardSelectorIsVisible() {
        return this.state.selectCreditCardIsVisible;
    }
    getSelectedCreditCard() {
        return this.state.selectedCreditCard;
    }
    selectCreditCard(value) {
        this.updateState({ selectedCreditCard: value });
    }
    addCreditCard() {
        this.updateState({ addCreditCardIsVisible: true });
    }
    removeCreditCard(item) {
        let idx = this.local.creditCards.indexOf(item);
        if (idx !== -1) {
            this.local.creditCards.splice(idx, 1);
            if (this.local.selectedCreditCard === item) {
                this.local.selectedCreditCard = undefined;
            }
            this.updateState(this.local);
            this.checkoutSettings.removeCreditCard(item);
        }
    }
    onSaveCreditCard(item) {
        this.local.creditCards.push(item);
        this.local.selectedCreditCard = item;
        this.local.addCreditCardIsVisible = false;
        this.updateState(this.local);
        this.checkoutSettings.addCreditCard(item);
        this.selectCreditCard(item);
    }
    onCancelAddCreditCard() {
        this.updateState({ addCreditCardIsVisible: false });
    }
    pay() {
        if (this.validate()) {
            let shippingOption = this.getSelectedShippingMethod();
            emulator_1.Emulator.paymentComplete(this.checkoutSession, this.state.paymentRequest, checkoutTypes_1.PaymentTypeConverter.convertAddress(this.state.selectedShippingAddress), shippingOption ? shippingOption.id : '', this.state.emailAddress, this.state.phoneNumber, (err, statusCode, body) => {
                console.log(body.result);
                if (body.result === 'success') {
                    window.close();
                }
            });
        }
        else {
            this.updateState({ isInValidationMode: true });
        }
    }
    validate() {
        if (this.local.paymentRequest.options.requestPayerEmail && !this.hasValue(this.local.emailAddress)) {
            return false;
        }
        if (this.local.paymentRequest.options.requestPayerPhone && !this.hasValue(this.local.phoneNumber)) {
            return false;
        }
        if (this.local.paymentRequest.options.requestPayerName && !(this.local.selectedCreditCard && this.hasValue(this.local.selectedCreditCard.cardholderName))) {
            return false;
        }
        if (this.local.paymentRequest.options.requestShipping && !(this.local.selectedShippingAddress && this.getSelectedShippingMethod(this.local) !== undefined)) {
            return false;
        }
        return true;
    }
    hasValue(value) {
        return value && value.length > 0;
    }
    onPageMouseDown(evt) {
        const selectShippingMethod = ReactDOM.findDOMNode(this.refs['select-shipping-method']);
        if (!selectShippingMethod.contains(evt.target) && this.state.selectShippingMethodIsVisible) {
            this.setShippingMethodSelectorIsVisible(false);
        }
        const selectShippingAddress = ReactDOM.findDOMNode(this.refs['select-shipping-address']);
        if (!selectShippingAddress.contains(evt.target) && this.state.selectShippingAddressIsVisible) {
            this.setShippingAddressSelectorIsVisible(false);
        }
        const selectCreditCard = ReactDOM.findDOMNode(this.refs['select-credit-card']);
        if (!selectCreditCard.contains(evt.target) && this.state.selectCreditCardIsVisible) {
            this.setCreditCardSelectorIsVisible(false);
        }
    }
    updatePaymentDetails(details) {
        this.local.paymentRequest.details = details;
        this.updateState(this.local);
    }
    updateState(update) {
        this.local = Object.assign({}, this.local, update);
        this.setState(this.local);
        if (this.local.isInValidationMode && this.validate()) {
            this.updateState({ isInValidationMode: false });
        }
    }
    showPayerNameValidationState() {
        return this.state.isInValidationMode && this.state.paymentRequest.options.requestPayerName &&
            !(this.state.selectedCreditCard && this.state.selectedCreditCard.cardholderName && this.state.selectedCreditCard.cardholderName.length);
    }
    showShippingValidationState() {
        return this.state.isInValidationMode && this.state.paymentRequest.options.requestShipping &&
            !this.state.selectedShippingAddress;
    }
    showShippingOptionValidationState() {
        return this.state.isInValidationMode && this.state.paymentRequest.options.requestShipping &&
            !this.getSelectedShippingMethod();
    }
    showEmailValidationState() {
        return this.state.isInValidationMode && this.state.paymentRequest.options.requestPayerEmail &&
            !this.hasValue(this.state.emailAddress);
    }
    showPhoneNumberValidationState() {
        return this.state.isInValidationMode && this.state.paymentRequest.options.requestPayerPhone &&
            !this.hasValue(this.state.phoneNumber);
    }
    render() {
        if (this.state.addCreditCardIsVisible) {
            return (React.createElement("div", { className: 'checkout-container' },
                React.createElement(addCreditCardView_1.AddCreditCardView, { onSave: this.onSaveCreditCard, onCancel: this.onCancelAddCreditCard })));
        }
        else if (this.state.addShippingAddressIsVisible) {
            return (React.createElement("div", { className: 'checkout-container' },
                React.createElement(addShippingAddressView_1.AddShippingAddressView, { onSave: this.onSaveShippingAddress, onCancel: this.onCancelAddShippingAddress })));
        }
        else {
            let validationError;
            if (this.state.isInValidationMode) {
                validationError = (React.createElement("div", { className: 'validation-error' }, "*Some fields are required"));
            }
            return (React.createElement("div", { className: 'checkout-container', onMouseDown: this.onPageMouseDown },
                React.createElement("div", { className: 'checkout-table' },
                    React.createElement("div", { className: 'title-container fixed-right' },
                        React.createElement("div", { className: 'title' }, "Emulating: Confirm and Pay"),
                        validationError),
                    React.createElement("div", { className: 'checkout-form' },
                        React.createElement("div", { className: 'pay-with checkout-field' },
                            React.createElement("div", { className: 'checkout-label' }, "Pay with"),
                            React.createElement(selectCreditCard_1.SelectCreditCard, { ref: 'select-credit-card', getIsVisible: this.getCreditCardSelectorIsVisible, setIsVisible: this.setCreditCardSelectorIsVisible, items: this.state.creditCards, getSelectedItem: this.getSelectedCreditCard, selectItem: this.selectCreditCard, placeholder: 'Select a way to pay', addItemLabel: '+ Add a new way to pay', onClickAddItem: this.addCreditCard, onClickRemoveItem: this.removeCreditCard, classes: this.showPayerNameValidationState() ? 'invalid-input' : '' })),
                        React.createElement("div", { className: 'ship-to checkout-field' },
                            React.createElement("div", { className: 'checkout-label' }, "Ship to"),
                            React.createElement(selectShippingAddress_1.SelectShippingAddress, { ref: 'select-shipping-address', getIsVisible: this.getShippingAddressSelectorIsVisible, setIsVisible: this.setShippingAddressSelectorIsVisible, items: this.state.shippingAddresses, getSelectedItem: this.getSelectedShippingAddress, selectItem: this.selectShippingAddress, placeholder: 'Select a shipping address', addItemLabel: '+ Add a new shipping address', onClickAddItem: this.addShippingAddress, onClickRemoveItem: this.removeShippingAddress, classes: this.showShippingValidationState() ? 'invalid-input' : '' })),
                        React.createElement("div", { className: 'shipping-options checkout-field' },
                            React.createElement("div", { className: 'checkout-label' }, "Shipping options"),
                            React.createElement(selectShippingMethod_1.SelectShippingMethod, { ref: 'select-shipping-method', getIsVisible: this.getShippingMethodSelectorIsVisible, setIsVisible: this.setShippingMethodSelectorIsVisible, items: this.state.paymentRequest.details.shippingOptions, getSelectedItem: this.getSelectedShippingMethod, selectItem: this.selectShippingMethod, classes: this.showShippingOptionValidationState() ? 'invalid-input' : '' })),
                        React.createElement("div", { className: 'email-receipt-to checkout-field' },
                            React.createElement("div", { className: 'checkout-label' }, "Email receipt to"),
                            React.createElement("input", { type: "text", className: 'checkout-input' + (this.showEmailValidationState() ? ' invalid-input' : ''), value: this.state.emailAddress, onChange: e => this.emailChanged(e.target.value) })),
                        React.createElement("div", { className: 'phone checkout-field' },
                            React.createElement("div", { className: 'checkout-label' }, "Phone"),
                            React.createElement("input", { type: "text", className: 'checkout-input' + (this.showPhoneNumberValidationState() ? ' invalid-input' : ''), value: this.state.phoneNumber, onChange: e => this.phoneChanged(e.target.value) })),
                        React.createElement(paymentDetails_1.PaymentDetails, { details: this.state.paymentRequest.details })),
                    React.createElement("div", { className: 'total-container fixed-right' },
                        React.createElement(button_1.Button, { classes: 'primary-button pay-button', onClick: this.pay, label: 'Pay' })))));
        }
    }
}
exports.CheckoutView = CheckoutView;
//# sourceMappingURL=checkoutView.js.map