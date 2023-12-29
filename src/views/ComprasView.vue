<script setup>
import { defineAsyncComponent, ref, onMounted } from 'vue'
import axios from '@/services/axios'
import DefaultTable from '../components/DefaultTable.vue'
import { showToast } from '@/composables/toast.js'
const DefaultModal = defineAsyncComponent(() => import('../components/DefaultModal.vue'))
const DefaultInput = defineAsyncComponent(() => import('../components/DefaultInput.vue'))

const creatModal_ref = ref(null)
const editModal_ref = ref(null)
const deleteModal_ref = ref(null)
const deleteItemId = ref(null)
const tableKey = ref(0)
const form = ref({
  nome: '',
  fornecedor_id: 0,
  produto_id: 0,
  quantidade: '',
  preco: ''
})
const fornecedoresOptions = ref([])
const produtosOptions = ref([])

const headers = [
  {
    text: 'Fornecedor',
    value: 'fornecedor_nome',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Produto',
    value: 'produto_nome',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Quantidade',
    value: 'quantidade',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Preço',
    value: 'preco',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Data da Compra',
    value: 'data_compra',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Criado em',
    value: 'created_at',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Modificado em',
    value: 'updated_at',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  }
]

const saveCompra = () => {
  axios
    .post('/api/compras', form.value)
    .then(() => {
      creatModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Compra cadastrada com sucesso!'
      })
      form.value = {
        nome: '',
        fornecedor_id: 0,
        produto_id: 0,
        quantidade: '',
        preco: ''
      }
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao cadastrar Compra!'
      })
    })
}

const updateCompra = () => {
  axios
    .put(`/api/compras/${form.value.id}`, form.value)
    .then(() => {
      editModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Compra atualizada com sucesso!'
      })
      form.value = {
        nome: '',
        fornecedor_id: 0,
        produto_id: 0,
        quantidade: '',
        preco: ''
      }
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao atualizar Compra!'
      })
    })
}

const openEditModal = (item) => {
  form.value = { ...item }
  editModal_ref.value.openModal()
}

const openDeleteModal = (item) => {
  deleteItemId.value = item.id
  deleteModal_ref.value.openModal()
}

const deleteCompra = () => {
  axios
    .delete(`/api/compras/${deleteItemId.value}`)
    .then(() => {
      deleteModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Compra excluída com sucesso!'
      })
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao excluir Compra!'
      })
    })
}

onMounted(async () => {
  await axios.get('/api/produtos').then((response) => {
    produtosOptions.value = response.data.data
  })
  await axios.get('/api/fornecedores').then((response) => {
    fornecedoresOptions.value = response.data.data
  })
})
</script>
<template>
  <div>
    <Suspense>
      <DefaultTable
        :route="'/api/compras'"
        :headers="headers"
        @onRowClick="openEditModal"
        :key="tableKey"
      >
        <template #toolbar="{ selectRow }">
          <div class="flex justify-end">
            <button
              @click="openDeleteModal(selectRow)"
              class="btn btn-outline mx-2 btn-error disabled"
              :disabled="!selectRow"
            >
              <v-icon name="fa-trash" />
            </button>
            <button
              @click="openEditModal(selectRow)"
              class="btn btn-outline mx-2 btn-primary disabled"
              :disabled="!selectRow"
            >
              Editar Compra
            </button>
            <button @click="creatModal_ref.openModal()" class="btn btn-primary">Nova Compra</button>
          </div>
        </template>
      </DefaultTable>
      <template #fallback>
        <div class="flex justify-center items-center h-full w-full">
          <span class="loading loading-dots loading-lg mt-16 text-primary"></span>
        </div>
      </template>
    </Suspense>
    <DefaultModal ref="creatModal_ref" @onSubmit="saveCompra()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Nova Compra</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2 p-0.5 mb-5">
              <select
                v-model="form.fornecedor_id"
                class="select select-primary w-full pl-2 h-12"
                required
              >
                <option disabled selected :value="0">Fonecedor</option>
                <option v-for="option in fornecedoresOptions" :key="option.id" :value="option.id">
                  {{ option.nome }}
                </option>
              </select>
            </div>
            <div class="w-full sm:w-1/2 p-0.5 mb-5">
              <select
                v-model="form.produto_id"
                class="select select-primary w-full pl-2 h-12"
                required
              >
                <option disabled selected :value="0">Produto</option>
                <option v-for="option in produtosOptions" :key="option.id" :value="option.id">
                  {{ option.nome }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2">
              <DefaultInput
                type="number"
                v-model="form.quantidade"
                placeholder="Quantidade"
                required
              />
            </div>
            <div class="w-full sm:w-1/2">
              <DefaultInput type="number" v-model="form.preco" placeholder="Preço" required />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between pt-4">
          <button @click.prevent="creatModal_ref.closeModal()" class="btn btn-outline btn-error">
            Cancelar
          </button>
          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </div>
      </template>
    </DefaultModal>
    <DefaultModal ref="editModal_ref" @onSubmit="updateCompra()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Editar Compra</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2 p-0.5">
              <select
                v-model="form.fornecedor_id"
                class="select select-primary w-full pl-2 h-12"
                required
              >
                <option disabled selected :value="0">Fonecedor</option>
                <option v-for="option in fornecedoresOptions" :key="option.id" :value="option.id">
                  {{ option.nome }}
                </option>
              </select>
            </div>
            <div class="w-full sm:w-1/2 p-0.5 pb-4">
              <select
                v-model="form.produto_id"
                class="select select-primary w-full pl-2 h-12"
                required
              >
                <option disabled selected :value="0">Produto</option>
                <option v-for="option in produtosOptions" :key="option.id" :value="option.id">
                  {{ option.nome }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2">
              <DefaultInput
                type="number"
                v-model="form.quantidade"
                placeholder="Quantidade"
                required
              />
            </div>
            <div class="w-full sm:w-1/2">
              <DefaultInput type="number" v-model="form.preco" placeholder="Preço" required />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between pt-4">
          <button @click.prevent="editModal_ref.closeModal()" class="btn btn-outline btn-error">
            Cancelar
          </button>
          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary">Atualizar</button>
          </div>
        </div>
      </template>
    </DefaultModal>
    <DefaultModal ref="deleteModal_ref" @onSubmit="deleteCompra()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Excluir Compra</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full">
              <span>Tem certeza que deseja excluir a Compra?</span>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between pt-4">
          <button @click.prevent="deleteModal_ref.closeModal()" class="btn btn-outline btn-error">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">Excluir</button>
        </div>
      </template>
    </DefaultModal>
  </div>
</template>
