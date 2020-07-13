import { calculateHash } from './utils';

class Block {
    public index: number;
    public timestamp: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public nonce: number;
    public difficulty: number;

    public constructor (idx: number, timestamp: number, hash: string, prevHash: string, data: string, nonce: number, difficulty: number){
        this.index = idx;
        this.timestamp = timestamp;
        this.hash = hash;
        this.previousHash = prevHash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

}

const getCurrentTimestamp = (): number => Math.round(new Date().getTime() / 1000);

const genesisBlock: Block = new Block(0, getCurrentTimestamp(), '22fb93d2568d33de0845dc8d5becb3bfa78880436015affd280b056043fbd912', null, "The Genesis Block", 0, 0);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = () => { return blockchain ;}

const generateNextBlock = (blockData: string) => {
    const previousBlock = getLatestBlock();
    const nextTimestamp = getCurrentTimestamp();
    const nextIndex = previousBlock.index + 1;
    const hash = calculateHash(nextIndex, nextTimestamp, previousBlock.hash, blockData);
    const newBlock = new Block(nextIndex, nextTimestamp, hash, previousBlock.hash, blockData, 0, 0 /*TODO*/);

    return newBlock;
}

const isValidBlockStructure = (newBlock: Block): boolean => {
    return typeof newBlock.index === 'number'
        && typeof newBlock.data === 'string'
        && typeof newBlock.timestamp === 'number'
        && typeof newBlock.hash === 'string'
        && typeof newBlock.previousHash === 'string';
}

const isValidNewBlock = (newBlock: Block, previousBlock: Block): boolean => {
    if (!isValidBlockStructure(newBlock)) {
        console.log('invalid block structure: %s', JSON.stringify(newBlock));
        return false;
    }
    if(newBlock.index != previousBlock.index + 1){
        console.log('invalid index');
        return false;
    }
    if(newBlock.previousHash != previousBlock.hash){
        console.log('hash different of previous block hash');
        return false;
    }
    if(calculateHash(newBlock.index, newBlock.timestamp, newBlock.previousHash, newBlock.data) != newBlock.hash){
        console.log('invalid hash');
        return false;
    }
    return true;
}

const isValidChain = (chainToValidate: Block[]): boolean => {
    //We validate first if the first block is the genesis block
    const isValidGenesisBlock = (block: Block ): boolean => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    }
    if(!isValidGenesisBlock(chainToValidate[0])){
        return false;
    }
    //Second we valide each of block in the chains
    for(let i = 1; i < chainToValidate.length; i++){
        if(!isValidNewBlock(chainToValidate[i], chainToValidate[i - 1])){
            return false;
        }
    }
    return true;
}

const getLatestBlock = () => { return blockchain[blockchain.length - 1];}

const replaceChain = (newBlocks: Block[]) => {
    if(isValidChain(newBlocks) && newBlocks.length > blockchain.length){
        console.log('Received blockchain is valid. Replacing current blockchiain with the one received');
        blockchain = newBlocks;
        //broadcastNewBlokchain
    }
    else{
        console.log('Received blockchain is not valid');
    }
}

const addBlockToChain = (newBlock: Block) =>{
    if(isValidNewBlock(newBlock, getLatestBlock())){
        blockchain.push(newBlock);
        return true;
    }
    return false;
}

export {
    Block, 
    getBlockchain, 
    getLatestBlock, 
    generateNextBlock, 
    isValidBlockStructure, 
    replaceChain, 
    addBlockToChain
};