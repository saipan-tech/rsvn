import { IStaff } from "./staff";
export interface IAction {
    id: number;
    roominfos   : [];
    department  : string;
    staff       : IStaff;
    item        : string;
    descr       : string;
    result      : string;
    date        : string;
    assignedBy  : string;
    days        : string;
    continuous  : boolean;
    once        : boolean;
    created     : string;
    fullname? : string;
}

