import { IRoominfo } from "./roominfo";

export interface IRoom  {
    id?: number;
    rate?:number;
    rsvn:number;
    roominfo: number;
    dateIn:string;
    dateOut:string;
    status:string;
 
}
