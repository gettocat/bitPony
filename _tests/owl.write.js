let bitPony = require('../bitpony');
//test version and signs
//test primitives
//test objects
//test arrays
//test nesting
let a = {
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
    meta: [1, 4, 6, 'test', { 'second': 'one' }, [1, 2, 3, 4, 5]]
}




console.log(JSON.stringify(a));
let x = bitPony.owl.write(a);

console.log(x.toString('hex'));

let json = bitPony.owl.read(x);
console.log(JSON.stringify(a), JSON.stringify(json), JSON.stringify(a) === JSON.stringify(json));

let b = "";
console.log(b = bitPony.owl.write({}));

console.log(bitPony.owl.read(b));
