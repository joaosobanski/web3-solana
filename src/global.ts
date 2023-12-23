import * as dotenv from 'dotenv'
dotenv.config()
import { Connection } from "@solana/web3.js";
import web3 from '@solana/web3.js'
export const connection = new Connection(web3.clusterApiUrl('devnet'), 'confirmed');
