<script setup>
import { ref } from 'vue'

const props = defineProps({
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onSubmit'])
const modalRef = ref(null)
const formRef = ref(null)

const openModal = async () => {
  modalRef.value.show()
}

const closeModal = async () => {
  modalRef.value.close()
}

defineExpose({
  openModal,
  closeModal
})
</script>
<template>
  <dialog v-bind="$attrs" ref="modalRef" class="modal modal-bottom sm:modal-middle">
    <form ref="formRef" method="dialog" class="modal-box" @submit.prevent="emit('onSubmit')">
      <slot name="header"></slot>
      <slot name="body"></slot>
      <slot name="footer"></slot>
    </form>
    <form method="dialog" class="modal-backdrop bg-black/50">
      <button v-if="!props.persistent">close</button>
    </form>
  </dialog>
</template>
