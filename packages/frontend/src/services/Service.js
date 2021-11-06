import axios from "axios";
import serviceConstant from "./constant";

const getSession = function (sessionId) {
  return axios.get(
    serviceConstant.RELAYER_URL + serviceConstant.SESSION + sessionId
  );
};

const getMerkleTree = function (sessionId) {
  return axios.get(
    serviceConstant.RELAYER_URL + serviceConstant.ZKPROOF + sessionId
  );
};

const postMerkleTree = function (sessionId, mTree) {
  return axios.post(
    serviceConstant.RELAYER_URL + serviceConstant.ZKPROOF + sessionId,
    { mTree }
  );
};

const relayVote = function (sessionId, voteData) {
  return axios.post(
    serviceConstant.RELAYER_URL + serviceConstant.RELAY + sessionId,
    voteData
  );
};

export default {
  getSession,
  getMerkleTree,
  postMerkleTree,
  relayVote,
};
