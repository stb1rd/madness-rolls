const main = async () => {
  const text = await Deno.readTextFile('./src/people.json');
  console.log(text);

  await Deno.writeTextFile('./hello.txt', 'Hello World!');
  console.log('write success');
};

main();
