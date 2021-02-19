<script>
  import { apyData, txGasCost } from "./stores.js";
  import { get, derived } from "svelte/store";

  let daysToProfit = derived([txGasCost, apyData], (d) => {
    const amount = 5000
    const [_txGasCost, _apyData] = d
    if(_txGasCost == undefined || _apyData == undefined){
      return ""
    }
    const breakeven = _txGasCost / (_apyData.apr / 100 * 5000 / 365)
    return `${parseInt(breakeven)} days to profit on $${amount.toLocaleString("en")} at current gas prices`;
  });
</script>

<div style="height: 222px">
  {#if $apyData && $apyData.apy > 0}
    <table style="width:100%">
      <tr>
        {#each [...$apyData.daily].reverse() as day}
          <td class="barContainer"
            ><div style="height:{parseInt(day.apy) * 2}px" class="bar" /></td
          >
        {/each}
      </tr>
      <tr>
        {#each [...$apyData.daily].reverse() as day}
          <td style="text-align:center">&nbsp;{parseInt(day.apy + 0.5)}%</td>
        {/each}
      </tr>
    </table>
    <div style="font-size:56px; text-align:center">
      {parseInt($apyData.apy + 0.5)}% APY
    </div>
    <div style="text-align:center">Seven day average</div>
    <p style="text-align: center;"><i>{$daysToProfit}</i></p>
  {/if}
</div>

<style>
  .barContainer {
    position: relative;
    height: 80px;
    /* overflow-y: hidden; */
  }
  .bar {
    width: 100%;
    background: green;
    position: absolute;
    bottom: 0px;
  }
</style>
