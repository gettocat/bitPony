# bitPony
nodejs module to parse and create data and net packages on bitcoin protocol and talk with nodes

# Get started

```javascript
var bitPony = require('bitpony');
```

# Types

## Simple

```javascript
//little Endian format (reverse byte order)
console.log(bitPony.uint8.read("0f"));//15
console.log(bitPony.uint8.write(128).toString('hex'));//80

console.log(bitPony.uint16.read("0ff0"));//61455
console.log(bitPony.uint16.write(35001).toString('hex'));//b988

console.log(bitPony.uint32.read("ffff1000"));//1114111
console.log(bitPony.uint32.write(28000).toString('hex'));//606d0000

console.log(bitPony.uint64.read("0000ff0000000000"));//16711680
console.log(bitPony.uint64.write(Math.pow(2, 50)).toString('hex'));//2**50 - 0000000000000400

console.log(bitPony.char.read("626974636f696e206973207265616c206d6f6e6579").toString());//bitcoin is real money
console.log(bitPony.char.write("bitcoin is real money").toString('hex'));//626974636f696e206973207265616c206d6f6e6579
```

## Bitcoin

```javascript
//var int - special bitcoin type: https://en.bitcoin.it/wiki/Protocol_documentation#Variable_length_integer
//fd - for uint16, fe - for uint32, ff 0 fir uint64, other - number. If first byte less than fd - its number uint8
console.log(bitPony.var_int.read("10"));//16
console.log(bitPony.var_int.write(250).toString('hex'));//fa

console.log(bitPony.var_int.read("fdfe"));//254
console.log(bitPony.var_int.write(32000).toString('hex'));//fd007d

console.log(bitPony.var_int.read("fda861"));//25000
console.log(bitPony.var_int.write(25000).toString('hex'));//fda861

console.log(bitPony.var_int.read("ff0000000000000400"));//2^50 1125899906842624
console.log(bitPony.var_int.write(Math.pow(2, 50)).toString('hex'));//ff0000000000000400

//string - is var_str, special bitcoin type: https://en.bitcoin.it/wiki/Protocol_documentation#Variable_length_string
//first byte - var_int length of string, next lenbytes - str
console.log(bitPony.string.read("124d79206e616d65206973204e616e6f636174").toString());//My name is Nanocat
console.log(bitPony.string.write("My name is Nanocat").toString('hex'));

//hash - network byte order user. so, to make hash - need char32 with reversed bytes
console.log(bitPony.hash.read("4860eb18bf1b1620e37e9490fc8a427514416fd75159ab86688e9a8300000000"));//00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048
console.log(bitPony.hash.write("00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048").toString('hex'));//4860eb18bf1b1620e37e9490fc8a427514416fd75159ab86688e9a8300000000

```

## Complex types

### tx input

```
//input from tx https://blockchain.info/ru/tx/70f4c44126d1924a28a2bcc297f9a79abfb85e688ecacb520468448312c89ef7?format=hex
 { 
    hash: '612c0f25cda5ca7bcf6a3cad1a0a4c9c807b25e046ef939968b1c9d744791408',
    index: 1,
    scriptSig: '48304502...84b582b3fec',
    script_len: 107,
    sequence: 4294967295 
 }
 ```
 
 ```javascript
console.log(bitPony.tx_in.read("08147944d7c9b1689993ef46e0257b809c4c0a1aad3c6acf7bcaa5cd250f2c61010000006b483045022100e5dad2ab845fdabf02279fb424618547723790fd29937db738f11580facf8af20220763831cc67e7dad729bbf893da8f4ee2afbd81539314044e1b060ff664581de30121026aa1ae66d5a08776adafa2752b9d26c8b3202d261e9e83687c23b84b582b3fecffffffff"));

//08147944d7c9b1689993ef46e0257b809c4c0a1aad3c6acf7bcaa5cd250f2c61010000006b483045022100e5dad2ab845fdabf02279fb424618547723790fd29937db738f11580facf8af20220763831cc67e7dad729bbf893da8f4ee2afbd81539314044e1b060ff664581de30121026aa1ae66d5a08776adafa2752b9d26c8b3202d261e9e83687c23b84b582b3fecffffffff

console.log(bitPony.tx_in.write(
"612c0f25cda5ca7bcf6a3cad1a0a4c9c807b25e046ef939968b1c9d744791408", 
1, "48304502...84b582b3fec", 
0xffffffff).toString('hex'));//hash, index, scriptSig, sequence 
```

### tx out

```
//out from tx https://blockchain.info/ru/tx/8d4f4eb888a3130e31d1ac68045173e7a6b94a142843cde3c2fe74b64f3dd9da?format=hex
 
 { 
    amount: 4046768,
    scriptPubKey: 'a91481987422b78e406c48511c30b7962030e8b4e06f87',
    script_len: 23 
 }
```
 
 ```javascript
console.log(bitPony.tx_out.read("b0bf3d000000000017a91481987422b78e406c48511c30b7962030e8b4e06f87"));

//b0bf3d000000000017a91481987422b78e406c48511c30b7962030e8b4e06f87
console.log(bitPony.tx_out.write(4046768, "a91481987422b78e406c48511c30b7962030e8b4e06f87").toString('hex'));
```

### tx

```
 { 
    version: 1,
    in_count: 176,
    in: [ 
          { 
            hash: 'f83d0c94c1939037ec43e7231ee58bcbb05fa1ea9ac2e838cb3f340b85c931eb',
            index: 67,
            scriptSig: '47304402207fc2d....ba',
            script_len: 138,
            sequence: 4294967295 
          },
          //....
    ]
    out_count: 74,
    out: [ 
           { 
            amount: 237327,
            scriptPubKey: 'a9148962c0b9c89965ef3056ecc38860222b7815a35787',
            script_len: 23 
           },
           //....
    ],
    lock_time: 0,
    hash: 'b0dfddb20b270e7a5355e1035124bae6d6667e11702f54fad56b164df98e16e0',
    length: 28513 
 }
 ```
 
 ```javascript
 //https://blockchain.info/ru/tx/8d4f4eb888a3130e31d1ac68045173e7a6b94a142843cde3c2fe74b64f3dd9da?format=hex
console.log(bitPony.tx.read("txhex"))


//0100000001eb31...3578700000000
console.log(bitPony.tx.write(1, [{//not real tx, just for test
        hash: 'f83d0c94c1939037ec43e7231ee58bcbb05fa1ea9ac2e838cb3f340b85c931eb',
        index: 67,
        scriptSig: '47304402207fc2d3ba1c9f8260e7f2cb2222476ca0afd9046522bd014aafe93bc89a2d8000022058cb1dea497175e7504c0317ab601acb4919c1bfceb8ac3b50917640afcb3d200141046a11580e919a254797f72a42c52777fef4f7a2e0dbee4eabbb5790c52427f0986cdfe390b11d12a79f072389d37fb753222b23c5ccda336995b22de7733b60ba',
        sequence: 4294967295
    }], [{
        amount: 237327,
        scriptPubKey: 'a9148962c0b9c89965ef3056ecc38860222b7815a35787',
    }], 0).toString('hex'));
```

### block header

```
//read first 81 byte from block: https://blockchain.info/block/00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048?format=hex
 { 
    version: 1,
    prev_block: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
    merkle_root: '0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098',
    timestamp: 1231469665,
    bits: 486604799,
    nonce: 2573394689,
    txn_count: 1,
    hash: '00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048' 
 }
 ```
 
 ```javascript
console.log(bitPony.header.read("010000006fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000982051fd1e4ba744bbbe680e1fee14677ba1a3c3540bf7b1cdb606e857233e0e61bc6649ffff001d01e362990101"));

//010000006fe28c0ab6f1b372c1a6a246ae63f74f931e8365e15a089c68d6190000000000982051fd1e4ba744bbbe680e1fee14677ba1a3c3540bf7b1cdb606e857233e0e61bc6649ffff001d01e3629900
//80 bytes, without last var_int (tx count - 01) byte
console.log(bitPony.header.write(1,
        '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
        '0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098',
        1231469665,
        486604799,
        2573394689).toString('hex'));
```

# block

```
//block parsing
//return:
/*
 { 
 version: 536870914,
 prev_block: '00000000000000000007126942a3353613c0a1793ac8d81bde244340d750f5e2',
 merkle_root: 'a30181a9f15bef9c1c42635d853de139677ded5e3eb1af1c8f5ca8a857908157',
 timestamp: 1503564603,
 bits: 402734313,
 nonce: 1728324334,
 txn_count: 2614,
 hash: '0000000000000000002f8bd6a1552596d822284e8fd3efa3fec200d548089cce' 
 } 
 
 2614
```

```javascript
https.request({
    host: 'blockchain.info',
    path: '/ru/block/0000000000000000002f8bd6a1552596d822284e8fd3efa3fec200d548089cce?format=hex'
}, function (resp) {
    var orighex = "";
    resp.on('data', function (chunk) {
        orighex += chunk;
    });

    resp.on('end', function () {
        var orig = new Buffer(orighex, 'hex');
        var b = bitPony.block.read(orig);//parse this transaction
        console.log(b.header, b.txns.length)
    });

}).end();
```

## User types

User can create own types on bitPony base, use function bitPony.extend.

More examples in [wiki doc page](https://github.com/gettocat/bitPony/wiki/0-Get-started)
