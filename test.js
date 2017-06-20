const cp = require('child_process');
const stream = require('stream');
const path = require('path');
const fixturify = require('fixturify');

fixturify.writeSync(__dirname, {
  src: {
    "index.ts": `export class Foo {}`
  },
  tmp: {
    "index.ts": null
  }
});

let child = cp.spawn('node', ['node_modules/typescript/lib/tsserver.js',
                              '--useSingleInferredProject',
                              '--logVerbosity', 'verbose',
                              '--logFile', 'tsserver.log']);

let pending = [{
  "seq": 1,
  "type": "request",
  "command": "open",
  "arguments":
  {
    "file": path.join(__dirname, "src/index.ts"),
    "fileContent": "export class Foo {}",
    "scriptKindName": "TS",
    "projectRootPath": __dirname
  }
}, {
  "seq":2,
  "type":"request",
  "command":"geterr",
  "arguments":{
    "delay":0,
    "files":[path.join(__dirname, "src/index.ts")]
  }
}];

sendRequest();

child.stdout.setEncoding('utf8');
child.stderr.pipe(process.stderr);

child.stdout.on('data', (chunk) => {
  console.log(chunk);

  sendRequest();

  if (chunk.indexOf('"requestCompleted"') !== -1) {
    setTimeout(() => {
      fixturify.writeSync(__dirname, {
        tmp: {
          "index.ts": `export default lass Foo {}`
        }
      });
    }, 100);
  }
});

function sendRequest() {
  if (pending.length > 0) {
    child.stdin.write(JSON.stringify(pending.shift()) + '\r\n', 'utf8');
  }
}
