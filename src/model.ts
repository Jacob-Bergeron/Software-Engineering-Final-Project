
export class Model{ 
    administrators : Array<Administrator> 
    managers : Array<Manager>
    consumers : Array<Consumer>

    constructor(){
        this.administrators = []
        this.managers = []
        this.consumers = []
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
    tables : [{number : number, capacity : number}]
    schedule : [{weekDay : number, openTime : string, closeTime: string}]
    uniqueID : string

        constructor() {
            this.name = "default";
            this.address = "497 North Parker Drive";
            this.numberOfTables = 0;
            this.tables = [{number : 0, capacity : 0}];
            this.schedule = [{weekDay : 1, openTime : Date(), closeTime : Date()}];
            this.uniqueID = ""
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

