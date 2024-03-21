export class Product {
    public readonly name: string;
    public readonly price: number;

    constructor(name: string, price: number) {
        // populate readonly properties through constructor parameters
        this.name = name;
        this.price = price;
    }
}

// extend the Product to add offer properties and allow instance check
export class ProductBuyMultipleGetFree extends Product {
    public readonly totalToTriggerFree: number;
    public readonly totalFree: number;

    constructor(
        name: string,
        price: number,
        totalToTriggerFree: number,
        totalFree: number
    ) {
        super(
            name,
            price
        );
        this.totalToTriggerFree = totalToTriggerFree;
        this.totalFree = totalFree;
    }
}
