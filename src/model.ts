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


    export class Model{ 
        managers : Array<Manager>
        manager : Manager | null

        constructor(){
            this.managers = []
            this.manager = null;
        }

<<<<<<< HEAD
        
=======
>>>>>>> 6b178901211a4f7056cc1b3604842184b30beb1e

        setManager(username : string, password : string){
            this.manager = new Manager(username,password)
        }

        getManager(){
            return this.manager;
        }

        
}

export const modelInstance = new Model();
