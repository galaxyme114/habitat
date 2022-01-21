<template>
  <div id="content-3" class="content">
    <div class="title">Panel Content 3</div>
    <ul>
      <li @click="$emit('forward', 1)">Show 1</li>
      <li @click="$emit('forward', 2)">Show 2</li>
    </ul>
  </div>
</template>
