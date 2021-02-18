<script>
    import {
        isConnected,
        connectWallet,
        setApproval,
        userAllowances,
        flip,
    } from "./stores.js";

    export let approvalCoin;
    export let flipMethod;
    export let amount = undefined;
    export let onComplete = function () {};

    $: allowance = userAllowances[approvalCoin];
    // $: hasAllowance = $allowance > amount

    if (approvalCoin === undefined) {
        throw "No Approval stablecoin set";
    }

    async function approve() {
        await setApproval(approvalCoin);
    }

    async function buy() {
        await flip(flipMethod, amount);
        await onComplete();
    }

    // if(amount.remove){

    // }

    // Validate amount
    // Ensure connect
    // Ensure allowance
    // Ensure signature
    // Ensure submit
    // Ensure confirm
</script>

<div>
    <ul>
        {#if ! $isConnected}
            <li>1. <button on:click={connectWallet}>🔴 Connect Wallet</button></li>
        {:else}
            <li>1. <span class="i">☑︎</span> Connect Wallet - <i>Done</i></li>

            {#if parseInt($allowance) > parseInt(amount) || parseInt($allowance) > 1}
                <li>2. <span class="i">☑︎</span> {approvalCoin} Allowance Set - <i>Done</i></li>
            {:else}
                <li>
                    <button on:click={approve}
                        >2. 🔴 Approve {approvalCoin} Transfer</button>
                </li>
            {/if}
            {#if parseInt($allowance) > parseInt(amount) && $isConnected}
                <li>3. <button on:click={buy}>Buy!</button></li>
            {:else}
                <li>3. Must be connected and have approval before purchase.</li>
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
</style>
