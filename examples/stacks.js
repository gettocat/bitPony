var bitPony = require('../bitpony')

var h = new Buffer('010000006fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000982051fd1e4ba744bbbe680e1fee14677ba1a3c3540bf7b1cdb606e857233e0e61bc6649ffff001d01e3629900', 'hex');
var script = {//stack script
    'version': 'uint32',
    'prev_block': 'hash',
    'merkle_root': 'hash',
    'timestamp': 'uint32',
    'bits': 'uint32',
    'nonce': 'uint32',
};

//return:
/*
 [ 
 version: 1,
 prev_block: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
 merkle_root: '0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098',
 timestamp: 1231469665,
 bits: 486604799,
 nonce: 2573394689 
 ]
 */

var stack = new bitPony.stackReader(h, script)
var r = stack.getResult();
console.log(r);


//write stack
var orighex = "02000020e2f550d7404324de1bd8c83a79a1c0133635a34269120700000000000000000057819057a8a85c8f1cafb13e5eed7d6739e13d855d63421c9cef5bf1a98101a33b939e59e93c0118ee22046700";
var orig = new Buffer(orighex, 'hex');
var b = bitPony.header.read(orig);


var buff = new Buffer("");
var script = [
    ['uint32', b.version],
    ['hash', b.prev_block],
    ['hash', b.merkle_root],
    ['uint32', b.timestamp],
    ['uint32', b.bits],
    ['uint32', b.nonce],
    ['var_int', 0]
];
var stack = new bitPony.stackWriter(buff, script);
var res = stack.getResult();
console.log(res.toString('hex')==orighex)//true

