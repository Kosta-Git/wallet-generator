const { ethers } = require('ethers');
const fs = require('fs');
require('dotenv').config()

const generatePath = (purpose, coin, account, chain, index) => `m/${purpose}'/${coin}'/${account}'/${chain}/${index}`;
const generateMnemomnic = () => new ethers.Wallet.createRandom().mnemonic.phrase;
const createWalletFromPath = (mnemonic, path) => new ethers.Wallet.fromMnemonic(mnemonic, path);

const mnemonic = process.env.MNEMONIC || null;
const amount = process.env.AMOUNT || 10;
const purpose = 44;
const coin = 60;
const account = 0;
const chain = 0;

const main = () => {
    let phrase = mnemonic || generateMnemomnic();
    let path = (index) => generatePath(purpose, coin, account, chain, index);
    let wallets = [];

    for(let i = 0; i < amount; ++i) wallets.push(createWalletFromPath(phrase, path(i)));

    let output = {
        "phrase": phrase,
        "path": {
            "purpose": purpose,
            "coin": coin,
            "account": account,
            "chain": chain
        },
        "amount": amount,
        "accounts": wallets.map(w => ({"address": w.address, "public": w.publicKey, "private": w.privateKey}))
    }

    fs.writeFileSync(`./wallets-${new Date().getTime()}.json`, JSON.stringify(output, null, 2) , 'utf-8');
}

main();