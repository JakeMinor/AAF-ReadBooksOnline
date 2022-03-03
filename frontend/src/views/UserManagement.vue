<template>
  <div>
    <h1 class="font-color-black">{{ page }}</h1>
    <b-form-group>
      <b-form-radio-group buttons button-variant="outline-primary" v-model="page" :options="pages"
                          @change="getTableItems" />
    </b-form-group>
    <b-button variant="primary" class="mb-2" @click="openCreateModal" v-if="page !== 'Config'">Create</b-button>
    <b-table responsive striped hover :items="filteredList" :fields="tableHeaders" :current-page="offset" :per-page="0"
             show-empty empty-text="No data to show.">
      <template #head(username)="head">
        {{ head.label }}
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
        <b-badge class="mr-2" variant="primary" v-for="role in row.item.roles" :key="role._id">{{ role.name }}</b-badge>
      </template>
      <template #cell(permissions)="row">
        <b-badge class="mr-2" variant="primary" v-for="permission in row.item.permissions" :key="permission._id">
          {{ permission.name }}
        </b-badge>
      </template>
      <template #cell(spendThreshold)="row">
        {{ formatPrice(row.item.spendThreshold) }}
      </template>
      <template #cell(monthlySpendThreshold)="row">
        {{ formatPrice(row.item.monthlySpendThreshold) }}
      </template>
      <template #cell(totalMonthlySpend)="row">
        {{ formatPrice(row.item.totalMonthlySpend) }}
      </template>
      <template #cell(actions)="row">
        <div class="d-flex flex-column">
          <b-link class="pb-2" v-b-modal.EditPermissionModal @click="selectedRow = row.item"
                  v-if="page === 'Permissions'">Edit
          </b-link>
          <b-link class="pb-2" v-b-modal.EditRoleModal @click="selectedRow = row.item" v-if="page === 'Roles'">Edit
          </b-link>
          <b-link class="pb-2" v-b-modal.EditUserModal @click="selectedRow = row.item" v-if="page === 'Users'">Edit
          </b-link>
          <b-link class="pb-2" v-b-modal.EditConfigModal @click="selectedRow = row.item" v-if="page === 'Config'">Edit
          </b-link>
          <b-link class="pb-2" v-if="page !== 'Config'" @click="deleteItem(row.item._id)">Delete</b-link>
        </div>
      </template>
    </b-table>
    <div class="d-flex justify-content-between align-items-baseline" v-if="page !== 'Config'">
      <span class="input-group w-auto align-items-baseline">
        <span class="input-group-append mr-2">Per Page: </span>
        <b-form-select v-model="limit" :options="[5, 10, 15]" class="custom-select custom-select-sm"
                       @change="getTableItems" />
      </span>
      <b-pagination :per-page="limit" :total-rows="totalCount" v-model="offset" @input="getTableItems"></b-pagination>
      <span>{{ totalCount }} requests in {{ Math.ceil(totalCount / limit) }} pages</span>
    </div>
    <create-user-modal @Created="modalClose" v-if="page === 'Users'" id="CreateUserModal" />
    <create-role-modal @Created="modalClose" :permissions-options="permissionOptions" v-if="page === 'Roles'"
                       id="CreateRoleModal" />
    <create-permission-modal @Created="modalClose" v-if="page === 'Permissions'" id="CreatePermissionModal" />
    <edit-permission-modal @Updated="modalClose" @Closed="selectedRow = null" :selected-permission="selectedRow"
                           v-if="selectedRow" id="EditPermissionModal"></edit-permission-modal>
    <edit-role-modal @Updated="modalClose" @Closed="selectedRow = null" :selected-role="selectedRow"
                     :permissions="permissionOptions" v-if="selectedRow" id="EditRoleModal" />
    <edit-user-modal @Updated="modalClose" @Closed="selectedRow = null" :selected-user="selectedRow"
                     :roles="rolesOptions" v-if="selectedRow" id="EditUserModal" />
    <edit-config-modal @Updated="modalClose" @Closed="selectedRow = null" :config-data="selectedRow" v-if="selectedRow"
                       id="EditConfigModal" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Permission, Role, User, Users } from '@/api/api'
import { api, formatPrice } from '@/helper'
import CreateUserModal from '@/components/Admin/CreateUserModal.vue'
import CreateRoleModal from '@/components/Admin/CreateRoleModal.vue'
import CreatePermissionModal from '@/components/Admin/CreatePermissionModal.vue'
import EditPermissionModal from '@/components/Admin/EditPermissionModal.vue'
import EditRoleModal from '@/components/Admin/EditRoleModal.vue'
import EditUserModal from '@/components/Admin/EditUserModal.vue'
import EditConfigModal from '@/components/Admin/EditConfigModal.vue'

type pages = 'Users' | 'Roles' | 'Permissions' | 'Config'
export default Vue.extend({
  name: 'UserManagement',
  components: {
    EditConfigModal,
    EditUserModal,
    EditRoleModal,
    EditPermissionModal,
    CreateUserModal,
    CreateRoleModal,
    CreatePermissionModal
  },
  data () {
    return {
      page: 'Users' as pages, // Sets the table to display users.
      pages: ['Users', 'Roles', 'Permissions', 'Config'] as pages[], // The different displays for the table.
      tableData: [] as User[] | Role[] | Permission[], // Stores the table data.
      selectedRow: null as User | Role | Permission | null, // The currently selected row.
      permissionOptions: [] as Permission[], // The array of available permissions.
      rolesOptions: [] as Role[], // The array of available roles.
      totalCount: 0, // The total count of the requests displayed in the table.
      offset: 1, // The tables current page.
      limit: 10, // The amount of items to be shown on the table.
      filters: {
        username: '', // Filters the table by the users username.
        email: '', // Filters the table by the users email.
        name: '', // Filters the table by the datas name.
        description: '' // Filters the table by the datas description.
      }
    }
  },
  computed: {
    /**
     * The headings for the table and if they are sortable fields, returns depending on the page.
     */
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
      } else if (this.page === 'Permissions') {
        return [{ key: 'name', sortable: true },
          { key: 'description', sortable: true },
          { key: 'Actions', sortable: false }]
      } else {
        return [{ key: 'spendThreshold' },
          { key: 'monthlySpendThreshold' },
          { key: 'totalMonthlySpend' },
          { key: 'Actions' }]
      }
    },
    /**
     * Applies any filters and updates the table, depending on the selected page.
     */
    filteredList () {
      if (this.page === 'Users') {
        return this.$data.tableData.filter((data: User) =>
          data.username?.includes(this.filters.username) &&
          data.email?.includes(this.filters.email))
      } else if (this.page === 'Roles') {
        return this.$data.tableData.filter((data: Role) =>
          data.name?.includes(this.filters.name) &&
          data.description?.includes(this.filters.description))
      } else if (this.page === 'Permissions') {
        return this.$data.tableData.filter((data: Permission) =>
          data.name?.includes(this.filters.name) &&
          data.description?.includes(this.filters.description))
      } else {
        return this.$data.tableData
      }
    }
  },
  methods: {
    /**
     * The format price method from helper.ts
     */
    formatPrice,
    /**
     * Gets the items which are to be displayed in the table, depending on the selected page.
     */
    async getTableItems () {
      if (this.page === 'Users') {
        // Gets Users from the data and paginates them.
        const data = (await api.user.userList({
          limit: this.limit.toString(),
          offset: (this.offset - 1).toString()
        })).data

        // Sets the returned users and count.
        this.tableData = data.users
        this.totalCount = data.count
      } else if (this.page === 'Roles') {
        // Gets Roles from the data and paginates them.
        const data = (await api.admin.roleList({
          limit: this.limit.toString(),
          offset: (this.offset - 1).toString()
        })).data

        // Sets the returned roles and count.
        this.tableData = data.roles
        this.totalCount = data.count
      } else if (this.page === 'Permissions') {
        // Gets Permissions from the data and paginates them.
        const data = (await api.admin.permissionList({
          limit: this.limit.toString(),
          offset: (this.offset - 1).toString()
        })).data

        // Sets the returned permissions and count.
        this.tableData = data.permissions
        this.totalCount = data.count
      } else {
        // Defaults the table to contain the config data.
        this.tableData = (await api.admin.configList()).data
      }
    },
    /**
     * Opens the create modal dependant on the selected page.
     */
    openCreateModal () {
      if (this.page === 'Users') {
        this.$bvModal.show('CreateUserModal')
      } else if (this.page === 'Roles') {
        this.$bvModal.show('CreateRoleModal')
      } else {
        this.$bvModal.show('CreatePermissionModal')
      }
    },
    /**
     * Closes the modal and updates the table.
     */
    async modalClose () {
      await this.getTableItems()
    },
    /**
     * Deletes an item from the table dependant on the selected page.
     * @param id
     */
    async deleteItem (id: string) {
      if (this.page === 'Users') {
        await api.user.userDelete(id)
      } else if (this.page === 'Roles') {
        await api.admin.roleDelete(id)
      } else {
        await api.admin.permissionDelete(id)
      }
      // Updates the table items.
      await this.getTableItems()
    }
  },
  /**
   * Created hook which gets the permission and role lists.
   */
  async created () {
    // Updates the table items.
    await this.getTableItems()

    // Sends API call to get the permission list.
    api.admin.permissionList()
      .then((res) => { this.permissionOptions = res.data.permissions })
      .catch(error => {
        // Catch any errors and display a toast informing the user.
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })

    // Sends API call to get the role list.
    api.admin.roleList()
      .then((res) => { this.rolesOptions = res.data.roles })
      .catch(error => {
        // Catch any errors and display a toast informing the user.
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })
  }
})
</script>
