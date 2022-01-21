import { IRoominfo } from "./roominfo";

export interface IRoom2  {
    id: string;
    rate:number;
    rsvn:number;
    roominfo: IRoominfo;
    status:string;
}
