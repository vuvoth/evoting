import * as snarkjs from "snarkjs/build/main.cjs";
import offchain from "@evoting/offchain";

const wasmURL = "http://localhost:4040/merkleTree.wasm";
const zkeyURL = "http://localhost:4040/merkle_final.zkey";

// create proof for ticket return data for relayer;
const createProof = async (ticket, candidateId, mTree) => {
  console.log(snarkjs);
  const secretInput = offchain.createMerkleProof(ticket, offchain.toBNs(mTree));
  secretInput.data["candidate"] = candidateId.toString();
  console.log(secretInput.data);
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    secretInput.data,
    wasmURL,
    zkeyURL
  );

  return { proof, publicSignals };
};

export default createProof;
