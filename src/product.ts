export class Product {
    public readonly name: string;
    public readonly price: number;

    constructor(name: string, price: number) {
        // populate readonly properties through constructor parameters
        this.name = name;
        this.price = price;
    }
}

// extend the Product to add multi offer properties and allow instance check
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

// extend the Product to add percentage discount properties and allow instance check
export class ProductPercentageDiscount extends Product {
    public readonly totalToTriggerDiscount: number;
    public readonly percentageDiscount: number;

    constructor(
        name: string,
        price: number,
        totalToTriggerDiscount: number,
        percentageDiscount: number
    ) {
        super(
            name,
            price
        );
        this.totalToTriggerDiscount = totalToTriggerDiscount;
        this.percentageDiscount = percentageDiscount;
    }
}
