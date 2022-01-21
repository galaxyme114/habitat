<template>
  <div id="content-2" class="content">
    <div class="title">Panel Content 2</div>
    <ul>
      <li @click="$emit('forward', 1)">Show 1</li>
      <li @click="$emit('forward', 3)">Show 3</li>
    </ul>
  </div>
</template>
