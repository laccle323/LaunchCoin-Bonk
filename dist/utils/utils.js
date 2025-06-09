"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execTx = void 0;
const execTx = (transaction_1, connection_1, payer_1, ...args_1) => __awaiter(void 0, [transaction_1, connection_1, payer_1, ...args_1], void 0, function* (transaction, connection, payer, commitment = 'confirmed') {
    try {
        //  Sign the transaction with payer wallet
        const signedTx = yield payer.signTransaction(transaction);
        // Serialize, send and confirm the transaction
        const rawTransaction = signedTx.serialize();
        console.log(yield connection.simulateTransaction(signedTx));
        // return;
        const txid = yield connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 2,
            preflightCommitment: "processed"
        });
        console.log(`https://solscan.io/tx/${txid}?cluster=custom&customUrl=${connection.rpcEndpoint}`);
        const confirmed = yield connection.confirmTransaction(txid, commitment);
        console.log("err ", confirmed.value.err);
    }
    catch (e) {
        console.log(e);
    }
});
exports.execTx = execTx;
