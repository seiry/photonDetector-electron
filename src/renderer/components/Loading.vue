<template>
  <div class="cover">
    <div class="text">
      <div class="lds-dual-ring"></div>
      <span>loading...</span>
    </div>
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
    margin-left: 10px;
  }
}
.text {
  display: flex;
  justify-content: center;
  align-items: center;
}
.lds-dual-ring {
  display: inline-block;
  width: 48px;
  height: 48px;
}
.lds-dual-ring:after {
  content: ' ';
  display: block;
  width: 20px;
  height: 20px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 0.8s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
