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
const selectorComponent_1 = require("./selectorComponent");
class ShippingAddressItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let addressLine2 = undefined;
        if (this.props.item.addressLine2) {
            addressLine2 = (React.createElement("div", { className: "address-line" }, this.props.item.addressLine2));
        }
        return (React.createElement("div", { className: 'shipping-address' },
            React.createElement("div", { className: 'address-line' }, this.props.item.recipient),
            React.createElement("div", { className: "address-line" }, this.props.item.addressLine1),
            addressLine2,
            React.createElement("div", { className: "address-line" },
                this.props.item.city,
                ", ",
                this.props.item.state,
                " ",
                this.props.item.postalCode)));
    }
}
class SelectShippingAddress extends selectorComponent_1.SelectorComponent {
    constructor(props) {
        super(props, ShippingAddressItem);
    }
}
exports.SelectShippingAddress = SelectShippingAddress;
//# sourceMappingURL=selectShippingAddress.js.map