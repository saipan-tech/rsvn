export interface IUser {
    id:number;
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    email: string;
    is_staff:boolean;
    is_active: boolean;
    is_superuser:boolean;
    date_joined: Date;
    last_login: Date;
    
}