pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/mimcsponge.circom";


template Hasher() {
    signal input value;
    signal output result;

    component mimc = MiMCSponge(1, 220, 1);

    mimc.ins[0] <== value;
    mimc.k <== 0;
    result <== mimc.outs[0];
}

component main = Hasher();