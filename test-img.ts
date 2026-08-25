async function run() {
  const r = await fetch('https://etomoda.s3.us-east-1.amazonaws.com/documents/1782811896329-azopcedjith.jpg');
  console.log(r.status, r.statusText);
}
run();
