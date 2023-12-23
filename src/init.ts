import logger from "./utils/logger";
import SolanaWallet from "./classes/wallet";


export async function init() {
    const privateKey = process.env.PRIVATEKEY as string;

    const wallet1 = new SolanaWallet(privateKey);

    await wallet1.getBalance().then(e => logger.info(e));

}