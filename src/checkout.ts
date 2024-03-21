import {Product, ProductBuyMultipleGetFree, ProductPercentageDiscount} from './product';
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
            // check class instanceof for specific calculations
            if (product instanceof ProductBuyMultipleGetFree) {
                // initial counts for ProductBuyMultipleGetFree value checks
                let freeItemTriggerCount: number = 0;
                let freeItemAddedCount: number = 0;
                // loop through all items based on quantity value
                for(let i: number = 0; i < quantity; i++) {
                    // check if totalToTriggerFree has been reached
                    if (freeItemTriggerCount < product.totalToTriggerFree) {
                        // if not add price to total price and add 1 to freeItemTriggerCount
                        totalPrice += product.price;
                        freeItemTriggerCount++;
                    } else {
                        // if it has then this is a free item and no calculation of total price
                        freeItemAddedCount++;
                        // if the total of free items available have been added the reset the counts
                        if (freeItemAddedCount === product.totalFree) {
                            freeItemTriggerCount = 0;
                            freeItemAddedCount = 0;
                        }
                    }
                }
            } else if (product instanceof ProductPercentageDiscount) {
                let productTotalPrice: number = 0;
                // calculate total price as usual
                productTotalPrice += product.price * quantity;
                // check if quantity triggers discount
                if (quantity >= product.totalToTriggerDiscount) {
                    // if so then apply percentage discount to all products
                    productTotalPrice = productTotalPrice - ((productTotalPrice / 100) * product.percentageDiscount);
                }
                totalPrice += productTotalPrice;
            } else {
                // if standard Product calculate the price based on quantity
                totalPrice += product.price * quantity;
            }


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
