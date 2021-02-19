<script>
  import Transaction from "./Transaction.svelte";
  import {
    maxFlip,
    flipperBalances,
    userBalances,
    txGasCost,
    isConnected,
  } from "./stores.js";
  import { writable, derived, get } from "svelte/store";

  export let from;
  export let to;
  let notOusd = from != "OUSD" ? from : to;
  export let flipMethod;
  export let isOpen = false;

  const balance = flipperBalances[to];
  $: userBalance = userBalances[from];
  let available = derived(balance, (b) => {
    if (b === undefined) {
      return undefined;
    }
    let balance = parseInt(b);
    if (balance > maxFlip) {
      return parseInt(maxFlip);
    }
    return balance;
  });
  let amount = 1000;

  function clickOpen() {
    isOpen = true;
    if ($isConnected) {
      amount = Math.min(
        parseInt(get(userBalance)),
        parseInt(get(balance)),
        25000
      );
    } else {
      amount = 1000;
    }
  }

  async function afterBuy() {
    isOpen = false;
    amount = undefined;
  }
</script>

<div class="box">
  <img
    src="images/{notOusd.toLowerCase()}-radio-on.svg"
    class="stableIcon"
    alt={notOusd}
  />

  <p style="margin-top:4px">
    Get <strong>{to}</strong> from <strong>{from}</strong>
  </p>
  <p>
    {#if $available}
      <strong>{$available.toLocaleString("en")} {to}</strong> available.
    {/if}
    No slippage. {#if $txGasCost}${$txGasCost}{:else}Low{/if} gas.
  </p>

  {#if parseInt($userBalance) > 1}
    <p>
      You have <strong>
        {parseInt($userBalance).toLocaleString("en")}
        {from}</strong
      >.
    </p>
  {:else if parseInt($userBalance) < 20}
    <p>You don't have enough {from}.</p>
  {/if}

  {#if !isOpen}
    <div style="text-align: right;">
      <button on:click={clickOpen}>Get {to}</button>
    </div>
  {:else}
    <table style="margin-left: auto; margin-right: 30px;">
      <tr>
        <td>Get</td>
        <td><input bind:value={amount} /> </td>
        <td><strong>{to}</strong></td>
      </tr>
      <tr>
        <td>Pay</td>
        <td><input bind:value={amount} /> </td>
        <td><strong>{from}</strong></td>
      </tr>
    </table>
    <Transaction
      {flipMethod}
      approvalCoin={from}
      {amount}
      onComplete={afterBuy}
      {to}
    />
  {/if}
</div>

<style>
  p {
    padding-left: 74px;
  }
  hr {
    border: 1px solid #eee;
  }
  .stableIcon {
    width: 64px;
    height: 64px;
    float: left;
  }
  input {
    width: 100px;
  }
</style>
