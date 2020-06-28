<template>
  <div>
    <navbar></navbar>
    <goods-detail :isEdit="true"></goods-detail>
  </div>
</template>

<script>
import GoodsDetail from './components/GoodsDetail'
import Navbar from './components/Navbar'
export default {
  name: 'updateGoods',
  components: {
    GoodsDetail,
    Navbar
  }
}
</script>

<style lang="less" scoped>
</style>
