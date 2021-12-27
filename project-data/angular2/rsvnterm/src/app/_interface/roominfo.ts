import { IBldg } from '@app/_interface/bldg';
export interface IRoominfo  {
    info: any;
    id:number;
    bldg: number;
    number: string;
    floor:string;
    style:string;
    beds:string;
    name:string;
    size:string;
    descr:string;
    check:boolean;
    status:string;
    rateAlias:string;
    marker?:string;
    border?:string;

}
