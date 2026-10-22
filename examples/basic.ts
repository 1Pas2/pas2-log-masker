import { maskSecrets } from "../dist/index.js";
console.log(maskSecrets({ user: "demo", password: "do-not-log" }));
