<script>
	import BuyBox from './BuyBox.svelte';
	import Connect from './Connect.svelte';
	import {
        ousdBalance,
    } from "./stores.js";

	let oldOusdBalance = undefined
	let ousdBalanceClass = "static"
	ousdBalance.subscribe((x)=>{
		if(oldOusdBalance == undefined || x == oldOusdBalance){
			oldOusdBalance = x
			return
		}
		
		ousdBalanceClass = "changed"
		setTimeout(function(){
			ousdBalanceClass = "static"
		}, 1000)
		window.scroll(0,0)
		
		oldOusdBalance = x
	})
	
</script>

<main>
	<h1>OUSD</h1>

	<div style="text-align:right">
		<Connect/>
	</div>
	

	<hr>

	<div class="outerBox">
		<div class="box">APY History</div>
	</div>
	<div class="outerBox">
		<div class="box {ousdBalanceClass}">
			{#if $ousdBalance}
				<div style="font-size:56px; text-align:center">{parseInt($ousdBalance).toLocaleString("en")} OUSD</div>
				<div style="text-align:center">Your Balance</div>
			{:else}
				...
			{/if}
		</div>
	</div>

	<div class="outerBox">
		<BuyBox stableName="DAI"  flipMethod="buyOusdWithDai"/>
		<BuyBox stableName="USDC" flipMethod="buyOusdWithUsdc"  />
		<BuyBox stableName="USDT" flipMethod="buyOusdWithUsdt"/>
	</div>

	<div class="outerBox">
		<div class="box">Sell OUSD for DAI</div>
		<div class="box">Sell OUSD for USDC</div>
		<div class="box">Sell OUSD for USDT</div>
	</div>




</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	.box.static {
		background-color: rgb(255, 255, 255);
		transition: all 3s ease;
  		-webkit-transition: all 3s ease;
	}

	.box.changed {
		background-color: rgb(240, 253, 116);
	}
	

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>