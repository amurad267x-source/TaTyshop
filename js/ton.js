import { TonConnect } from "@tonconnect/sdk";

const ton = new TonConnect();

async function pay(amount){
  const tx = await ton.sendTransaction({
    validUntil: Math.floor(Date.now()/1000)+600,
    messages: [{
      address: "TON_ADDRESS",
      amount: amount*1e9
    }]
  });

  await fetch("/functions/verify-ton",{
    method:"POST",
    body:JSON.stringify({tx:tx.boc})
  });
}