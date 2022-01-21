<template>
  <div style="position:relative">
    <slot />

    <div
      ref="autocomplete"
      v-show="filtereditems.length > 0 && isOpen"
      class="autocomplete-panel"
      :style="{top: `${coords.top + coords.height}px`}"
    >
      <div class="autocomplete-source">
        <ul class="autocomplete-items">
          <li
            v-for="(item, index) of filtereditems"
            :key="index"
            @click="applyMention(index)"
          >
            <div class="autocomplete-item">
              <div class="account-body">
                <div class="account-avatar">
                  <b-avatar v-if="item.image" variant="secondary" :src="item.image" size="2.5rem"></b-avatar>
                  <b-avatar v-else variant="secondary" :text="item.avatarText" size="2.5rem"></b-avatar>
                </div>
                <div class="account-detail">
                  <div class="account-name">
                      {{ item.label }}
                  </div>
                  <div class="account-handle">
                      {{ item.searchText }}
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import getCaretCoordinates from 'textarea-caret'
import { BAvatar } from 'bootstrap-vue'
const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : ''
const isIe = userAgent.indexOf('MSIE ') !== -1 || userAgent.indexOf('Trident/') !== -1

export default {
  name: 'Mentionable',
  components: {
    BAvatar
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      key: null,
      oldKey: null,
      keys: ['@'],
      coords: {
        top: 0,
        height: 0
      },
      isOpen: false,
      searchText: '',
      insertSpace: true
    }
  },
  computed: {
    filtereditems () {
      if (!this.searchText) {
        return this.items
      }

      const searchText = this.searchText.toLowerCase()
      return this.items.filter(item => {
        /** @type {string} */
        let text
        if (item.searchText) {
          text = item.searchText
        } else if (item.label) {
          text = item.label
        } else {
          text = ''
          for (const key in item) {
            text += item[key]
          }
        }
        return text.toLowerCase().includes(searchText)
      })
    }
  },
  mounted () {
    this.input = this.getInput()
    this.attach()
  },
  updated () {
    const input = this.getInput()
    if (input !== this.input) {
      this.detach()
      this.input = input
      this.attach()
    }
  },
  beforeDestroy () {
    this.detach()
  },
  methods: {
    getInput () {
      const [vnode] = this.$scopedSlots.default()
      if (vnode) {
        if (vnode.elm.tagName === 'INPUT' || vnode.elm.tagName === 'TEXTAREA' || vnode.elm.isContentEditable) {
          return vnode.elm
        } else {
          return vnode.elm.querySelector('input') || vnode.elm.querySelector('textarea') || vnode.elm.querySelector('[contenteditable="true"]')
        }
      }
      return null
    },
    attach () {
      if (this.input) {
        this.input.addEventListener('input', this.onInput)
        this.input.addEventListener('keydown', this.onKeyDown)
        this.input.addEventListener('keyup', this.onKeyUp)
        this.input.addEventListener('scroll', this.onScroll)
        this.input.addEventListener('blur', this.onBlur)
      }
    },
    detach () {
      if (this.input) {
        this.input.removeEventListener('input', this.onInput)
        this.input.removeEventListener('keydown', this.onKeyDown)
        this.input.removeEventListener('keyup', this.onKeyUp)
        this.input.removeEventListener('scroll', this.onScroll)
        this.input.removeEventListener('blur', this.onBlur)
      }
    },
    onInput () {
      this.checkKey()
    },
    // onBlur () {
    //   this.closeMenu()
    // },
    onScroll () {
      this.updateCaretPosition()
    },
    onKeyDown (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        this.closeMenu()
        this.cancelEvent(e)
      }
    },
    onKeyUp (e) {
      if (this.cancelKeyUp && (e.key === this.cancelKeyUp || e.keyCode === this.cancelKeyCode)) {
        this.cancelEvent(e)
      }
      this.cancelKeyUp = null
      // IE
      this.cancelKeyCode = null
    },

    cancelEvent (e) {
      e.preventDefault()
      e.stopPropagation()
      this.cancelKeyUp = e.key
      // IE
      this.cancelKeyCode = e.keyCode
    },
    checkKey () {
      const index = this.getSelectionStart()
      if (index >= 0) {
        const { key, keyIndex } = this.getLastKeyBeforeCaret(index)
        const searchText = this.lastSearchText = this.getLastSearchText(index, keyIndex)
        if (!(keyIndex < 1 || /\s/.test(this.getValue()[keyIndex - 1]))) {
          return false
        }
        if (searchText) {
          this.openMenu(key, keyIndex)
          this.searchText = searchText
          return true
        }
      }
      this.closeMenu()
      return false
    },
    getValue () {
      return this.input.isContentEditable ? window.getSelection().anchorNode.textContent : this.input.value
    },
    setValue (value) {
      this.input.value = value
      this.emitInputEvent('input')
    },
    emitInputEvent (type) {
      let event
      if (isIe) {
        event = document.createEvent('Event')
        event.initEvent(type, true, true)
      } else {
        event = new Event(type)
      }
      this.input.dispatchEvent(event)
    },
    getSelectionStart () {
      return this.input.isContentEditable ? window.getSelection().anchorOffset : this.input.selectionStart
    },
    getLastKeyBeforeCaret (caretIndex) {
      const [keyData] = this.keys.map(key => ({
        key,
        keyIndex: this.getValue().lastIndexOf(key, caretIndex - 1)
      })).sort((a, b) => b.keyIndex - a.keyIndex)
      return keyData
    },
    getLastSearchText (caretIndex, keyIndex) {
      if (keyIndex !== -1) {
        const searchText = this.getValue().substring(keyIndex + 1, caretIndex)
        // If there is a space we close the menu
        if (!/\s/.test(searchText)) {
          return searchText
        }
      }
      return null
    },
    updateCaretPosition () {
      if (this.key) {
        if (this.input.isContentEditable) {
          const rect = window.getSelection().getRangeAt(0).getBoundingClientRect()
          const inputRect = this.input.getBoundingClientRect()
          this.coords = {
            top: rect.top - inputRect.top,
            height: rect.height
          }
        } else {
          this.coords = this.input
            ? getCaretCoordinates(this.input, this.input?.selectionEnd)
            : { top: 0, height: 0 }
        }
      }
    },
    openMenu (key, keyIndex) {
      if (this.key !== key) {
        this.key = key
        this.keyIndex = keyIndex
        this.updateCaretPosition()
        this.isOpen = true
      }
    },
    closeMenu () {
      if (this.key != null) {
        this.oldKey = this.key
        this.key = null
        this.isOpen = false
      }
    },
    setCaretPosition (index) {
      this.$nextTick(() => {
        this.input.selectionEnd = index
      })
    },
    applyMention (itemIndex) {
      const item = this.filtereditems[itemIndex]
      const value = '@' + item.value + (this.insertSpace ? ' ' : '')
      if (this.input.isContentEditable) {
        const range = window.getSelection().getRangeAt(0)
        range.setStart(range.startContainer, range.startOffset - this.key.length - (this.lastSearchText ? this.lastSearchText.length : 0))
        range.deleteContents()
        range.insertNode(document.createTextNode(value))
        range.setStart(range.endContainer, range.endOffset)
        this.emitInputEvent('input')
      } else {
        this.setValue(this.replaceText(this.getValue(), this.searchText, value, this.keyIndex))
        this.setCaretPosition(this.keyIndex + value.length)
      }
      this.$emit('apply', item, this.key, value)
      this.closeMenu()
    },

    replaceText (text, searchText, newText, index) {
      return text.slice(0, index) + newText + text.slice(index + searchText.length + 1, text.length)
    }
  }
}
</script>

<style scoped>
  .autocomplete-panel {
    position: absolute;
    left: 0px;
    width: 100%;
    max-width: 20rem;
    border-radius: 0.5rem;
    z-index: 1;
    background-color: #fff;
   -webkit-box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    -moz-box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  }
  .autocomplete-source {
    margin-top: 0.5rem;
    width: 100%;
    overflow: hidden;
    border-radius: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .autocomplete-items {
    height: 100%;
    max-height: 14rem;
    overflow-y: auto;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .autocomplete-item {
    display: flex;
    cursor: pointer;
    flex-direction: column;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .autocomplete-item:hover {
    background-color: #EEEEEE;
    color: currentColor;
  }
  .account-body {
    display: flex;
    align-items: center;
  }
  .account-name {
    font-weight: 600;
    color: #5C5C5C;
  }
  .account-highlighted {
    border-radius: 0.125rem;
    background-color: rgba(55, 65, 81, 1);
    color: currentColor;
  }
  .account-avatar {
    height: 2.5rem;
    width: 2.5rem;
    flex: none;
    border-radius: 9999px;
    background-color: rgba(255, 255, 255, 1);
    overflow: hidden;
  }
  .account-avatar img {
    width: 100%;
    height: auto;
    transform: scale(1.2) translateY(-0.2rem);
  }
  .account-handle {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: rgba(107, 114, 128, 1);
  }
  .account-detail {
    margin-left: .7rem;
  }
</style>
