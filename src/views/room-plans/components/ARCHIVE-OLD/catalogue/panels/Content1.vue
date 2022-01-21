<template>
  <div id="content-1" class="content">
    <div class="title">Panel Content 1</div>
    <ul>
      <li @click="$emit('forward', 2)">Show 2</li>
      <li @click="$emit('forward', 3)">Show 3</li>
    </ul>
  </div>
</template>
