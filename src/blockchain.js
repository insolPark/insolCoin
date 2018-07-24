const CryptoJS = require("crypto-js");

class Block {
    constructor(index, hash, previousHash, timestamp, data){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}


const genesisBlock = new Block(
    0,
    "2C4CEB90344F20CC4C77D626247AED3ED530C1AEE3E6E85AD494498B17414CAC",
    null,
    1520312194926,
    "This is the genesis!!"
);

let blockchain = [genesisBlock];

console.log(blockchain)


const getLastBlock = () => blockchain[blockchain.length - 1];

const getTimestamp = () => new Date.getTime() / 1000;

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp, data) => CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString;

const createNewBlock = data => {
    const previousBlock = getLastBlock();
    const newBlockindex = previousBlock.index + 1;
    const newTimestamp = getTimestamp();
    const newHash = createHash(newBlockindex, previousBlock.hash, newTimestamp, data);

    const newBlock = new Block(newBlockindex, newHash, newTimestamp, data);

    return newBlock;
}

const getBlocksHash = (block) => createHash(block.index, block.previousHash, block.timestamp, block.data);

// 체인블록 유효성 체크
const isNewBlockValid = (candidateBlock, latestBlock) => {
    if(!isNewStructureValid(candidateBlock)){
        console.log('블록의 데이터 타입에 문제가 발생했습니다.');
        return false;
    }else
    //다음에 올 체인 블록의 인덱스값 검증
    if(latestBlock.index + 1 !== candidateBlock.index){
        console.log('다음에 올 체인블록의 인덱스 값이 유효하지 않습니다.');
        return false;

    //이전의 해쉬값과 입력될 블록의 해쉬값 검증
    }else if(latestBlock.hash !== candidateBlock.previousHash){
        console.log('마지막 체인블록의 해쉬값과 일치하지 않은 해쉬값');
        return false;
    }else if(getBlocksHash(candidateBlock) !== candidateBlock.hash){
        console.log('잘못된 체인블록의 해쉬값 입니다. ');
        return false;
    }
    return true;
}

//블록구조 검증
const isNewStructureValid = (block) => {
    return (
        typeof block.index === 'number' &&
        typeof bolck.hash === 'string' &&
        typeof block.previousHash === 'string' &&
        typeof block.timestamp === 'number' &&
        typeof block.data === 'string'
    );
}

const isChainValid = (candidateChain) => {
    const isGenesisValid = block => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if(!isGenesisValid(candidateChain[0])){
        console.log('기존 블록과 다음에 올 블록이 일치하지 않습니다.');
        return false;
    }

    for(let i=1; i < candidateChain.length; i++){
        if(!isNewBlockValid(candidateChain[i], candidateChain[i-1])){
            return false;
        }
    }

    return true;
}

const replaceChain = newChain => {
    if(isChainValid(newChain) && newChain.length > getBlockchain().length){
        blockchain = newChain;
        return true;
    }else{
        return false;

    }
}

const addBlockToChain = candidateBlock => {
    if(isNewBlockValid(candidateBlock,getLastBlock())){
        getBlockchain().push(candidateBlock);
        return ture;
    }eles{
        return false;
    }
}