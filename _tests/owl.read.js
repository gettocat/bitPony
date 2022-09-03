let bitPony = require('../bitpony');

let checkKey = function (arr) {
    if (arr === undefined || arr === null)
        return "";
    if (typeof arr === 'object' || typeof arr === 'array') {
        let keys = Object.keys(arr).sort(function (a, b) {
            return a > b;
        });
        let str = "";
        for (let i in keys) {
            str += keys[i] + "" + checkKey(arr[keys[i]]);
        }

        return str;
    } else {
        return "" + arr;
    }
}

//test version and signs
//test primitives
    //min max int
    //round float
    //infinity vals
    //bool numbers
    //string empty and big
    //check null and bool
//test objects
//test arrays
//test nesting

//test parsing

let hex = "0100c85f6eef05000604047479706504736176650504646174610304057469746c65087465737420313233040474657874107669766120626c6f636b636861696e21060474616773030400047465737404000a626c6f636b636861696e0400066f7277656c6c02056164646564fe9f9839070007757064617465640007096166746572736176653366756e6374696f6e20286461746129207b0d0a2020202020202020636f6e736f6c652e6c6f672864617461290d0a202020207d06046d657461060200010200040200060400047465737405000104067365636f6e64036f6e65060005020001020002020003020004020005";
let json = bitPony.owl.read(hex);
console.log(json);

////////////////////////

let a = {
    _v: 0x7f,
    check: 'primitives',
    min: Number.MIN_VALUE,
    max: Number.MAX_VALUE,
    round1: 0.11231241515,
    round2: 0.123456789,
    round3: 1234.52352352635,
    inf: Infinity,
    num1: true,
    num2: false,
    str1: "",
    str2: "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111211111111111111111111111111111111111111111111111111111",
    val1: null, 
    val2: true,
    //val3: undefined,
    obj1: {a:2,b:3,c:0, e: [1,2,3,1,'sdfsdf']},
    arr1: [1,2,3,'sdfsdf',[1,2,5,8], {a:0,b:0,c:2}],
}

console.log(JSON.stringify(a));
let x = bitPony.owl.write(a);

console.log(x.toString('hex'));

let json2 = bitPony.owl.read(x);
console.log(JSON.stringify(a), JSON.stringify(json2), checkKey(a) === checkKey(json2));
