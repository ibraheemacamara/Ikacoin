import { Block } from './blockchain';
import { hexToBinary, calculateHash } from './utils';

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
}