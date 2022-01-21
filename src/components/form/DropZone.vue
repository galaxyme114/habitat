<template>
  <vue-dropzone
    :id="id"
    :options="useCustomDropzoneOptions ? dropzoneOptions : options"
    :includeStyling="includeStyling"
    :destroyDropzone="destroyDropzone"
    :duplicateCheck="duplicateCheck"
    :useCustomSlot="useCustomSlot"
    v-on:vdropzone-sending="sendingEvent"
    v-on:vdropzone-success="onSuccess"
  ></vue-dropzone>
</template>
<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import { mapState } from 'vuex'

export default {
  name: 'dropzone',
  props: {
    id: {
      type: String,
      required: true
    },
    moodboardId: {
      type: String,
      default: null
    },
    includeStyling: {
      type: Boolean,
      default: true
    },
    destroyDropzone: {
      type: Boolean,
      default: true
    },
    duplicateCheck: {
      type: Boolean,
      default: false
    },
    useCustomSlot: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      required: true
    },
    method: {
      type: String,
      default: 'POST'
    },
    clickable: {
      type: Boolean,
      default: true
    },
    paramName: {
      type: String,
      default: 'file'
    },
    acceptedFileTypes: {
      type: String
    },
    thumbnailHeight: {
      type: Number
    },
    thumbnailWidth: {
      type: Number,
      default: 150
    },
    showRemoveLink: {
      type: Boolean,
      default: true
    },
    maxFileSizeInMB: {
      type: Number,
      default: 20
    },
    maxNumberOfFiles: {
      type: Number,
      default: 50
    },
    autoProcessQueue: {
      type: Boolean,
      default: true
    },
    headers: {
      type: Object
    },
    language: {
      type: Object,
      default: function () {
        return {
          dictDefaultMessage: 'Drop files here or click to select',
          dictCancelUpload: 'Cancel upload',
          dictCancelUploadConfirmation: 'Are you sure you want to cancel this upload?',
          dictFallbackMessage: 'Your browser does not support drag and drop file uploads.',
          dictFallbackText: 'Please use the fallback form below to upload your files like in the olden days.',
          dictFileTooBig: 'File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.',
          dictInvalidFileType: "You can't upload files of this type.",
          dictMaxFilesExceeded: 'You can not upload any more files. (max: {{maxFiles}})',
          dictRemoveFile: 'Remove',
          dictRemoveFileConfirmation: null,
          dictResponseError: 'Server responded with {{statusCode}} code.'
        }
      }
    },
    dropzoneOptions: {
      type: Object
    },
    useCustomDropzoneOptions: {
      type: Boolean,
      default: false
    }
  },
  components: {
    vueDropzone: vue2Dropzone
  },
  data () {
    return {
      options: {
        url: this.url,
        headers: this.headers,
        method: this.method,
        clickable: this.clickable,
        paramName: this.paramName,
        thumbnailWidth: this.thumbnailWidth,
        thumbnailHeight: this.thumbnailHeight,
        maxFiles: this.maxNumberOfFiles,
        maxFilesize: this.maxFileSizeInMB,
        addRemoveLinks: this.showRemoveLink,
        acceptedFiles: this.acceptedFileTypes,
        autoProcessQueue: this.autoProcessQueue,
        timeout: 600000,
        dictDefaultMessage:
          '<div class="upload-message"><svg viewBox="0 0 30 30" width="30" height="30" style="width: 30px; height: 30px; margin-right: 10px"><g transform="scale(1.25,1.25)"><path d="M0.750 0.750 L15.750 0.750 L15.750 17.250 L0.750 17.250 Z" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M15.75 12.75L0.75 12.75" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M18.755,6.231l3.982,1.327a.75.75,0,0,1,.474.949l-4.743,14.23a.75.75,0,0,1-.949.474L6.755,19.623" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M5.25,12.75,9.4,6.818A1.5,1.5,0,0,1,11.76,6.69l3.99,4.56" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path d="M3.375 5.063 A1.688 1.688 0 1 0 6.751 5.063 A1.688 1.688 0 1 0 3.375 5.063 Z" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g></svg>' +
          this.language.dictDefaultMessage +
          '</div>',
        dictCancelUpload: this.language.dictCancelUpload,
        dictCancelUploadConfirmation: this.language.dictCancelUploadConfirmation,
        dictFallbackMessage: this.language.dictFallbackMessage,
        dictFallbackText: this.language.dictFallbackText,
        dictFileTooBig: this.language.dictFileTooBig,
        dictInvalidFileType: this.language.dictInvalidFileType,
        dictMaxFilesExceeded: this.language.dictMaxFilesExceeded,
        dictRemoveFile: this.language.dictRemoveFile,
        dictRemoveFileConfirmation: this.language.dictRemoveFileConfirmation,
        dictResponseError: this.language.dictResponseError
      }
    }
  },
  computed: {
    ...mapState({
      userId: (state) => state.auth.user.id
    })
  },
  methods: {
    sendingEvent (file, xhr, formData) {
      formData.append('userId', this.userId)
      if (this.moodboardId) {
        formData.append('moodboardId', this.moodboardId)
      }
    },
    onSuccess (file, response) {
      console.log('success')
      console.log(file, response)
      this.$emit('success', response)
    }
  },
  mounted () {
    if (this.useCustomDropzoneOptions) {
      this.options = this.dropzoneOptions
    }
  }
}
</script>
