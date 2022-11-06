import { ISubDetailItem } from "./ISubDetailItem";

export interface IDetailItem {
    id: number;
    title: string;
    codProvincia: string;
    modified: string;
    items: ISubDetailItem[];
    show: boolean;
}