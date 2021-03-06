<template>
  <div class="image-upload">
    <img class="image-upload--preview" :class="{ 'upload-complete': uploadComplete }" :src="URL">
    <div class="image-upload--progress" v-if="progress" :style="progressStyle">
      <img :class="{ 'loading-thumbnails': generatingThumbs }" :src="URL">
    </div>
  </div>
</template>


<script>
  import Image from '@/models/Image';
  import bus from '@/config/bus';
  import { database } from '@/config/firebase';

  export default {
    data() {
      return {
        progress: 0,
        URL: null,
        generatingThumbs: false,
      }
    },

    props: {
      image: Object,
    },

    mounted() {
      // Upload image if it is a file
      this.URL = this.image.url();
      const upload = this.image.put();
      upload.on('state_changed', this.onUploadProgress);
      upload.then(snapshot => {
        this.image.file = null;
        this.generatingThumbs = true;
        this.image.downloadURL = snapshot.downloadURL;
        bus.$emit('add-image', this.image);
        database.ref(`/images/gallery`).on('child_added', (snapshot) => {
          if (snapshot.key !== this.image.id) return;
          const thumbnails = snapshot.val();
          this.image.thumbnails = thumbnails;
          this.generatingThumbs = false;
          bus.$emit('thumbnails-generated', this.image);
        });
      });
    },

    computed: {
      progressStyle() {
        return `width: ${this.progress}%;`;
      },
      uploadComplete() {
        return this.progress == 100;
      }
    },

    methods: {
      onUploadProgress(snapshot) {
        this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      removeImage() {
        this.$emit('remove-image', this.image.id);
      },
    }
  };
</script>


<style lang="scss" scoped>
  @import 'src/styles/_variables';

  .image-upload {
    position: relative;
    background-color: rgba(255, 255, 255, 0.1);
    margin-right: $golden-em / 2;
  }
  
  .image-upload--preview {
    filter: grayscale(1);
    // object-fit: cover;
    display: block;
    height: 14vh;
    flex: 0 0 auto;
    opacity: 0.7;

    &.upload-complete {
      visibility: hidden;
    }
  }
  
  .image-upload--progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    will-change: width;
    transition: width 10ms;
    transform: translate3d(0, 0, 0);
    overflow: hidden;
    img {
      object-fit: cover;
      height: 100%;
      max-width: none;
    }
  }

  .loading-thumbnails {
    animation: loading-thumbnails 2s infinite;
  }

  @keyframes loading-thumbnails {
    0% {
      filter: grayscale(1);
      opacity: 0.7;
    }
    50% {
      filter: grayscale(0);
      opacity: 1;
    }
    100% {
      filter: grayscale(1);
      opacity: 0.7;
    }
  }
</style>