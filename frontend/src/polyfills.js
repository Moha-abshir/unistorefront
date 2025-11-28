import { Buffer } from "buffer";

window.global = window;
window.process = {
  env: { DEBUG: undefined },
};
window.Buffer = Buffer;
