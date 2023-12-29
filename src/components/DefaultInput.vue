<script setup>
import { ref, defineModel } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array,
    default: () => []
  },
  noBottomMargin: {
    type: Boolean,
    default: false
  }
})

const applyRule = ref(false)
const modelValue = defineModel()

const rule = (value) => {
  if (!applyRule.value) {
    return { valid: true, msg: '' }
  }
  if (props.required && (value === '' || value === undefined || value === null)) {
    return { valid: false, msg: 'Campo obrigatório' }
  }
  for (const ruleObj of props.rules) {
    if (!ruleObj.validate(value)) {
      return { valid: false, msg: ruleObj.message }
    }
  }

  return { valid: true, msg: '' }
}
</script>

<template>
  <div class="flex flex-col p-0.5">
    <input
      v-model="modelValue"
      type="text"
      class="w-full input input-bordered input-primary pl-2 h-12"
      :class="[rule(modelValue).valid ? props.noBottomMargin ? 'mb-0' : 'mb-4' : 'border-error mb-0']"
      :placeholder="placeholder"
      v-bind="$attrs"
      @blur="applyRule = true"
      :required="props.required"
    />

    <span v-if="!rule(modelValue).valid" class="text-error text-xs max-h-0.5 mb-4 ml-0.5">
      {{ rule(modelValue).msg }}
    </span>

    <span
      v-if="hint && rule(modelValue).valid"
      class="text-primary-content text-xs max-h-0.5 mb-1 ml-0.5"
      >{{ hint }}</span
    >
  </div>
</template>
