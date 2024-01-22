<script setup>
import { defineAsyncComponent, ref } from 'vue'
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
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})
const headers = [
  {
    text: 'Nome',
    value: 'name',
    style: 'text-left',
    class: 'text-secondary',
    bodyStyle: 'text-left'
  },
  {
    text: 'Email',
    value: 'email',
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

const saveUsuario = () => {
  axios
    .post('/api/users', form.value)
    .then(() => {
      creatModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Usuario cadastrado com sucesso!'
      })
      form.value = {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao cadastrar Usuario!'
      })
    })
}

const updateUsuario = () => {
  axios
    .put(`/api/users/${form.value.id}`, form.value)
    .then(() => {
      editModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Usuario atualizado com sucesso!'
      })
      form.value = {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao atualizar Usuario!'
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

const deleteUsuario = () => {
  axios
    .delete(`/api/users/${deleteItemId.value}`)
    .then(() => {
      deleteModal_ref.value.closeModal()
      tableKey.value++
      showToast({
        type: 'success',
        message: 'Usuario excluído com sucesso!'
      })
    })
    .catch(() => {
      showToast({
        type: 'error',
        message: 'Erro ao excluir Usuario!'
      })
    })
}

const passwordConfirmationRule = {
  validate: (value) => value === form.value.password_confirmation,
  message: 'As senhas não coincidem'
}

const passwordMin6Rule = {
  validate: (value) => value.length >= 6,
  message: 'A senha deve ter no mínimo 6 caracteres'
}

</script>
<template>
  <div>
    <Suspense>
      <DefaultTable :route="'/api/users'"  :headers="headers" :key="tableKey" checkBox>
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
              Editar Usuario
            </button>
            <button @click="creatModal_ref.openModal()" class="btn btn-primary">
              Novo Usuario
            </button>
          </div>
        </template>
      </DefaultTable>
      <template #fallback>
        <div class="flex justify-center items-center h-full w-full">
          <span class="loading loading-dots loading-lg mt-16 text-primary"></span>
        </div>
      </template>
    </Suspense>
    <DefaultModal ref="creatModal_ref" @onSubmit="saveUsuario()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Novo Usuario</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full">
              <DefaultInput v-model="form.name" placeholder="Nome" required />
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full">
              <DefaultInput v-model="form.email" placeholder="Email" />
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2">
              <DefaultInput
                type="password"
                v-model="form.password"
                placeholder="Senha"
                :rules="[passwordConfirmationRule, passwordMin6Rule]"
                required
              />
            </div>
            <div class="w-full sm:w-1/2">
              <DefaultInput
                type="password"
                v-model="form.password_confirmation"
                placeholder="Confirmar Senha"
                required
              />
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
    <DefaultModal ref="editModal_ref" @onSubmit="updateUsuario()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Editar Usuario</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full">
              <DefaultInput v-model="form.name" placeholder="Nome" required />
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full">
              <DefaultInput v-model="form.email" placeholder="Email" />
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2">
              <DefaultInput
                type="password"
                v-model="form.password"
                placeholder="Senha"
                :rules="[passwordConfirmationRule, passwordMin6Rule]"
                required
              />
            </div>
            <div class="w-full sm:w-1/2">
              <DefaultInput
                type="password"
                v-model="form.password_confirmation"
                placeholder="Confirmar Senha"
                required
              />
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
    <DefaultModal ref="deleteModal_ref" @onSubmit="deleteUsuario()">
      <template #header>
        <div class="pb-2">
          <span class="text-2xl font-bold">Excluir Usuario</span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col flex-wrap">
          <div class="flex flex-wrap">
            <div class="w-full">
              <span>Tem certeza que deseja excluir o Usuario?</span>
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
