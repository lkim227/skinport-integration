export interface Item {
    id: number;
    name: string;
    price_tradable: number | null;
    price_non_tradable: number | null;
}