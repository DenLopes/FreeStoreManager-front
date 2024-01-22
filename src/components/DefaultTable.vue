<script setup>
import { ref, computed, toRaw, useSlots } from 'vue'
import DefaultInput from './DefaultInput.vue'
import axios from '@/services/axios'

//the headers prop is an array of objects with the following structure:
// {
//   text: 'Name',
//   value: 'name',
//   style: 'text-left'
//   class: 'text-primary'
//   bodyStyle: 'text-left'
//   bodyClass: 'text-primary'
//}

const props = defineProps({
  headers: {
    type: Array,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  checkBox: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['clickedRow'])

const slots = useSlots();

const selectedRow = ref(null)
const search = ref('')
const data = ref([])
const rowsPerPageOptions = [10, 20, 50, 100]
const rowsPerPage = ref(rowsPerPageOptions[0])
const currentPage = ref(1)

const filteredData = computed(() => {
  if (search.value) {
    return data.value.filter((item) =>
      props.headers.some((header) =>
        item[header.value]?.toString().toLowerCase().includes(search.value.toLowerCase())
      )
    )
  }
  return data.value
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / rowsPerPage.value))

const paginatedFilteredData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return filteredData.value.slice(start, end)
})

const selectedItem = computed(() => {
  if (selectedRow.value !== null) {
    return toRaw(data.value[selectedRow.value])
  }
  return null
})

const footerColSpan = computed(() => {
  if (props.checkBox) {
    return props.headers.length + 2
  }
  return props.headers.length + 1
})

const handleCheckBoxClick = (index) => {
  if (selectedRow.value === index) {
    selectedRow.value = null
  } else {
    selectedRow.value = index
  }
}

const slotIsBeingUsed = (name) => {
  return slots[name] !== undefined
}

await axios.get(props.route).then((response) => {
  data.value = response.data.data
})
</script>
<template>
  <div class="overflow-x-auto">
    <div class="flex justify-between p-2">
      <DefaultInput v-model="search" placeholder="Pesquisar" class="input-lg" />
      <slot name="toolbar" :selectRow="selectedItem" />
    </div>
    <table class="table table-md bg-primary/5 shadow-lg">
      <!-- head -->
      <thead class="h-12">
        <tr class="z-20">
          <th v-if="checkBox"></th>
          <th
            v-for="header in props.headers"
            :key="header?.value"
            class="text-left"
            :style="header?.style"
            :class="header?.class"
          >
            {{ header?.text }}
          </th>
          <th v-if="slotIsBeingUsed('actions')" class="text-left">
            Ações
          </th>
        </tr>
      </thead>
      <tbody class="bg-base-100">
        <tr
          v-for="(item, index) in paginatedFilteredData"
          :key="item?.id"
          class="hover cursor-pointer"
          @click="emit('clickedRow', item)"
        >
          <th v-if="checkBox">
            <input
              type="checkbox"
              class="checkbox"
              :checked="selectedRow === index"
              @click.stop="handleCheckBoxClick(index)"
            />
          </th>
          <td
            v-for="header in props.headers"
            :key="header?.value"
            :style="header?.bodyStyle"
            :class="header?.bodyClass"
          >
            {{ item[header?.value] }}
          </td>
          <td v-if="slotIsBeingUsed('actions')">
            <slot name="actions" :item="item" />
          </td>
        </tr>
      </tbody>
      <tfoot class="bg-base-100">
        <tr>
          <td :colspan="footerColSpan">
            <div v-if="data.length === 0" class="text-center text-lg">Dados não encontrados</div>
            <div v-else class="flex justify-end gap-2 mt-2">
              <select v-model="rowsPerPage" class="select select-primary mx-1 select-sm">
                <option v-for="option in rowsPerPageOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              <div class="flex items-center">
                <button
                  @click="currentPage -= 1"
                  :disabled="currentPage === 1"
                  class="cursor-pointer"
                >
                  <v-icon name="fa-chevron-left" class="w-5 h-5 text-primary hover:scale-110" />
                </button>
                <span class="text-sm p-1">{{ currentPage }} de {{ totalPages }}</span>
                <button
                  @click="currentPage += 1"
                  :disabled="currentPage === totalPages"
                  class="cursor-pointer"
                >
                  <v-icon name="fa-chevron-right" class="w-5 h-5 text-primary hover:scale-110" />
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
