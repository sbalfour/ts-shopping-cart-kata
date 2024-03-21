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
        this.totalPrice = totalPrice;
    }
}
