<script>
  import { get } from "svelte/store";
  import Spinner from "./Spinner.svelte";

  import {
    isConnected,
    connectWallet,
    setApproval,
    userAllowances,
    flipperBalances,
    userBalances,
    flip,
  } from "./stores.js";

  export let approvalCoin;
  export let flipMethod;
  export let amount = undefined;
  export let to = undefined;
  export let onComplete = function () {};

  $: allowance = userAllowances[approvalCoin];
  let userBalance = userBalances[approvalCoin];
  let flipperBalance = flipperBalances[to];
  let isLoadingApproval = false;
  let isLoadingFlip = false;

  $: amountUnderMax = parseInt(amount) <= 25000;
  $: amountOverMin = parseInt(amount) >= 1;
  $: amountUnderFlipper = parseInt(amount) <= get(flipperBalance);
  $: userHas = parseInt(amount) <= parseInt(get(userBalances[approvalCoin]));

  console.log($userBalance);

  if (approvalCoin === undefined) {
    throw "No Approval stablecoin set";
  }

  async function approve() {
    const tx = await setApproval(approvalCoin);
    isLoadingApproval = true;
    await tx.waitForTransaction();
  }

  async function buy() {
    const tx = await flip(flipMethod, amount);
    isLoadingFlip = true;
    await tx.waitForTransaction();
    setTimeout(() => {
      isLoadingFlip = false;
    }, 500);
    await onComplete();
  }
</script>

<div>
  {#if $isConnected && amountOverMin}
    {#if !userHas}
      <p class="error">
        You don't have <strong>{amount} {approvalCoin}</strong> to trade.
      </p>
    {/if}
    {#if !amountUnderMax}
      <p class="error">There is a maximum trading amount of $25,000.</p>
    {/if}
    {#if !amountUnderFlipper}
      <p class="error">Swap does not have enough to trade this amount.</p>
    {/if}
  {/if}
  <ul>
    {#if !$isConnected}
      <li>
        1. <button on:click={connectWallet}>🔴 Connect Wallet</button>
      </li>
    {:else}
      <li>1. <span class="i">☑︎</span> Connect Wallet - <i>Done</i></li>

      {#if parseInt($allowance) > parseInt(amount) || parseInt($allowance) > 1}
        <li>
          2. <span class="i">☑︎</span>
          {approvalCoin} Allowance Set - <i>Done</i>
        </li>
      {:else}
        <li>
          <button on:click={approve}
            >2.
            {#if isLoadingApproval}
              <Spinner /> Approving...
            {:else}
              🔴 Approve {approvalCoin} Transfer
            {/if}
          </button>
        </li>
      {/if}
      {#if !(parseInt($allowance) > parseInt(amount)) || !$isConnected}
        <li>3. Must be connected and have approval before purchase.</li>
      {:else if !amountUnderMax || !amountOverMin || !userHas}
        <li>3. <button disabled>Swap!</button></li>
      {:else}
        <li>
          3.
          {#if isLoadingFlip}
            <button on:click={buy}><Spinner /> Swappping...</button>
          {:else}
            <button on:click={buy}>Swap!</button>
          {/if}
        </li>
      {/if}
    {/if}
  </ul>
</div>

<style>
  li {
    list-style: none;
    margin-bottom: 8px;
  }
  .i {
    position: relative;
    bottom: -2px;
    font-size: 24px;
  }
  .error {
    color: red;
  }
</style>
