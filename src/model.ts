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

export class Table{
    table_UUID : String
    res_UUID : String

    constructor(table:string,res:string){
        this.table_UUID = table;
        this.res_UUID = res;
    }
}


    export class Model{ 
        managers : Array<Manager>
        manager : Manager | null
        table : Table | null

        constructor(){
            this.managers = []
            this.manager = null;
            this.table = null;
        }

        setManager(username : string, password : string){
            this.manager = new Manager(username,password)
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

        
}

export const modelInstance = new Model();
