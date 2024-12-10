//this file contains 
// For this implementation, manager on client side does not need to know their restaurant
export class Manager{
    username : String
    password : String
    
    constructor(name:string, password:string){
        this.username = name
        this.password = password
    }

    getUsername(){
        return this.username
    }
}

export class Consumer{
    email : String
    sixDigitCode : String
    
    constructor(name:string, password:string){
        this.email = name
        this.sixDigitCode = password
    }

    getEmail(){
        return this.email
    }
}
export class Table{
    table_UUID : String
    res_UUID : String

    constructor(table:string,res:string){
        this.table_UUID = table;
        this.res_UUID = res;
    }
}

export class ReservationInfo{
    table_UUID : String
    date : Date
    numPeople : Number
    startTime : String
    resName : String

    constructor(table_uuid:string,datetemp:Date,numpeople:Number,starttime:String,resname:String){
        this.table_UUID = table_uuid;
        this.date = datetemp;
        this.numPeople = numpeople;
        this.startTime = starttime;
        this.resName = resname;
    }
}


    export class Model{ 
        managers : Array<Manager>
        manager : Manager | null
        consumer : Consumer | null
        table : Table | null
        reservationinfo : ReservationInfo | null

        constructor(){
            this.managers = []
            this.manager = null;
            this.consumer = null;
            this.table = null;
            this.reservationinfo = null;
        }

        setManager(username : string, password : string){
            this.manager = new Manager(username,password)
        }

        setConsumer(email : string, sixDigitCode : string){
            this.consumer = new Consumer(email,sixDigitCode)
        }

        getConsumer(){
            return this.consumer;
        }

        getManager(){
            return this.manager;
        }

        setTable(table : any, res : any){
            this.table = new Table(table,res)
        }

        getTable(){
            return this.table;
        }

        setReservationInfo(table:any,date:any,people:any,start:any,name:any){
            this.reservationinfo = new ReservationInfo(table,date,people,start,name);
        }

        getReservationInfo(){
            return this.reservationinfo;
        }

        
}

export const modelInstance = new Model();
