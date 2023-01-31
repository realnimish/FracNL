import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

export async function getAllAccounts() {
    const extensions = await web3Enable('Gencom');
    if (extensions.length === 0) {
        return [];
    }
    const allAccounts = await web3Accounts();
    return allAccounts;
}

export function cutAddress(addr) {
    if(!addr) return "";
    return addr.substring(0,5) + "..." + addr.substring(addr.length - 4);
} 