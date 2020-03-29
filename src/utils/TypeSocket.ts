
// // This will be a class that takes a socketIO socket as a variable/dependency and then exposes methods on it.
// class TypeSocket {
//     socket: any; //SocketIO socket

//     constructor(socket: any) {
//         this.socket = socket;
//     }


//     emit(name: string, body: <T extends JsonConvertible>){
//         //Convert the class passed in to json to pass
//         json = body.toJSON;

//         this.socket.emit(name, json);
//     }

//     on(name: string, wrapperHandler: function<T>){

//         //Can force the wrapperHandler to implement a class that forces specific methods namely a pre-validate function and then an
//         // an internal handler function. Then this function will call its pre-validate and internal handlers.

//         //How would I validate the injected data into the function is of valid type?!? sems difficult.

//         //WrapperHandler will validate and then call an internal handler
//     }

//     // emit(event: EmitEvent) {
//     //     //

//     //     //Make call with internal socket

//     //     //Validate response is of correct response class - construct a new object
//     // }
// }

// // type EmitEvent<T> = {
// //     eventName: string,
// //     eventBody: T.toJson(),
// //     eventBodyClass: string,
// //     expectedResponseClass: string
// // }

// // Ideal example usages
// emit.("givingAnswer", {}, Answer.Class, AnswerResponse.Class)

// //Make this file a module by exporting something
export {}



// //Scratch space
// ts.emit("Hello", new HelloMessage("","",""))

// ts.on("Hello", this.helloHandler<HelloMessage>)