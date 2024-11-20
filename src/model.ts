export class Model{ 
    administrators : Array<Administrator> 
    managers : Array<Manager>

    constructor(){
        this.administrators = []
        this.managers = []
    }
}

export class Tables4U{
    currentDate : Date
    
    constructor(){
        this.currentDate = new Date();
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

        constructor() {
            this.name = "default";
            this.address = "497 North Parker Drive";
            this.numberOfTables = 0;
            this.tables = [{tableNumber : 0, capacity : 0}];
            this.schedule = [{date : Date(), openTime : Date(), closeTime : Date()}];

        }
}

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
    
    // un = username, ps = password
    constructor(un:String, ps :string, res: Restaurant){
        this.userName = un
        this.password = ps
        this.myRestaurant = res // <- does this work? Or do I need to set each property separate
    }
}

export class Consumer{
    userEmail : String
    hasReservation : Boolean

    constructor(){
        this.userEmail = ""
        this.hasReservation = false
    }

    
} 

