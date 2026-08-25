async function test() {
  const res = await fetch('https://etomoda.s3.amazonaws.com', { method: 'HEAD' });
  console.log(res.status);
  console.log(Object.fromEntries(res.headers.entries()));
}
test();
