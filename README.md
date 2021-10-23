# Requirements 
- snarkjs 
- circom

# Circom compile
Compile cicrom file (only gen js)

```bash
circom multiplier2.circom --r1cs --wasm --sym  
```
# Trusted setup (Init CRS)

Power of tau
```bash
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
# snarkjs powersoftau contribute pot12_0000.ptau pot12_final.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 pot12_0000.ptau pot12_final.ptau -v
```

Trusted setup with Groth16 

```bash
snarkjs groth16 setup multiplier2.r1cs pot12_final.ptau multiplier2_0000.zkey
snarkjs zkey contribute multiplier2_0000.zkey multiplier2_final.zkey --name="1st Contributor Name" -v
```

Export verifier key and prover key

```bash
snarkjs zkey export verificationkey multiplier2_final.zkey verification_key.json
```

# Compute witness and proof

Move to multiplier2_js folder. Create input.json file with a input signals. 

Example 
```json
{
    "in1": 3,
    "in2": 4
}
```

Gen witness

```bash
node generate_witness.js multiplier2.wasm input.json witness.wtns
```

Gen proof

```bash
snarkjs groth16 prove multiplier2_final.zkey witness.wtns proof.json public.json
```
# Verify the proof 

Verify proof

```bash
snarkjs groth16 verify verification_key.json public.json proof.json     
```

Gen solidity verifier code 

```bash
snarkjs zkey export solidityverifier multiplier2_final.zkey verifier.sol
```

Export proof parameters 

```bash
snarkjs generatecall
```

