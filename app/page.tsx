// import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';



import { CashCowABI, ValueConductABI, CASHCOWADDR, VALUECONDUCTADDR } from "./txdata/contracts/storage-registry";
import {
  Abi,
  createPublicClient,
  encodeFunctionData,
  getContract,
  http,
} from "viem";
import { base } from "viem/chains";

import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import Link from "next/link";
import { currentURL } from "./utils";

import { DEFAULT_DEBUGGER_HUB_URL, createDebugUrl } from "./debug";
import { farcasterHubContext, openframes } from "frames.js/middleware";
import { getAddressesForFid } from "frames.js";

type State = {
  pageIndex: number;
};



const initialState: State = { pageIndex: 0 };

const reducer: FrameReducer<State> = (state, action) => {
  return {
    pageIndex: 0,
  };
};

// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const url = currentURL("/");
  const previousFrame = getPreviousFrame<State>(searchParams);

  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubHttpUrl: DEFAULT_DEBUGGER_HUB_URL,
    version: '0.0.1'
  });
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });



  const coinData = getContract({
    address: VALUECONDUCTADDR,
    abi: ValueConductABI,
    client: publicClient,
  });

  const userAddr: `0x${string}` = frameMessage?.requesterVerifiedAddresses[0] as `0x${string}`; /// maybe not?

  console.log(userAddr);

  const hasapproved = userAddr ?  await coinData.read.allowance([CASHCOWADDR, userAddr]) : 0; /// @todo check if user (how tf) has enough approved to switch buttons

  if (frameMessage?.transactionId) {
    return (
      <FrameContainer
        pathname="/"
        postUrl="/"
        
        state={state}
        previousFrame={previousFrame}

      >
        <FrameImage aspectRatio="1:1">
          <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
            Transaction submitted! {frameMessage.transactionId}
          </div>
        </FrameImage>
        <FrameButton
          action="link"
          target={`https://basescan.io/tx/${frameMessage.transactionId}`}
        >
          View on block explorer
        </FrameButton>
      </FrameContainer>
    );
  }

  // then, when done, return next frame
  return (
    <div>
      icoFrame - Value Conduct Coin{" "}
      

      <Link href={createDebugUrl(url)}>Debug</Link>
      <FrameContainer
        pathname="/"
        postUrl="/txdata"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage aspectRatio="1:1">
          <div tw="bg-purple-800 display: flex text-white w-full justify-center items-center">
            <p tw='row'>
            Buy a deal NFT for Value Conduct Coin.
            </p> 
          </div>
          <div tw="bg-purple-800 display: flex text-white w-full justify-center items-center">

          <p>Deal vests over 100 days, 10 day cliff.</p>
          </div>
          <div tw="bg-purple-800 display: flex text-white w-full justify-center items-center">

            <p>Price: 100 DEGEN per VCC. (maybe.. try and see don't remmebr).</p>
            </div>

            <div tw="bg-purple-800 display: flex text-white w-full justify-center items-center">

<p>First Approve. Then mint</p>
</div>
<div tw="bg-purple-800 display: flex text-white w-full justify-center items-center">
    <b>PAY ATTENTION TO WHAT YOU SIGN </b> <br> ||| </br><p>no promises. bugs guaranteed</p>
</div>

      <div className="buttons">

        { hasapproved < 100 ?         <FrameButton action="tx" target="/txdata/approve">
          Approve Cash Cow protocol to spend DEGEN
        </FrameButton>  :         <FrameButton action="tx" target="/txdata/mint">
          Mint the deal NFT
        </FrameButton> }
      </div>

        </FrameImage>


        <FrameButton action="tx" target="/examples/transaction/txdata">
          Approve Cash Cow protocol to spend DEGEN
        </FrameButton>

      </FrameContainer>
    </div>
  );
}
