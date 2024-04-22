import {
  AuthTakerProtocolUser,
  OrderExecutor,
  PayloadBestQuote,
  PayloadHgRequestQuote,
  TakerMethod,
  TakerProvider,
  WebsocketEvent,
} from "@hourglass/sdk";

const auth: AuthTakerProtocolUser = {
  source: "ION_PROTOCOL",
  secret: "a43f968870b4ee61139e2be26a14c298e74ee0659345455de0cbd3c2a42d8c77",
};
const serverUrl = "wss://api-origin-staging-v2.hourglass.com/taker";
const wstETHAddress = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0";
const weETHAddress = "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee";
const baseAmount = "2000000000000000000"; // 2 ETH

const takerProvider = new TakerProvider({ debug: true });
console.log(takerProvider);

takerProvider.connect({
  auth,
  serverUrl,
});

// sell weETH
// buy wstETH
takerProvider.on("connect", () => {
  takerProvider.requestQuote({
    executor: OrderExecutor.TAKER,
    baseAssetChainId: 1,
    quoteAssetChainId: 1,
    baseAssetAddress: weETHAddress,
    quoteAssetAddress: wstETHAddress,
    baseAmount: baseAmount,
  });
});

takerProvider.on(TakerMethod.hg_requestQuote, (data: PayloadHgRequestQuote | undefined, error) => {
  if (error) {
    console.error(`Error requesting quote: ${JSON.stringify(error, null, 2)}`);
    return;
  }
  // Call was successful, store details of created RFQ locally
});

takerProvider.on(WebsocketEvent.BestQuote, (data: PayloadBestQuote | undefined, error) => {
  if (error) {
    console.error(`Error receiving best quote: ${JSON.stringify(error, null, 2)}`);
    return;
  }
  // New best quote received, update local state
});

takerProvider.on("connect_error", (error) => {
  console.error(`Failed to connect to the server: ${error.message}`);
});
takerProvider.on("disconnect", (reason, description) => {
  console.log(`Disconnected from the server: ${reason}`);
});
