import BusBoy from "busboy";

export default class UploadHandler {
  constructor({ io, socketId }) {}

  onFile(fieldName, file, fielname) {}

  registerEvents(header, onFinish) {
    const busBoy = new BusBoy({
      headers,
    });
    busBoy.on("file", this.onFile.bind(this));
    busBoy.on("finish", onFinish);
    return busBoy;
  }
}
