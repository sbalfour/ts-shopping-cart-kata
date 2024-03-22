import {Checkout} from './checkout';
import {Receipt, ReceiptItem} from './receipt';
import {Product, ProductBuyMultipleGetFree, ProductPercentageDiscount} from './product';

function lookupReceiptItem(receipt: Receipt, id: string): ReceiptItem {
    const item = receipt.items.find((x) => x.product.name === id)
    if (!item) {
        throw new Error(`The receipt does not contain a "${id}" item.`)
    }
    return item;
}

describe('Given a customer is shopping at the supermarket', () => {

    describe('When no items have been scanned', () => {

        let receipt: Receipt;

        beforeEach(() => {
            const checkout = new Checkout();
            receipt = checkout.generateReceipt();
        });

        it('Then the receipt should contain no scanned items', () => {
            expect(receipt.items).toHaveLength(0);
        });

        it('Then the receipt total price should be zero', () => {
            expect(receipt.totalPrice).toEqual(0);
        });

    });

    describe('When an a single "Apple" is scanned and there is no promotion/offer', () => {

        let receipt: Receipt;

        beforeEach(() => {
            const checkout = new Checkout();
            checkout.scanItem(new Product('Apple', 0.3));
            receipt = checkout.generateReceipt();
        });

        it('Then the receipt should contain 1 scanned item', () => {
            expect(receipt.items).toHaveLength(1);
        });

        it('Then the receipt should contain an "Apple" item', () => {
            expect(lookupReceiptItem(receipt, 'Apple')).toBeDefined();
        });

        it('Then the receipt "Apple" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Apple').quantity).toEqual(1);
        });

        it('Then the receipt total price should be calculated correctly', () => {
            expect(receipt.totalPrice).toEqual(0.3);
        });

    });

    describe('When an a single "Apple" and a single "Orange" are scanned and there is no promotion/offer', () => {

        let receipt: Receipt;

        beforeEach(() => {
            const checkout = new Checkout();
            checkout.scanItem(new Product('Apple', 0.3));
            checkout.scanItem(new Product('Orange', 0.4));
            receipt = checkout.generateReceipt();
        });

        it('Then the receipt should contain 2 scanned items', () => {
            expect(receipt.items).toHaveLength(2);
        });

        it('Then the receipt should contain an "Apple" item', () => {
            expect(lookupReceiptItem(receipt, 'Apple')).toBeDefined();
        });

        it('Then the receipt should contain an "Orange" item', () => {
            expect(lookupReceiptItem(receipt, 'Orange')).toBeDefined();
        });

        it('Then the receipt "Apple" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Apple').quantity).toEqual(1);
        });

        it('Then the receipt "Orange" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Orange').quantity).toEqual(1);
        });

        it('Then the receipt total price should be calculated correctly', () => {
            expect(receipt.totalPrice).toEqual(0.7);
        });

    });

    describe('When multiple "Apples" and multiple "Orange" are scanned and there is no promotion/offer', () => {

        let receipt: Receipt;

        beforeEach(() => {
            const checkout = new Checkout();
            for(let i = 0; i < 3; i++) {
                checkout.scanItem(new Product('Apple', 0.3));
            }
            for(let i = 0; i < 2; i++) {
                checkout.scanItem(new Product('Orange', 0.4));
            }
            receipt = checkout.generateReceipt();
        });

        it('Then the receipt should contain 2 scanned items', () => {
            expect(receipt.items).toHaveLength(2);
        });

        it('Then the receipt should contain an "Apple" item', () => {
            expect(lookupReceiptItem(receipt, 'Apple')).toBeDefined();
        });

        it('Then the receipt should contain an "Orange" item', () => {
            expect(lookupReceiptItem(receipt, 'Orange')).toBeDefined();
        });

        it('Then the receipt "Apple" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Apple').quantity).toEqual(3);
        });

        it('Then the receipt "Orange" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Orange').quantity).toEqual(2);
        });

        it('Then the receipt total price should be calculated correctly', () => {
            expect(receipt.totalPrice).toEqual((3 * 0.3) + (2 * 0.4));
        });

    });

    describe('When multiple "Toothbrush" are scanned and there is a buy 2 get 1 free offer', () => {

        let receipt: Receipt;

        beforeEach(() => {
            const checkout = new Checkout();
            for(let i = 0; i < 6; i++) {
                checkout.scanItem(new ProductBuyMultipleGetFree('Toothbrush', 0.3, 2, 1));
            }
            receipt = checkout.generateReceipt();
        });

        it('Then the receipt should contain 1 scanned items', () => {
            expect(receipt.items).toHaveLength(1);
        });

        it('Then the receipt should contain a "Toothbrush" item', () => {
            expect(lookupReceiptItem(receipt, 'Toothbrush')).toBeDefined();
        });

        it('Then the receipt "Toothbrush" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Toothbrush').quantity).toEqual(6);
        });

        it('Then the receipt total price should be calculated correctly', () => {
            expect(receipt.totalPrice).toEqual((4 * 0.3));
        });

    });

    describe('When multiple "Toothbrush" are scanned and there is a buy 4 get 1 free offer', () => {

        let receipt: Receipt;

        beforeEach(() => {
            const checkout = new Checkout();
            for(let i = 0; i < 5; i++) {
                checkout.scanItem(new ProductBuyMultipleGetFree('Toothbrush', 0.3, 4, 1));
            }
            receipt = checkout.generateReceipt();
        });

        it('Then the receipt should contain 1 scanned items', () => {
            expect(receipt.items).toHaveLength(1);
        });

        it('Then the receipt should contain a "Toothbrush" item', () => {
            expect(lookupReceiptItem(receipt, 'Toothbrush')).toBeDefined();
        });

        it('Then the receipt "Toothbrush" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Toothbrush').quantity).toEqual(5);
        });

        it('Then the receipt total price should be calculated correctly', () => {
            expect(receipt.totalPrice).toEqual((4 * 0.3));
        });

    });

    describe('When multiple "Toothbrush" are scanned and there is a buy 2 get 1 free offer and there are other non-offer items in the cart', () => {

        let receipt: Receipt;

        beforeEach(() => {
            const checkout = new Checkout();
            for(let i = 0; i < 3; i++) {
                checkout.scanItem(new ProductBuyMultipleGetFree('Toothbrush', 0.3, 2, 1));
            }
            checkout.scanItem(new Product('Apple', 0.3));
            checkout.scanItem(new Product('Orange', 0.4));
            receipt = checkout.generateReceipt();
        });

        it('Then the receipt should contain 1 scanned items', () => {
            expect(receipt.items).toHaveLength(3);
        });

        it('Then the receipt should contain a "Toothbrush" item', () => {
            expect(lookupReceiptItem(receipt, 'Toothbrush')).toBeDefined();
        });

        it('Then the receipt should contain an "Apple" item', () => {
            expect(lookupReceiptItem(receipt, 'Toothbrush')).toBeDefined();
        });

        it('Then the receipt should contain an "Orange" item', () => {
            expect(lookupReceiptItem(receipt, 'Toothbrush')).toBeDefined();
        });

        it('Then the receipt "Toothbrush" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Toothbrush').quantity).toEqual(3);
        });

        it('Then the receipt "Apple" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Apple').quantity).toEqual(1);
        });

        it('Then the receipt "Orange" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Orange').quantity).toEqual(1);
        });

        it('Then the receipt total price should be calculated correctly', () => {
            expect(receipt.totalPrice).toEqual((2 * 0.3) + 0.3 + 0.4);
        });

    });

    describe('When multiple "Toothbrush" are scanned and there is a buy 4 get 1 free offer and multiple "Toothpaste" are scanned and there is a buy 2 get 1 free offer', () => {

        let receipt: Receipt;

        beforeEach(() => {
            const checkout = new Checkout();
            for(let i = 0; i < 5; i++) {
                checkout.scanItem(new ProductBuyMultipleGetFree('Toothbrush', 0.3, 4, 1));
            }
            for(let i = 0; i < 3; i++) {
                checkout.scanItem(new ProductBuyMultipleGetFree('Toothpaste', 0.3, 2, 1));
            }
            receipt = checkout.generateReceipt();
        });

        it('Then the receipt should contain 1 scanned items', () => {
            expect(receipt.items).toHaveLength(2);
        });

        it('Then the receipt should contain a "Toothbrush" item', () => {
            expect(lookupReceiptItem(receipt, 'Toothbrush')).toBeDefined();
        });

        it('Then the receipt should contain a "Toothpaste" item', () => {
            expect(lookupReceiptItem(receipt, 'Toothpaste')).toBeDefined();
        });

        it('Then the receipt "Toothbrush" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Toothbrush').quantity).toEqual(5);
        });

        it('Then the receipt "Toothbrush" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Toothpaste').quantity).toEqual(3);
        });

        it('Then the receipt total price should be calculated correctly', () => {
            expect(receipt.totalPrice).toEqual(1.8);
        });

    });

    describe('When a single "Rice" is scanned and there is a 10% discount on the price', () => {

        let receipt: Receipt;

        beforeEach(() => {
            const checkout = new Checkout();
            checkout.scanItem(new ProductPercentageDiscount('Rice', 1.0, 1, 10));
            receipt = checkout.generateReceipt();
        });

        it('Then the receipt should contain 1 scanned items', () => {
            expect(receipt.items).toHaveLength(1);
        });

        it('Then the receipt should contain a "Rice" item', () => {
            expect(lookupReceiptItem(receipt, 'Rice')).toBeDefined();
        });

        it('Then the receipt "Rice" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Rice').quantity).toEqual(1);
        });

        it('Then the receipt total price should be calculated correctly', () => {
            expect(receipt.totalPrice).toEqual(0.9);
        });

    });

    describe('When more than 10 "Apple" are scanned and there is a 20% discount on the price', () => {

        let receipt: Receipt;

        beforeEach(() => {
            const checkout = new Checkout();
            for(let i = 0; i < 12; i++) {
                checkout.scanItem(new ProductPercentageDiscount('Apple', 1.0, 11, 20));
            }
            receipt = checkout.generateReceipt();
        });

        it('Then the receipt should contain 1 scanned items', () => {
            expect(receipt.items).toHaveLength(1);
        });

        it('Then the receipt should contain a "Apple" item', () => {
            expect(lookupReceiptItem(receipt, 'Apple')).toBeDefined();
        });

        it('Then the receipt "Apple" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Apple').quantity).toEqual(12);
        });

        it('Then the receipt total price should be calculated correctly', () => {
            expect(receipt.totalPrice).toEqual(9.6);
        });

    });

    describe('When 10 or less "Apple" are scanned and there is not a 20% discount on the price', () => {

        let receipt: Receipt;

        beforeEach(() => {
            const checkout = new Checkout();
            for(let i = 0; i < 9; i++) {
                checkout.scanItem(new ProductPercentageDiscount('Apple', 1.0, 11, 20));
            }
            receipt = checkout.generateReceipt();
        });

        it('Then the receipt should contain 1 scanned items', () => {
            expect(receipt.items).toHaveLength(1);
        });

        it('Then the receipt should contain a "Apple" item', () => {
            expect(lookupReceiptItem(receipt, 'Apple')).toBeDefined();
        });

        it('Then the receipt "Apple" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Apple').quantity).toEqual(9);
        });

        it('Then the receipt total price should be calculated correctly', () => {
            expect(receipt.totalPrice).toEqual(9.0);
        });

    });

    describe('When more than 4 "Apple" are scanned and there is a 20% discount on price and more than 3 "Orange" are scanned and there is a 10% discount on price', () => {

        let receipt: Receipt;

        beforeEach(() => {
            const checkout = new Checkout();
            for(let i = 0; i < 5; i++) {
                checkout.scanItem(new ProductPercentageDiscount('Apple', 1.0, 4, 20));
            }
            for(let i = 0; i < 4; i++) {
                checkout.scanItem(new ProductPercentageDiscount('Orange', 1.0, 3, 10));
            }
            receipt = checkout.generateReceipt();
        });

        it('Then the receipt should contain 1 scanned items', () => {
            expect(receipt.items).toHaveLength(2);
        });

        it('Then the receipt should contain a "Apple" item', () => {
            expect(lookupReceiptItem(receipt, 'Apple')).toBeDefined();
        });

        it('Then the receipt should contain a "Apple" item', () => {
            expect(lookupReceiptItem(receipt, 'Orange')).toBeDefined();
        });

        it('Then the receipt "Apple" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Apple').quantity).toEqual(5);
        });

        it('Then the receipt "Apple" item should have the correct quantity', () => {
            expect(lookupReceiptItem(receipt, 'Orange').quantity).toEqual(4);
        });

        it('Then the receipt total price should be calculated correctly', () => {
            expect(receipt.totalPrice).toEqual(7.6);
        });

    });

});
