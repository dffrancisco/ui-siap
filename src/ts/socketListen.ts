import { Socket } from "socket.io-client";
// import { iEscolaOnLine } from '../models/interfaces'
// import escolasOnLine from '../pages/escolasOnLine/escolasOnLine'



const listen = {
    // legal(data: legal, call: any) {
    //     console.log(data);
    //     if (call)
    //         call({ xxx: 'meire é muito bonita' })
    // },


}


class SocketListen {

    constructor(socket: Socket) {

        for (let i in listen)
            //@ts-ignore
            socket.on(i, listen[i])

    }
}

export default SocketListen