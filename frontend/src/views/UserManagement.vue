<template>
  <div>
    <h1 class="font-color-black">{{ page }}</h1>
    <b-form-group>
      <b-form-radio-group buttons button-variant="outline-primary" v-model="page" :options="pages"
                          @change="getTableItems" />
    </b-form-group>
    <b-button variant="primary" class="mb-2" @click="openCreateModal">Create</b-button>
    <b-table responsive striped hover :items="filteredList" :fields="tableHeaders" :current-page="offset" :per-page="0"
             show-empty empty-text="No data to show.">
      <template #head(username)="head">
        {{head.label}}
        <b-input v-model="filters.username" size="sm" class="mt-2" placeholder="Username..."></b-input>
      </template>
      <template #head(email)="head">
        {{ head.label }}
        <b-input v-model="filters.email" size="sm" class="mt-2" placeholder="Email..."></b-input>
      </template>
      <template #head(name)="head">
        {{ head.label }}
        <b-input v-model="filters.name" size="sm" class="mt-2" placeholder="Name..."></b-input>
      </template>
      <template #head(description)="head">
        {{ head.label }}
        <b-input v-model="filters.description" size="sm" class="mt-2" placeholder="Description..."></b-input>
      </template>
      <template #cell(roles)="row">
        <b-badge class="mr-2" variant="primary" v-for="role in row.item.roles" :key="role._id">{{role.name}}</b-badge>
      </template>
      <template #cell(permissions)="row" >
        <b-badge class="mr-2" variant="primary" v-for="permission in row.item.permissions" :key="permission._id">{{ permission.name }}</b-badge>
      </template>
      <template #cell(actions)="row">
        <div class="d-flex flex-column">
          <b-link class="pb-2" v-b-modal.EditPermissionModal @click="selectedRow = row.item" v-if="page === 'Permissions'">Edit</b-link>
          <b-link class="pb-2" v-b-modal.EditRoleModal @click="selectedRow = row.item" v-if="page === 'Roles'">Edit</b-link>
          <b-link class="pb-2" v-b-modal.EditUserModal @click="selectedRow = row.item" v-if="page === 'Users'">Edit</b-link>

          <b-link class="pb-2" v-if="page !== 'Config'" @click="deleteItem(row.item._id)">Delete</b-link>
        </div>
      </template>
    </b-table>
    <div class="d-flex justify-content-between align-items-baseline">
      <span class="input-group w-auto align-items-baseline">
        <span class="input-group-append mr-2">Per Page: </span>
        <b-form-select v-model="limit" :options="[5, 10, 15]" class="custom-select custom-select-sm"
                       @change="getTableItems" />
      </span>
      <b-pagination :per-page="limit" :total-rows="totalCount" v-model="offset" @input="getTableItems"></b-pagination>
      <span>{{ totalCount }} requests in {{ Math.ceil(totalCount / limit) }} pages</span>
    </div>
    <create-user-modal @Created="modalClose" v-if="page === 'Users'" id="CreateUserModal"/>
    <create-role-modal @Created="modalClose" :permissions-options="permissionOptions" v-if="page === 'Roles'" id="CreateRoleModal"/>
    <create-permission-modal @Created="modalClose" v-if="page === 'Permissions'" id="CreatePermissionModal"/>
    <edit-permission-modal @Updated="modalClose" @Closed="selectedRow = null" :selected-permission="selectedRow" v-if="selectedRow" id="EditPermissionModal"></edit-permission-modal>
    <edit-role-modal @Updated="modalClose" @Closed="selectedRow = null" :selected-role="selectedRow" :permissions="permissionOptions" v-if="selectedRow" id="EditRoleModal"/>
    <edit-user-modal @Updated="modalClose" @Closed="selectedRow = null" :selected-user="selectedRow" :roles="rolesOptions" v-if="selectedRow" id="EditUserModal" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Permission, Role, User, Users } from '@/api/api'
import { api } from '@/helper'
import CreateUserModal from '@/components/Admin/CreateUserModal.vue'
import CreateRoleModal from '@/components/Admin/CreateRoleModal.vue'
import CreatePermissionModal from '@/components/Admin/CreatePermissionModal.vue'
import EditPermissionModal from '@/components/Admin/EditPermissionModal.vue'
import EditRoleModal from '@/components/Admin/EditRoleModal.vue'
import EditUserModal from '@/components/Admin/EditUserModal.vue'

type pages = 'Users' | 'Roles' | 'Permissions' | 'Config'
export default Vue.extend({
  name: 'UserManagement',
  components: {
    EditUserModal,
    EditRoleModal,
    EditPermissionModal,
    CreateUserModal,
    CreateRoleModal,
    CreatePermissionModal
  },
  data () {
    return {
      page: 'Users' as pages,
      pages: ['Users', 'Roles', 'Permissions', 'Config'] as pages[],
      tableData: [] as User[] | Role[] | Permission[],
      selectedRow: null as User | Role | Permission | null,
      permissionOptions: [] as Permission[],
      rolesOptions: [] as Role[],
      totalCount: 0,
      offset: 1,
      limit: 10,
      filters: {
        username: '',
        email: '',
        name: '',
        description: ''
      }
    }
  },
  computed: {
    tableHeaders () {
      if (this.page === 'Users') {
        return [{ key: 'username', sortable: true },
          { key: 'email', sortable: true },
          { key: 'roles', sortable: false },
          { key: 'Actions', sortable: false }]
      } else if (this.page === 'Roles') {
        return [{ key: 'name', sortable: true },
          { key: 'description', sortable: true },
          { key: 'permissions', sortable: false },
          { key: 'Actions', sortable: false }]
      } else {
        return [{ key: 'name', sortable: true },
          { key: 'description', sortable: true },
          { key: 'Actions', sortable: false }]
      }
    },
    filteredList () {
      if (this.page === 'Users') {
        return this.$data.tableData.filter((data : User) =>
          data.username?.includes(this.filters.username) &&
          data.email?.includes(this.filters.email))
      } else if (this.page === 'Roles') {
        return this.$data.tableData.filter((data: Role) =>
          data.name?.includes(this.filters.name) &&
          data.description?.includes(this.filters.description))
      } else {
        return this.$data.tableData.filter((data: Permission) =>
          data.name?.includes(this.filters.name) &&
          data.description?.includes(this.filters.description))
      }
    }
  },
  methods: {
    async getTableItems () {
      if (this.page === 'Users') {
        const data = (await api.user.userList({ limit: this.limit.toString(), offset: (this.offset - 1).toString() })).data
        this.tableData = data.users
        this.totalCount = data.count
      } else if (this.page === 'Roles') {
        const data = (await api.admin.roleList({ limit: this.limit.toString(), offset: (this.offset - 1).toString() })).data
        this.tableData = data.roles
        this.rolesOptions = data.roles
        this.totalCount = data.count
      } else {
        const data = (await api.admin.permissionList({ limit: this.limit.toString(), offset: (this.offset - 1).toString() })).data
        this.tableData = data.permissions
        this.permissionOptions = data.permissions
        this.totalCount = data.count
      }
    },
    openCreateModal () {
      if (this.page === 'Users') {
        this.$bvModal.show('CreateUserModal')
      } else if (this.page === 'Roles') {
        this.$bvModal.show('CreateRoleModal')
      } else {
        this.$bvModal.show('CreatePermissionModal')
      }
    },
    async modalClose () {
      await this.getTableItems()
    },
    async deleteItem (id : string) {
      if (this.page === 'Users') {
        await api.user.userDelete(id)
      } else if (this.page === 'Roles') {
        await api.admin.roleDelete(id)
      } else {
        await api.admin.permissionDelete(id)
      }
      await this.getTableItems()
    }
  },
  async created () {
    await this.getTableItems()
    this.permissionOptions = (await api.admin.permissionList({ limit: this.limit.toString(), offset: (this.offset - 1).toString() })).data.permissions
    this.rolesOptions = (await api.admin.roleList({ limit: this.limit.toString(), offset: (this.offset - 1).toString() })).data.roles
  }
})
</script>
