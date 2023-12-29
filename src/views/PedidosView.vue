<script setup>
import { ref, onMounted, defineAsyncComponent, watch } from 'vue'
import axios from '@/services/axios'
import { showToast } from '@/composables/toast.js'
import DefaultTable from '../components/DefaultTable.vue'
const DefaultModal = defineAsyncComponent(() => import('@/components/DefaultModal.vue'))
const DefaultInput = defineAsyncComponent(() => import('@/components/DefaultInput.vue'))

const modal_ref = ref(null)
const modalType = ref('create')
const tableKey = ref(0)
const clientesOptions = ref([])
const produtosOptions = ref([])
const deleteModal_ref = ref(null)
const deleteItemId = ref(null)

const orderForm = ref({
  cliente_id: 0,
  status: true,
  venda_itens: []
})

const headers = [
  {
    text: 'Cliente',
    value: 'cliente_nome',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Data da venda',
    value: 'data_venda',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Status',
    value: 'status',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Itens da venda',
    value: 'itens_venda',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Quantidade de itens',
    value: 'quantidade_total',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Total',
    value: 'valor_total',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  }
]

const addOrderDetail = () => {
  orderForm.value.venda_itens.push({
    produto_id: 0,
    quantidade: null,
    preco: null
  })
}

const removeOrderDetail = (index) => {
  orderForm.value.venda_itens.splice(index, 1)
}

const openCreateModal = () => {
  modalType.value = 'create'
  orderForm.value = {
    cliente_id: 0,
    status: true,
    venda_itens: []
  }
  modal_ref.value.openModal()
}

const openEditModal = (item) => {
  modalType.value = 'edit'
  orderForm.value = {
    ...item,
    status: item.status === '1' ? true : false
  }
  modal_ref.value.openModal()
}

const handleSubmit = () => {
  if (orderForm.value.cliente_id === 0) {
    showToast({
      type: 'error',
      message: 'Selecione um cliente!'
    })
    return
  }
  if (orderForm.value.venda_itens.some((item) => item.produto_id === 0)) {
    showToast({
      type: 'error',
      message: 'Selecione um produto!'
    })
    return
  }
  if (modalType.value === 'create') {
    orderForm.value.venda_itens.forEach((item) => {
      item.total = item.quantidade * item.preco
    })
    axios
      .post('/api/vendas', orderForm.value)
      .then(() => {
        modal_ref.value.closeModal()
        tableKey.value++
        showToast({
          type: 'success',
          message: 'Venda cadastrada com sucesso!'
        })
      })
      .catch(() => {
        showToast({
          type: 'error',
          message: 'Erro ao cadastrar Venda!'
        })
      })
  } else if (modalType.value === 'edit') {
    orderForm.value.venda_itens.forEach((item) => {
      item.total = item.quantidade * item.preco
    })
    axios
      .put(`/api/vendas/${orderForm.value.id}`, orderForm.value)
      .then(() => {
        modal_ref.value.closeModal()
        tableKey.value++
        showToast({
          type: 'success',
          message: 'Venda atualizada com sucesso!'
        })
      })
      .catch(() => {
        showToast({
          type: 'error',
          message: 'Erro ao atualizar Venda!'
        })
      })
  }
}

const deleteOrder = () => {
  axios
    .delete(`/api/vendas/${deleteItemId.value}`)
    .then(() => {
      deleteModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Venda excluída com sucesso!'
      })
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao excluir Venda!'
      })
    })
}

const openDeleteModal = (item) => {
  deleteItemId.value = item.id
  deleteModal_ref.value.openModal()
}

watch(
  () => orderForm.value.venda_itens,
  (orderDetails) => {
    orderDetails.forEach((item, index) => {
      const produto = produtosOptions.value.find((p) => p.id === item.produto_id)
      if (produto) {
        orderForm.value.venda_itens[index].preco = produto.preco
      }
    })
  },
  { deep: true }
)

onMounted(async () => {
  await axios.get('/api/clientes').then((response) => {
    clientesOptions.value = response.data.data
  })
  await axios.get('/api/produtos').then((response) => {
    produtosOptions.value = response.data.data
  })
})
</script>
<template>
  <div>
    <Suspense>
      <DefaultTable :route="'/api/vendas'" :headers="headers" :key="tableKey">
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
              Editar Venda
            </button>
            <button @click="openCreateModal" class="btn btn-primary">Nova Venda</button>
          </div>
        </template>
      </DefaultTable>
      <template #fallback>
        <div class="flex justify-center items-center h-full w-full">
          <span class="loading loading-dots loading-lg mt-16 text-primary"></span>
        </div>
      </template>
    </Suspense>

    <DefaultModal ref="modal_ref" @onSubmit="handleSubmit()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">{{
            modalType === 'create' ? 'Nova Venda' : 'Editar Venda'
          }}</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex w-full h-16">
            <div class="w-full mt-2">
              <select v-model="orderForm.cliente_id" class="select select-primary w-full" required>
                <option disabled selected :value="0">Cliente</option>
                <option v-for="cliente in clientesOptions" :key="cliente.id" :value="cliente.id">
                  {{ cliente.nome }}
                </option>
              </select>
            </div>
            <div class="flex flex-wrap pl-2">
              <div class="form-control w-full">
                <label class="flex flex-col justify-center items-center cursor-pointer label">
                  <span class="label-text">Status</span>
                  <input
                    type="checkbox"
                    class="toggle toggle-primary"
                    v-model="orderForm.status"
                    checked
                  />
                </label>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="flex flex-col w-full">
              <div class="flex items-center justify-between py-2">
                <h3 class="text-lg font-bold">Detalhes da Venda</h3>
                <button @click.prevent="addOrderDetail" class="btn btn-secondary mb-2">
                  Adicionar Item
                  <v-icon name="fa-plus" class="w-4 h-4" />
                </button>
              </div>
              <div
                v-for="(detail, index) in orderForm.venda_itens"
                :key="index"
                class="flex flex-col"
              >
                <select v-model="detail.produto_id" class="select select-primary w-full mb-2 mx-0.5">
                  <option disabled selected :value="0">Produto</option>
                  <option v-for="produto in produtosOptions" :key="produto.id" :value="produto.id">
                    {{ produto.nome }}
                  </option>
                </select>
                <div class="flex flex-center">
                  <DefaultInput
                    type="number"
                    v-model="detail.quantidade"
                    placeholder="Quantidade"
                    required
                  />
                  <DefaultInput type="number" v-model="detail.preco" placeholder="Preço" required />
                  <button
                    @click.prevent="removeOrderDetail(index)"
                    class="btn btn-error btn-square mt-0.5"
                  >
                    <v-icon name="fa-minus" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between pt-4">
          <button @click.prevent="modal_ref.closeModal()" class="btn btn-outline btn-error">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">
            {{ modalType === 'create' ? 'Salvar' : 'Atualizar' }}
          </button>
        </div>
      </template>
    </DefaultModal>
    <DefaultModal ref="deleteModal_ref" @onSubmit="deleteOrder()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Excluir Venda</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="w-full">
            <span>Tem certeza que deseja excluir esta venda?</span>
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
