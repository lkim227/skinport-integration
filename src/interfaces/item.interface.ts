export interface Item {
    id: number;
    name: string;
    min_price: number | null;
    max_price: number | null;
    tradable_price: number | null;
    non_tradable_price: number | null;
}