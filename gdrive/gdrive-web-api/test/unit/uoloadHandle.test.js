import { describe, test, expect, jest } from "@jest/globals";

import Routes from "../../src/routes";
import UploadHandler from "../../src/uploadHandler";
import TestUtil from "../_util/testUtil";

describe("# UploadHandler test suite", () => {
  const ioObj = {
    to: (id) => ioObj,
    emit: (event, message) => {},
  };

  describe("# RegisterEvents", () => {
    test("should call onFile and onFinish functions on BusyBoy instance", () => {
      const uploadHandler = new UploadHandler({
        io: ioObj,
        socketId: "01",
      });

      jest.spyOn(uploadHandler, uploadHandler.onFile.name).mockResolvedValue();

      const headers = {
        "content-type": "multipart/form-data; boundary=",
      };
      const onFinish = jest.fn();
      const busBoyInstance = uploadHandler.registerEvents(headers, onFinish);
      expect(uploadHandler.onFile).toHaveBeenCalled();

      const fileStream = TestUtil.generateReadableStream([
        "chunk",
        "of",
        "data",
      ]);
      busBoyInstance.emit("file", "fieldname", fileStream, "filename.txt");
      expect(onFinish).toHaveBeenCalled();
    });
  });
});
