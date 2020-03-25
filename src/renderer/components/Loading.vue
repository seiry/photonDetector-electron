<template>
  <div class="cover">
    <span>
      loading...
    </span>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.cover {
  height: 100vh;
  width: 100vw;
  z-index: 999;
  background-color: rgba(#555555, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: #fff;
  }
}
</style>
