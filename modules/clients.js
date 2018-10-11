class Clients {
  constructor() {
    this.clinetBuffer = [];
    this.clientList = []; //[{mac:xxxx, ip:xxxxx, id:xx}]
  }

  existsInClientBufer(client) {
    var res = false;
    for (let i = 0; i < this.clinetBuffer.length; i++) {
      // console.log(client.mac);
      // console.log(this.clinetBuffer[i].mac);
      if (this.clinetBuffer[i].mac === client.mac) {
        return true;
      }
      // return false;
    }

    return false;
  }

  // add client to intermediate client buffer
  put(client) {
    if (!this.existsInClientBufer(client)) {
      // console.log("client NOT Exists: ", client);
      this.clinetBuffer.push(client);
    } else {
      // throw new Error("Client already exists!");
    }
  }

  getClientList() {
    return this.clientList;
  }
  // add(client) {
  //   if (!this.exists(client)) {
  //     this.clientList.push(client);
  //   }
  // }

  updateList() {
    this.clientList = this.clinetBuffer;
    this.clinetBuffer = [];
  }
}

clients = new Clients();

module.exports = clients;
