import { connection } from "../global";
import logger from "../utils/logger";
import { Keypair, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

class SolanaWallet {
  private keyPair: Keypair;

  constructor(publicKey: string) {
    const privateKey = Uint8Array.from(Buffer.from(publicKey, 'base64'));
    this.keyPair = Keypair.fromSecretKey(privateKey);
  }

  public async getBalance(): Promise<number> {
    let balance = await connection.getBalance(this.keyPair.publicKey);
    return balance / LAMPORTS_PER_SOL;
  }

  public async getFaucet(): Promise<void> {
    await connection.requestAirdrop(this.keyPair.publicKey, 5e9)
      .then(e => logger.info(`Tx get faucet: ${e}`))
      .catch(e => logger.error(e, 'Failed on get faucet!'));
  }

  public async transfer(recipientString: string, sol: number): Promise<void> {
    try {
      const recipient = new PublicKey(recipientString);

      let tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: recipient,
          toPubkey: new PublicKey(this.keyPair.publicKey),
          lamports: sol * LAMPORTS_PER_SOL,
        })
      );
      tx.feePayer = this.keyPair.publicKey;

      await connection.sendTransaction(tx, [this.keyPair])
        .then(e => logger.info(`Transfer Tx: ${e}`))
        .catch(e => logger.error(e, 'Error on transfer'));
    } catch (e) {
      logger.error(e, 'Error on transfer')
    }
  }
}

export default SolanaWallet;