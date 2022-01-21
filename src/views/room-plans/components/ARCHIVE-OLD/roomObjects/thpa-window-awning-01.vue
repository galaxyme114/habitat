<template>

<!-- ORIGINAL -->
  <!-- <g id='window-awning">
    <rect id="window-outer" x="16.5" y="42.49" fill="#FFFFFF" stroke="#454950" stroke-linecap="round" stroke-linejoin="round" width="70" height="8"/>
  <g id="window-core-guide">
    <g>
        <line fill="none" stroke="#454950" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" x1="16.5" y1="50.51" x2="16.5" y2="51.51"/>
        <line fill="none" stroke="#454950" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1.6,1.6" x1="16.5" y1="53.11" x2="16.5" y2="58.71"/>
      <polyline fill="none" stroke="#454950" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" points="16.5,59.51
        16.5,60.51 17.5,60.51       "/>
        <line fill="none" stroke="#454950" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1.9429,1.9429" x1="19.44" y1="60.51" x2="84.53" y2="60.51"/>
      <polyline fill="none" stroke="#454950" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" points="85.5,60.51
        86.5,60.51 86.5,59.51       "/>
        <line fill="none" stroke="#454950" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1.6,1.6" x1="86.5" y1="57.91" x2="86.5" y2="52.31"/>
        <line fill="none" stroke="#454950" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" x1="86.5" y1="51.51" x2="86.5" y2="50.51"/>
    </g>
  </g>
  <line id="window-core" fill="none" stroke="#454950" x1="86.5" y1="45.49" x2="16.5" y2="45.49"/>
  <line id="window-core_1_" fill="none" stroke="#454950" x1="86.5" y1="47.49" x2="16.5" y2="47.49"/>
</g> -->

<!-- ORIGINAL TRANSLATED TO VUE -->
 <v-group>
    <v-rect :config="{x: 16.5, y: 42.49, fill: '#FFFFFF', stroke: '#454950', lineCap: 'round', lineJoin: 'round', width: 70, height: 8}"/>
    <v-group>
      <v-group>
        <v-line :config="{ stroke: '#454950', strokeWidth: 0.5, lineCap: 'round', lineJoin: 'round', points: [16.5, 50.51, 16.5, 51.51]}"/>
        <v-line :config="{ stroke: '#454950', strokeWidth: 0.5, lineCap: 'round', lineJoin: 'round', dash: [1.6, 1.6], points: [16.5, 53.11, 16.5, 58.71]}"/>
        <v-line :config="{ stroke: '#454950', strokeWidth: 0.5, lineCap: 'round', lineJoin: 'round', points: [16.5,59.51, 16.5,60.51, 17.5,60.51]}"/>
        <v-line :config="{ stroke: '#454950', strokeWidth: 0.5, lineCap: 'round', lineJoin: 'round', dash: [1.9429,1.9429], points: [19.44, 60.51, 84.53, 60.51]}"/>
        <v-line :config="{ stroke: '#454950', strokeWidth: 0.5, lineCap: 'round', lineJoin: 'round', points: [85.5,60.51,86.5,60.51,86.5,59.51]}"/>
        <v-line :config="{ stroke: '#454950', strokeWidth: 0.5, lineCap: 'round', lineJoin: 'round', dash: [1.6,1.6], points: [86.5, 57.91, 86.5, 52.31]}"/>
        <v-line :config="{ stroke: '#454950', strokeWidth: 0.5, lineCap: 'round', lineJoin: 'round', points: [86.5, 51.51, 86.5, 50.51]}"/>
    </v-group>
  </v-group>
  <v-line :config="{ stroke: '#454950', points: [86.5, 45.49, 16.5, 45.49]}"/>
  <v-line :config="{ stroke: '#454950', points: [86.5, 47.49, 16.5, 47.49]}"/>
</v-group>
</template>
<script>

export default {
  components: {
  },
  props: {
    element: {
      required: true
    }
  }
}
</script>
