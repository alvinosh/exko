<script lang="ts">
  export let name: string = "Earth";

  export let x: number = 10;
  export let y: number = 10;

  export let visible: boolean = false;
</script>

{#if visible}
  <button
    style:top={y + "px"}
    style:left={x + "px"}
    class="bg-gray-500 text-[10px] text-white p-1 font-bold rounded w-auto"
  >
    {name}
  </button>
{/if}

<style>
  button {
    position: fixed;
  }
</style>
