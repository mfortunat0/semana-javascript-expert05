import { logger } from "./logger.js";
import FileHelper from "./fileHelper.js";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDownloadFolder = resolve(__dirname, "../", "downloads");

export default class Router {
  constructor(downloadFolder = defaultDownloadFolder) {
    this.downloadFolder = downloadFolder;
    this.fileHelper = FileHelper;
  }

  setSocketInstance(io) {
    this.io = io;
  }

  async defaultRoute(req, res) {
    res.end("Hello world");
  }

  async options(req, res) {
    res.writeHead(204);
    res.end();
  }

  async post(req, res) {
    logger.info("post");
    res.end();
  }

  async get(req, res) {
    const files = await this.fileHelper.getFilesStatus(this.downloadFolder);
    res.writeHead(200);
    res.end(JSON.stringify(files));
  }

  handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const chose = this[req.method.toLowerCase()] || this.defaultRoute;
    return chose.apply(this, [req, res]);
  }
}
