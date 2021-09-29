export interface IRsvn {
    id      : number;
    primary :{};
    status	:string;
    confirm :string;
    source	:string;
    dateIn	:string;
    dateOut	:string;
    numrooms:number;
    adult:number;
    child:number;
    infant:number;
    notes: Text;
    color:string;
    clerk:string;
    created:Date;
    modified:Date;
    rooms:any[];
    amenities:any[];
    guests:any[];




}