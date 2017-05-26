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
const button_1 = require("./button");
class AddShippingAddressView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recipient: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            countryOrRegion: '',
            phoneNumber: ''
        };
        this.recipientChanged = this.recipientChanged.bind(this);
        this.addressLine1Changed = this.addressLine1Changed.bind(this);
        this.addressLine2Changed = this.addressLine2Changed.bind(this);
        this.cityChanged = this.cityChanged.bind(this);
        this.stateChanged = this.stateChanged.bind(this);
        this.postalCodeChanged = this.postalCodeChanged.bind(this);
        this.countryChanged = this.countryChanged.bind(this);
        this.phoneNumberChanged = this.phoneNumberChanged.bind(this);
    }
    recipientChanged(text) {
        this.updateState({ recipient: text });
    }
    addressLine1Changed(text) {
        this.updateState({ addressLine1: text });
    }
    addressLine2Changed(text) {
        this.updateState({ addressLine2: text });
    }
    cityChanged(text) {
        this.updateState({ city: text });
    }
    stateChanged(text) {
        this.updateState({ state: text });
    }
    postalCodeChanged(text) {
        this.updateState({ postalCode: text });
    }
    countryChanged(text) {
        this.updateState({ countryOrRegion: text });
    }
    phoneNumberChanged(text) {
        this.updateState({ phoneNumber: text });
    }
    updateState(update) {
        this.setState(Object.assign({}, this.state, update));
    }
    render() {
        return (React.createElement("div", { className: 'add-shipping-address-container checkout-table' },
            React.createElement("div", { className: 'title fixed-right' }, "Emulating: Add a new shipping address"),
            React.createElement("div", { className: 'checkout-form' },
                React.createElement("div", { className: 'recipient checkout-field' },
                    React.createElement("div", { className: 'checkout-label' }, "Recipient"),
                    React.createElement("input", { type: "text", className: "checkout-input", onChange: e => this.recipientChanged(e.target.value) })),
                React.createElement("div", { className: 'street-address checkout-field' },
                    React.createElement("div", { className: 'checkout-label' }, "Street address"),
                    React.createElement("input", { type: "text", className: "checkout-input", onChange: e => this.addressLine1Changed(e.target.value) })),
                React.createElement("div", { className: 'street-address checkout-field' },
                    React.createElement("div", { className: 'checkout-label' }, "Address line 2"),
                    React.createElement("input", { type: "text", className: "checkout-input", onChange: e => this.addressLine2Changed(e.target.value) })),
                React.createElement("div", { className: 'city checkout-field' },
                    React.createElement("div", { className: 'checkout-label' }, "City"),
                    React.createElement("input", { type: "text", className: "checkout-input", onChange: e => this.cityChanged(e.target.value) })),
                React.createElement("div", { className: 'state checkout-field' },
                    React.createElement("div", { className: 'checkout-label' }, "State"),
                    React.createElement("input", { type: "text", className: "checkout-input", onChange: e => this.stateChanged(e.target.value) })),
                React.createElement("div", { className: 'postal-code checkout-field' },
                    React.createElement("div", { className: 'checkout-label' }, "Postal Code"),
                    React.createElement("input", { type: "text", className: "checkout-input postal-code-input", onChange: e => this.postalCodeChanged(e.target.value) })),
                React.createElement("div", { className: 'country checkout-field' },
                    React.createElement("div", { className: 'checkout-label' }, "Country/Region"),
                    React.createElement("input", { type: "text", className: "checkout-input", onChange: e => this.countryChanged(e.target.value) })),
                React.createElement("div", { className: 'phone-number checkout-field' },
                    React.createElement("div", { className: 'checkout-label' }, "Phone number"),
                    React.createElement("input", { type: "text", className: "checkout-input", onChange: e => this.phoneNumberChanged(e.target.value) }))),
            React.createElement("div", { className: 'checkout-button-bar fixed-right' },
                React.createElement(button_1.Button, { classes: 'secondary-button cancel-button', onClick: () => this.props.onCancel(), label: 'Cancel' }),
                React.createElement(button_1.Button, { classes: 'primary-button save-button', onClick: () => this.props.onSave(this.state), label: 'Save' }))));
    }
}
exports.AddShippingAddressView = AddShippingAddressView;
//# sourceMappingURL=addShippingAddressView.js.map