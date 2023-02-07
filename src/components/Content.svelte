<script lang="ts">
  export let title = "";
  export let id = "";
</script>

<div {id} class="flex h-screen w-full flex-row flex-nowrap ">
  <div class="flex-grow font-mono text-9xl text-gray-200">
    {title}
  </div>

  <div class="m-4 flex  w-4/12 flex-col gap-6 rounded-3xl bg-gray-900 p-8">
    <slot />
  </div>
</div>

<style>
</style>
