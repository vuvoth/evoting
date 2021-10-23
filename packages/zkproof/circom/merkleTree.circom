pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/mimcsponge.circom";

template Hasher() {
    signal input left;
    signal input right;
    signal output result;

    component mimc = MiMCSponge(2, 220, 1);

    mimc.ins[0] <== left;
    mimc.ins[1] <== right;
    mimc.k <== 0;
    result <== mimc.outs[0];
}


template TicketHash() {
    signal input ticket;
    signal output result;
    component mimc = MiMCSponge(1, 220, 1);
    mimc.ins[0] <== ticket; 
    mimc.k <== 0; 
    result <== mimc.outs[0];

}



template VerifierMerkleTree(n) {
    signal input ticket; 
    signal input merkleProof[n];
    signal input order[n];
    signal output root;

    component ticketHash = TicketHash();
    ticketHash.ticket <== ticket;


    component hasher[n];
    signal tmpHash;

    signal left1[n];
    signal right1[n];

    signal left2[n];
    signal right2[n];
    signal merkleHash[n + 1];

    merkleHash[0] <== ticketHash.result;

    for (var i = 0; i < n; i++) {
        hasher[i] = Hasher();

        order[i]*(1 - order[i]) === 0;
        
        left1[i] <== order[i] * merkleHash[i];
        right1[i] <== (1 - order[i]) * merkleProof[i];
        hasher[i].left <==  left1[i] + right1[i];
        
        left2[i] <== (1 - order[i]) * merkleHash[i];
        right2[i] <== order[i] * merkleProof[i];
        hasher[i].right <== left2[i] + right2[i];

        merkleHash[i + 1] <== hasher[i].result;
    }

    root <== merkleHash[n];
}

component main = VerifierMerkleTree(1);


