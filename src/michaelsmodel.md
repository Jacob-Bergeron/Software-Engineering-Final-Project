export class Tables4U{
    currentDate : Date
    
    constructor(){
        this.currentDate = new Date();
    }
 }


export class Reservation {
    reservation : [{table : [{tableNumber : 0, capacity : 0}] | undefined, time : string, date : string, userEmail : string}]

    constructor () {
        this.reservation = [{table : undefined, time : "11:00", date : Date(), userEmail : "joe_biden@DOD.gov"}];
    }
}

export class Table {
    table : [{tableNumber : number, capacity : number}] | undefined;

    constructor() {
        this.table = undefined;
    }
}

export class RestaurantSchedule {
    schedule : [{date : string, openTime : string, closeTime: string}] | undefined;

    constructor() {
        this.schedule = undefined;
    }
}

export class Restaurant {
    name : string
    address : string
    uniqueID : string
    activated : boolean

    tables : Array<Table>
    schedule : Array<RestaurantSchedule>
    reservations : Array<Reservation>

    constructor() {
        this.name = "default";
        this.address = "497 North Parker Drive";
        this.uniqueID = "methhead freestyle";
        this.activated = false;
        this.tables = [];
        this.schedule = [];
        this.reservations = [];
    }
}