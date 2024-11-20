//this file contains 
export class Administrator {
    userName : String
    password : String

    constructor(){
        this.userName = ""
        this.password = ""
    }
}

export class Manager{
    userName : String
    password : String
    myRestaurant : Restaurant 
    
    constructor(){
        this.userName = ""
        this.password = ""
        this.myRestaurant = ""
    }

    
}


export class Tables4U{
    currentDate : Date
    
    constructor(){
        this.currentDate = new Date();
    }
 }



export class Model{ 

    administrators : Array<Administrator> 
    managers : Array<Manager>

    constructor(){
        this.administrators = []
        this.managers = []
    }

}

export class Restaurant {
    name : string
    address : string
    numberOfTables : number
    tables : [{tableNumber : number, capacity : number}]
    schedule : [{date : string, openTime : string, closeTime: string}]
    uniqueID : string
    //TODO construct reservation datatype
    reservations : [{tables : [{tableNumber : 0, capacity : 0}], time : string, date : string, userEmail : string}]

        constructor() {
            this.name = "default";
            this.address = "497 North Parker Drive";
            this.numberOfTables = 0;
            this.tables = [{tableNumber : 0, capacity : 0}];
            this.schedule = [{date : Date(), openTime : Date(), closeTime : Date()}];
            this.uniqueID = "methhead freestyle"
            this.reservations = 
        }
}