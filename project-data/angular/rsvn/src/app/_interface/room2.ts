import { IRoominfo } from "./roominfo";

export interface IRoom2  {
    id: number;
    rate:number;
    rsvn:number;
    roominfo: IRoominfo;
    status:string;
}
