<template>
	<div class="setUserHead">
		<Header :topName="$route.name"/>
		<MyVueCropper></MyVueCropper>
    </div> 
</template>
<script>
import Header from '../../components/Header2.vue'
import MyVueCropper from '../../components/cropper/myVueCropper'
export default {
     components: {
		Header, MyVueCropper 
	}
}
</script>

