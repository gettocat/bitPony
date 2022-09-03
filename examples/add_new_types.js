var bitPony = require('../bitpony')

//you can add new type and use it in bitPony[type].read/write
//for example var_int vector: var_int(cnt items) + var_int[]
bitPony.extend('vector_var_int', function () {

    return {
        read: function (buffer) {
            if (typeof buffer == 'string')
                buffer = new Buffer(buffer, 'hex')

            if (buffer.length == 0 || !buffer)
                buffer = new Buffer([0x0]);

            var stream = new bitPony.reader(buffer);
            var res = stream.var_int(0);
            var cnt = res.result, arr = [];
            for (var i = 0; i < cnt; i++) {
                res = stream.var_int(res.offset)
                arr.push(res.result);
            }

            return arr;

        },
        write: function (arr) {

            var buffer = new Buffer("");
            var stream = new bitPony.writer(buffer);
            stream.var_int(arr.length, true);
            for (var i in arr) {
                stream.var_int(arr[i], true);
            }

            return stream.getBuffer();

        }
    }

});

var res = bitPony.vector_var_int.write([1, 15, 532, Math.pow(2, 55), 3, 6346736]);
console.log(res.toString('hex'))//06010ffd1402ff000000000000800003fef0d76000

var res = bitPony.vector_var_int.read("06010ffd1402ff000000000000800003fef0d76000");
console.log(res);//[ 1, 15, 532, 36028797018963970, 3, 6346736 ]


//example 2: my own type: binary json
//makes js obj (with inner arrays, numbers, string, and !functions to hex and back)
require('./json')

var arr = {
    type: 'save',
    data: {
        title: 'test 123',
        text: 'viva blockchain!',
        tags: ['test', 'blockchain', 'orwell']
    },
    added: 121215135,
    updated: null,
    aftersave: function (data) {
        console.log(data)
    },
    meta: [1, 4, 6, 'test', {'second': 'one'}, [1, 2, 3, 4, 5]]
};


var b = bitPony.json.write(arr);
var res = bitPony.json.read(b);
console.log(JSON.stringify(res) == JSON.stringify(arr))//true

var obj = {arr: [], fnc1: function (a, b) {
        return a + b
    }, fnc2: function (b, a) {
        return b - a
    }};

var b = bitPony.json.write(obj);
var res = bitPony.json.read(b);
console.log(res.fnc1(1, 1) == 2)//true
console.log(res.fnc2(30, 15) == 15)//true
console.log(JSON.stringify(res) == JSON.stringify(obj))//true
