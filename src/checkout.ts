import { Product } from './product';
import { Receipt, ReceiptItem } from './receipt';

export class Checkout {
    // create a collection of Products, each mapped by unique product name
    // this allows direct lookup rather that an array where a find() loop would be required to see if a product already exists
    private scannedProducts: Record<string, Product[]> = {};

    public scanItem(product: Product): void {
        // check if product mapping exists
        if (this.scannedProducts[product.name]) {
            // if yes then add product to existing products array
            this.scannedProducts[product.name] = [...this.scannedProducts[product.name], ...[product]];
        } else {
            // if not then create the array mapped to the product name
            this.scannedProducts[product.name] = [product];
        }
    }

    public generateReceipt(): Receipt {
        // create properties with default values to be passed to Receipt() params
        let receiptItems: ReceiptItem[] = [];
        let totalPrice: number = 0;

        // loop through scannedProducts
        Object.values(this.scannedProducts).forEach((products: Product[]) => {
            // get a reference to the Product by taking the first available
            const product: Product = products[0];
            // get the quantity added by getting the Product array length
            const quantity: number = products.length;
            // add calculation of price by quantity to the totalPrice
            totalPrice += product.price * quantity;
            // add product and quantity to the receiptItems as a ReceiptItem
            receiptItems = [...receiptItems, ...[{
                product,
                quantity
            }]];
        });

        // add the items and total price to the receipt
        return new Receipt(receiptItems, totalPrice);
    }
}
