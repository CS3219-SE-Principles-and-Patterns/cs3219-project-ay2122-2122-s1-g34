// import * as encoding from "lib0/encoding.js";
// import * as map from "lib0/map.js";
// import * as mutex from "lib0/mutex.js";
// import { Socket } from "socket.io";
// import * as awarenessProtocol from "y-protocols/awareness.js";
// import * as Y from "yjs";

// const messageAwareness = 1;

// class WSSharedDoc extends Y.Doc {
//   name: string;
//   mux: mutex.mutex;
//   conns: Map<any, Set<number>>;
//   awareness: awarenessProtocol.Awareness;

//   /**
//    * @param {string} name
//    */
//   constructor(name: string) {
//     super({ gc: true });
//     this.name = name;
//     this.mux = mutex.createMutex();

//     /**
//      * Maps from conn to set of controlled user ids. Delete all user ids from awareness when this conn is closed
//      * @type {Map<Object, Set<number>>}
//      */
//     this.conns = new Map();

//     /**
//      * @type {awarenessProtocol.Awareness}
//      */
//     this.awareness = new awarenessProtocol.Awareness(this);
//     this.awareness.setLocalState(null);
//     /**
//      * @param {{ added: Array<number>, updated: Array<number>, removed: Array<number> }} changes
//      * @param {Object | null} conn Origin is the connection that made the change
//      */
//     const awarenessChangeHandler = (
//       {
//         added,
//         updated,
//         removed,
//       }: {
//         added: Array<number>;
//         updated: Array<number>;
//         removed: Array<number>;
//       },
//       conn: object | null
//     ) => {
//       const changedClients = added.concat(updated, removed);
//       if (conn !== null) {
//         const connControlledIDs = this.conns.get(conn);

//         if (connControlledIDs !== undefined) {
//           added.forEach((clientID) => {
//             connControlledIDs.add(clientID);
//           });
//           removed.forEach((clientID) => {
//             connControlledIDs.delete(clientID);
//           });
//         }
//       }

//       // broadcast awareness update
//       const encoder = encoding.createEncoder();
//       encoding.writeVarUint(encoder, messageAwareness);
//       encoding.writeVarUint8Array(
//         encoder,
//         awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
//       );
//       const buff = encoding.toUint8Array(encoder);
//       this.conns.forEach((_, c) => {
//         send(this, c, buff);
//       });
//     };
//     this.awareness.on("update", awarenessChangeHandler);
//     this.on("update", updateHandler);
//     if (isCallbackSet) {
//       this.on(
//         "update",
//         debounce(callbackHandler, CALLBACK_DEBOUNCE_WAIT, {
//           maxWait: CALLBACK_DEBOUNCE_MAXWAIT,
//         })
//       );
//     }
//   }
// }

// /**
//  * Gets a Y.Doc by name, whether in memory or on disk
//  *
//  * @param {string} roomName - the name of the Y.Doc to find or create
//  * @return {WSSharedDoc}
//  */
// const getYDoc = (roomName: string): WSSharedDoc =>
//   map.setIfUndefined(docs, docname, () => {
//     const doc = new WSSharedDoc(docname);
//     doc.gc = gc;
//     if (persistence !== null) {
//       persistence.bindState(docname, doc);
//     }
//     docs.set(docname, doc);
//     return doc;
//   });

// function setupSocketConnection(client: Socket) {
//   // TODO: derive name from database and jwt token
//   const roomName = "test";

//   // get doc, initialize if it does not exist yet
//   const doc = getYDoc(roomName);
// }
