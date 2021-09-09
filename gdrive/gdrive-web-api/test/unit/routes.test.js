import { describe, test, expect, jest } from "@jest/globals";
import Routes from "../../src/routes.js";

const defaultParams = {
  req: {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "",
    body: {},
  },
  res: {
    setHeader: jest.fn(),
    writeHead: jest.fn(),
    end: jest.fn(),
  },
  values: () => Object.values(defaultParams),
};

describe("# Routes suit test", () => {
  describe("# SetSocketInstance", () => {
    test("setSocket should store io instance", () => {
      const routes = new Routes();
      const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {},
      };
      routes.setSocketInstance(ioObj);
      expect(routes.io).toStrictEqual(ioObj);
    });
  });
  describe("# Handler", () => {
    test("# given an inexistent route it should choose default route", async () => {
      const routes = new Routes();
      const params = { ...defaultParams };
      params.req.method = "inexistent";
      await routes.handler(...params.values());
      expect(params.res.end).toHaveBeenCalledWith("Hello world");
    });

    test("it should set any request with Cors enabled", async () => {
      const routes = new Routes();
      const params = { ...defaultParams };
      params.req.method = "inexistent";
      await routes.handler(...params.values());
      expect(params.res.setHeader).toHaveBeenCalledWith(
        "Access-Control-Allow-Origin",
        "*"
      );
    });
    test("given method OPTIONS it should choose options route", async () => {
      const routes = new Routes();
      const params = { ...defaultParams };
      params.req.method = "OPTIONS";
      await routes.handler(...params.values());
      expect(params.res.writeHead).toHaveBeenCalledWith(204);
      expect(params.res.end).toHaveBeenCalledWith();
    });

    test("given method POST it should choose post route", async () => {
      const routes = new Routes();
      const params = { ...defaultParams };

      params.req.method = "POST";
      jest.spyOn(routes, routes.post.name).mockResolvedValue();

      await routes.handler(...params.values());
      expect(routes.post).toHaveBeenCalled();
    });

    test("given method GET it should choose get route", async () => {
      const routes = new Routes();
      const params = { ...defaultParams };

      params.req.method = "GET";
      jest.spyOn(routes, routes.get.name).mockResolvedValue();

      await routes.handler(...params.values());
      expect(routes.get).toHaveBeenCalled();
    });
  });
});

describe("# Get", () => {
  test("given method GET it should list all files downloaded", async () => {
    const route = new Routes();
    const params = { ...defaultParams };
    const filesStatusesMock = [
      {
        size: "188 kB",
        lastModified: "2021-09-03T20:56:28.443Z",
        owner: "erickwendel",
        file: "file.txt",
      },
    ];
    jest
      .spyOn(route.fileHelper, route.fileHelper.getFilesStatus.name)
      .mockResolvedValue(filesStatusesMock);
    params.req.method = "GET";
    await route.handler(...params.values());
    expect(params.res.writeHead).toHaveBeenCalledWith(200);
    expect(params.res.end).toHaveBeenCalledWith(
      JSON.stringify(filesStatusesMock)
    );
  });
});
