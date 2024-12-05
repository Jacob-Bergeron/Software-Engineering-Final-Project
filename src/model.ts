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


    export class Model{ 
        managers : Array<Manager>
        manager : Manager | null
        consumer : Consumer | null

        constructor(){
            this.managers = []
            this.manager = null;
            this.consumer = null;
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

        
}

export const modelInstance = new Model();
