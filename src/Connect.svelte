<script>
    import { isConnected, connectWallet } from './stores.js';
</script>

<div style="width:150px;">
    {#if $isConnected}
        <button
            ><span style="font-size:8px; margin-right:4px">🟢</span> Connected</button
        >
    {:else}
        <button on:click={connectWallet}
            ><span style="font-size:8px">🔴</span> Connect Wallet</button
        >
    {/if}
</div>
