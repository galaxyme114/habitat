<template>
  <div id="panels">
    <transition duration="0.25s" enter-class="right" enter-active-class="slide-forward-enter-active" enter-to-class="slide-forward-enter" leave-class="left" leave-active-class="slide-forward-leave-active" leave-to-class="slide-forward-leave">
      <div id="panel-1" class="panel" :class="{ active: active % 2 === 0 }" v-show="active % 2 === 0">
        <button @click="back(0)" v-if="show[0].length > 1">Back</button>
        <component :is="panel1" @forward="forward(1, $event)"/>
      </div>
    </transition>
    <transition duration="0.25s" enter-class="right" enter-active-class="slide-forward-enter-active" enter-to-class="slide-forward-enter" leave-class="left" leave-active-class="slide-forward-leave-active" leave-to-class="slide-forward-leave">
      <div id="panel-2" class="panel" :class="{ active: active % 2 === 1 }" v-show="active % 2 === 1">
        <button @click="back(1)">Back</button>
        <component :is="panel2" @forward="forward(0, $event)"/>
      </div>
    </transition>
  </div>
</template>
<script>
// NOTE This is a prototype for the sliding panels navigation
// TODO Get a horizontal slide animation working properly.
import Content1 from './panels/Content1'
import Content2 from './panels/Content2'
import Content3 from './panels/Content3'

export default {
  props: {
    type: {
      required: true
    }
  },
  components: {
    Content1,
    Content2,
    Content3
  },
  data () {
    return {
      active: 0,
      show: [
        [1],
        []
      ],
      transition: 'slide-forward'
    }
  },
  computed: {
    panel1 () {
      return this.show[0].length === 0 ? null : `content-${this.show[0][this.show[0].length - 1]}`
    },
    panel2 () {
      return this.show[1].length === 0 ? null : `content-${this.show[1][this.show[1].length - 1]}`
    }
  },
  methods: {
    reset () {
      this.show[0] = [1]
      this.show[1] = []
    },
    forward (index, content) {
      console.log(index, content)
      this.transition = 'slide-forward'
      this.show[index].push(content)
      this.active++
    },
    back (index) {
      this.transition = 'slide-back'
      this.active--
      setTimeout(() => {
        this.show[index].pop()
      }, 1000)
    }
  }
}
</script>
<style lang="scss">
  #panels {
    width: 100%;
    min-height: 360px;
    background-color: rgba(#efefef, 0.3);
    overflow: auto;
  }

  .panel {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;

    &.active {
      z-index: 1;
      transform: translate(0, 0);
    }

    .left,
    .right {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .left {
      transform: translate(-100%, 0);
    }

    .right {
      transform: translate(100%, 0);
    }

    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    li {
      margin: 0.25rem 0;
      padding: 0.25rem;
    }
  }

  // Slide transition
  .slide-forward-leave-active,
  .slide-forward-enter-active {
    transition: 1s;
  }
  .slide-forward-enter {
    transform: translate(100%, 0);
  }
  .slide-forward-leave-to {
    transform: translate(-100%, 0);
  }

  .slide-back-leave-active,
  .slide-back-enter-active {
    transition: 1s;
  }
  .slide-back-enter {
    transform: translate(-100%, 0);
  }
  .slide-back-leave-to {
    transform: translate(100%, 0);
  }
</style>
