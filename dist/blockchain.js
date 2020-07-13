import * as CryptoJS from 'crypto-js';
class Block {
    constructor(idx, timestamp, hash, prevHash, data) {
        this.index = idx;
        this.timestamp = timestamp;
        this.hash = hash;
        this.previousHash = prevHash;
        this.data = data;
    }
}
const calculateHash = (idx, timestamp, prevHash, data) => CryptoJS.SHA256(idx + prevHash + timestamp + data).toString();
const getCurrentTimestamp = () => Math.round(new Date().getTime() / 1000);
const genesisBlock = new Block(0, getCurrentTimestamp(), '22fb93d2568d33de0845dc8d5becb3bfa78880436015affd280b056043fbd912', null, "The Genesis Block");
let blockchain = [genesisBlock];
const getBlockchain = () => { return blockchain; };
const generateNextBlock = (blockData) => {
    const previousBlock = getLatestBlock();
    const nextTimestamp = getCurrentTimestamp();
    const nextIndex = previousBlock.index + 1;
    const hash = calculateHash(nextIndex, nextTimestamp, previousBlock.hash, blockData);
    const newBlock = new Block(nextIndex, nextTimestamp, hash, previousBlock.hash, blockData);
    return newBlock;
};
const isValidBlockStructure = (newBlock) => {
    return typeof newBlock.index === 'number'
        && typeof newBlock.data === 'string'
        && typeof newBlock.timestamp === 'number'
        && typeof newBlock.hash === 'string'
        && typeof newBlock.previousHash === 'string';
};
const isValidNewBlock = (newBlock, previousBlock) => {
    if (!isValidBlockStructure(newBlock)) {
        console.log('invalid block structure: %s', JSON.stringify(newBlock));
        return false;
    }
    if (newBlock.index != previousBlock.index + 1) {
        console.log('invalid index');
        return false;
    }
    if (newBlock.previousHash != previousBlock.hash) {
        console.log('hash different of previous block hash');
        return false;
    }
    if (calculateHash(newBlock.index, newBlock.timestamp, newBlock.previousHash, newBlock.data) != newBlock.hash) {
        console.log('invalid hash');
        return false;
    }
    return true;
};
const isValidChain = (chainToValidate) => {
    //We validate first if the first block is the genesis block
    const isValidGenesisBlock = (block) => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if (!isValidGenesisBlock(chainToValidate[0])) {
        return false;
    }
    //Second we valide each of block in the chains
    for (let i = 1; i < chainToValidate.length; i++) {
        if (!isValidNewBlock(chainToValidate[i], chainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
};
const getLatestBlock = () => { return blockchain[blockchain.length - 1]; };
const replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        console.log('Received blockchain is valid. Replacing current blockchiain with the one received');
        blockchain = newBlocks;
        //broadcastNewBlokchain
    }
    else {
        console.log('Received blockchain is not valid');
    }
};
export { Block, getBlockchain, generateNextBlock };
//# sourceMappingURL=blockchain.js.map