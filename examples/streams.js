var bitPony = require('../bitpony')

//stream read buffer
//https://blockchain.info/ru/tx/dfa14ed0d6446bcda697d94ccee6457e82ebefc1a3a9d4b5e9ac5a358122fe49?format=hex
var b = new Buffer('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff6403385a0701f777bf09a2bfb2c3a672a72517df1d12142886e0e499c2bf2fa7278d0f8291d5054e5689010000000000000000e9690100605ae622b01236e82f425443432f20537570706f7274202f4e59412f00000000000000000000000000000000000000000000028252f266000000001976a9142c30a6aaac6d96687291475d7d52f4b469f665a688ac0000000000000000266a24aa21a9ed3dc6a1858bd31103e9ecbb100cc27685be19dbcfb42479a5ef029296c1ffdadc00000000', 'hex');
var stream = new bitPony.reader(b);

var result = {};
var res = stream.uint32(0);
result.ver = (res.result);
res = stream.vector_tx_in(res.offset);//vector is var_int(count_items) + item[] 
result.in = (res.result);
res = stream.vector_tx_out(res.offset);
result.out = (res.result);
res = stream.uint32(res.offset);
result.lock = (res.result);
console.log(result)


//write stream buffer
var orig = new Buffer('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff6403385a0701f777bf09a2bfb2c3a672a72517df1d12142886e0e499c2bf2fa7278d0f8291d5054e5689010000000000000000e9690100605ae622b01236e82f425443432f20537570706f7274202f4e59412f00000000000000000000000000000000000000000000028252f266000000001976a9142c30a6aaac6d96687291475d7d52f4b469f665a688ac0000000000000000266a24aa21a9ed3dc6a1858bd31103e9ecbb100cc27685be19dbcfb42479a5ef029296c1ffdadc00000000', 'hex');
var b = new Buffer("");
var stream = new bitPony.writer(b);

var tx = bitPony.tx.read(orig)

stream.uint32(1, true);
stream.vector_tx_in(tx.in, true);
stream.vector_tx_out(tx.out, true);
stream.uint32(tx.lock_time, true);

console.log(stream.getBuffer().toString('hex') == orig.toString('hex'))//true