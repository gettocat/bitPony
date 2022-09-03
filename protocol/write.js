var writeStack = require('../stack/write')

var bitcoinMessageWrite = function (buffer, script) {
    this.buffer = buffer;
    this.script = script;
    this.result = null;
}

bitcoinMessageWrite.prototype.getResult = function (debug) {
    if (!this.result)
        this.result = new writeStack(this.buffer, this.script).getResult(debug);
    return this.result;
}

bitcoinMessageWrite.version = function (protocolVersion, services, timestamp, ipRecv, portRecv, ipFrom, portFrom, nonce, useragent, startBlockHeight, relay) {
    var res = new bitcoinMessageWrite(Buffer.from(""), [
        ['uint32', protocolVersion],
        ['uint64', services],
        ['uint64', timestamp],
        ['net_addr', null, 0, ipRecv, portRecv], //recv
        ['net_addr', null, 0, ipFrom, portFrom], //from
        ['uint64', nonce],
        ['string', useragent],
        ['uint32', startBlockHeight],
        ['uint8', relay]
    ]).getResult();
    return res;
}

bitcoinMessageWrite.getheaders = function (version, hashes, stophash) {
    if (!stophash)
        stophash = "0000000000000000000000000000000000000000000000000000000000000000";

    var script = [
        ['uint32', version],
        ['var_int', hashes.length],
    ];

    for (var i in hashes) {
        script.push(['hash', hashes[i]])
    }

    script.push(['hash', stophash]);

    var res = new bitcoinMessageWrite(Buffer.from(""), script).getResult();
    return res;

}

bitcoinMessageWrite.header = function (version, prev_block, merkle_root, timestamp, bits, nonce, txn_count) {
    if (typeof bits == 'string')
        bits = parseInt(bits, 16)
    var res = new bitcoinMessageWrite(Buffer.from(""), [
        ['header', version, prev_block, merkle_root, timestamp, bits, nonce, txn_count],
    ]).getResult();
    return res;
}

bitcoinMessageWrite.tx = function (version, tx_in, tx_out, lock_time, witness) {
    var res = new bitcoinMessageWrite(Buffer.from(""), [
        ['tx', version, tx_in, tx_out, lock_time, witness],
    ]).getResult();
    return res;
}

bitcoinMessageWrite.block = function (header, txlist) {
    var res = new bitcoinMessageWrite(Buffer.from(""), [
        ['block', header, txlist],
    ]).getResult();
    return res;
}

//todo?

module.exports = bitcoinMessageWrite;