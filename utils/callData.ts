import { CallData, uint256 } from "starknet";

export function boostClaimCall(boost: Boost, sign: Signature) {
  const finalAmount =
    (boost.amount / boost.num_of_winners) * Math.pow(10, boost.token_decimals);
  const amount = uint256.bnToUint256(finalAmount);
  const claimCallData = CallData.compile({
    amount: amount,
    token: boost.token,
    boost_id: boost.id,
    signature: sign,
  });

  return {
    contractAddress: process.env.NEXT_PUBLIC_QUEST_BOOST_CONTRACT ?? "",
    entrypoint: "claim",
    calldata: claimCallData,
  };
}
