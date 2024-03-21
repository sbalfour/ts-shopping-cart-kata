export class Product {

    public readonly name: string;
    public readonly price: number;

    constructor(name: string, price: number) {
        // populate readonly properties through constructor parameters
        this.name = name;
        this.price = price;
    }

}
