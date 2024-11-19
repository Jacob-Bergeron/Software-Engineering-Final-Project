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
        this.myRestaurant
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
    tables : [{number : number, capacity : number}]
    schedule : [{weekDay : number, openTime : Date, closeTime: Date}]
    uniqueID : string

        constructor() {
            this.name = "default";
            this.address = "497 North Parker Drive";
            this.numberOfTables = 0;
            this.tables = [null]

        }
}