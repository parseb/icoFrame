import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";


import {
  Abi,
  createPublicClient,
  encodeFunctionData,
  getContract,
  http,
} from "viem";
import { base } from "viem/chains";
import { CashCowABI, ValueConductABI, CASHCOWADDR, VALUECONDUCTADDR } from "./contracts/storage-registry";

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  const json = await req.json();

  const tType = json.includes('approve') ? 1 : 2;

  const frameMessage = await getFrameMessage(json);

  if (!frameMessage) {
    throw new Error("No frame message");
  }

  (tType == 1)  ? console.log("Approving...") : console.log("Minting...");

  // Get current storage price
  const units = 1n;

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const coinData = getContract({
    address: VALUECONDUCTADDR,
    abi: ValueConductABI,
    client: publicClient,
  });

  

  const cowData = getContract({
    address: CASHCOWADDR,
    abi: CashCowABI,
    client: publicClient,
  });

  const nextDealID = await cowData.read.tempId(); 


  const calldata = tType == 1 ? encodeFunctionData({
    abi: ValueConductABI,
    functionName: "approve",
    args: [VALUECONDUCTADDR,BigInt("100000000000000000000")],
  }) : encodeFunctionData({
    abi: CashCowABI,
    functionName: "takeDeal",
    args: [nextDealID],
  })



  // const unitPrice = await coinData.read.allowance(userAddress, CASHCOWADDR); /// @todo check if user (how tf) has enough approved to switch buttons

  return tType == 2 ? NextResponse.json({
    chainId: "eip155:8453", 
    method: "eth_sendTransaction",
    params: {
      abi: CashCowABI as Abi,
      to: CASHCOWADDR,
      data: calldata,
      value: "0",
    },
  }) : NextResponse.json({
    chainId: "eip155:8453", 
    method: "eth_sendTransaction",
    params: {
      abi: ValueConductABI as Abi,
      to: VALUECONDUCTADDR,
      data: calldata,
      value: "0",
    },
  })




  

}
