process.on("uncaughtException", (err) => {
  process.send(err.toString());
  process.exit(1);
});

process.on("message", (code) => {
  const { VM } = require("vm2");
  const timeout = 1000 * 10; // 10 second timeout
  const vm = new VM({
    timeout,
    eval: false,
    wasm: false,
    fixAsync: true,
  });
  const result = vm.run(code);
  
  process.send(result);
  process.exit(0);
});
