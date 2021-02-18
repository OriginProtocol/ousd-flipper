<script>
    import Transaction from "./Transaction.svelte";
    import {
        maxFlip,
        flipperBalances,
        userBalances,
        txGasCost,
    } from "./stores.js";
    import { writable, derived, get } from "svelte/store";

    export let stableName;
    export let flipMethod;
    export let isOpen = false;

    const balance = flipperBalances["OUSD"];
    $: userBalance = userBalances[stableName];
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
    }

    async function afterBuy() {
        isOpen = false;
        amount = undefined;
    }

</script>

<div class="box">
    <img
        src="images/{stableName.toLowerCase()}-radio-on.svg"
        class="stableIcon"
        alt={stableName}
    />

    <p style="margin-top:4px">
        Buy <strong>OUSD</strong> for <strong>{stableName}</strong>
    </p>
    <p>
        {#if $available}
            <strong>{$available.toLocaleString("en")} OUSD</strong> available.
        {/if}
        No slippage. {#if $txGasCost}${$txGasCost}{:else}Low{/if} gas.
    </p>

    {#if parseInt($userBalance) > 1}
            <p>You have <strong> {parseInt($userBalance).toLocaleString("en")} 
            {stableName}</strong>.</p>
        {:else if parseInt($userBalance) < 20}
            <p>You don't have enough {stableName}.</p>
        {/if}

    {#if !isOpen}
        <div style="text-align: right;">
            <button on:click={clickOpen}>Get OUSD</button>
        </div>
    {:else}

        <table style="margin-left: auto; margin-right: 30px;">
            <tr>
                <td>Get</td>
                <td><input bind:value={amount} /> </td>
                <td><strong>OUSD</strong></td>
            </tr>
            <tr>
                <td>Pay</td>
                <td><input bind:value={amount} /> </td>
                <td><strong>{stableName}</strong></td>
            </tr>
        </table>
        <Transaction
            {flipMethod}
            approvalCoin={stableName}
            {amount}
            onComplete={afterBuy}
        />
    {/if}
</div>

<style>
    .box {
        padding-bottom: 4px;
        margin-right: 12px;
    }
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
