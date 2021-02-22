<script>
  import { apyData, txGasCost } from "./stores.js";
  import { get, derived } from "svelte/store";

</script>

<div style="height: 194px">
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
          <td style="text-align:center" class="smaller-mobile">&nbsp;{parseInt(day.apy + 0.5)}%</td>
        {/each}
      </tr>
    </table>
    <div style="font-size:56px; text-align:center">
      {parseInt($apyData.apy + 0.5)}% APY
    </div>
    <div style="text-align:center">Seven day average</div>
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
