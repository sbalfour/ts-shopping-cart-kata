import {Product} from './product';

export interface ReceiptItem {
    product: Product;
    quantity: number;
}

export class Receipt {
    public readonly items: Array<ReceiptItem> = [];
    public readonly totalPrice: number = 0;

    // Add constructor parameters
    constructor(
        items: ReceiptItem[],
        totalPrice: number
    ) {
        // populate readonly properties through constructor parameters
        this.items = items;
        // convert pence to pounds and pence eg. 1000 to 10.00
        this.totalPrice = Number((totalPrice / 100).toFixed(2));
    }
}
