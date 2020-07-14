import { Block } from './blockchain';
import { hexToBinary, calculateHash } from './utils';

const BLOCK_GENERATION_INTERVAL: number = 10; //time to take to generate a block, in seconds
const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10; //for 10 blocks generated, the difficulty is adjusted

const hashMatchesDificulty = (hash: string, difficulty: number): boolean => {
    const hashToBinary: string = hexToBinary(hash);
    const requiredDifficulty: string = '0'.repeat(difficulty);
    return hashToBinary.startsWith(requiredDifficulty);
};

const findBlock = (index: number, timestamp: number, prevHash: string, data: string, difficulty: number): Block => {
    let nonce = 0;
    while(true){
        const hash = calculateHash(index, timestamp, prevHash, data);
        if(hashMatchesDificulty(hash, difficulty)){
            return new Block(index, timestamp, hash, prevHash, data, nonce, difficulty);
        }
        nonce++;
    }
};

const getDifficulty = (aBlockchain: Block[]): number => {
    const latestBlock = aBlockchain[aBlockchain.length - 1];
    if(latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index != 0){
        return getAdjustedDifficulty(latestBlock ,aBlockchain);
    }
    return latestBlock.difficulty;
};

const getAdjustedDifficulty = (latestBlock: Block, aBlockchain: Block[]): number => {
    const timeExpected = DIFFICULTY_ADJUSTMENT_INTERVAL * BLOCK_GENERATION_INTERVAL;
    const prevAdjutedBlock = aBlockchain[aBlockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    const ellapsedTime = latestBlock.timestamp - prevAdjutedBlock.timestamp;
    if(ellapsedTime < timeExpected / 2){
        return prevAdjutedBlock.difficulty + 1;
    }
    else if(ellapsedTime > 2 * timeExpected){
        return prevAdjutedBlock.difficulty - 1;
    }
    return prevAdjutedBlock.difficulty;
};