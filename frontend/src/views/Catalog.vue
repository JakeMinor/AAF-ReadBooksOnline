<template>
  <div>
    <h1 class="font-color-black">Catalog</h1>
    <b-table responsive striped hover :items="filteredList" :fields="requestTableHeaders" :current-page="offset"
             :per-page="0" show-empty empty-text="We currently have no books available, why not request one!">
      <template #head(bookName)="head">
        {{ head.label }}
        <b-input v-model="filters.bookName" size="sm" class="mt-2" placeholder="Book Name..."></b-input>
      </template>
      <template #head(author)="head">
        {{ head.label }}
        <b-input v-model="filters.author" size="sm" class="mt-2" placeholder="Author..."></b-input>
      </template>
      <template #head(isbn)="head">
        {{ head.label }}
        <b-input v-model="filters.isbn" size="sm" class="mt-2" placeholder="ISBN..."></b-input>
      </template>
      <template #head(bookType)="head">
        {{ head.label }}
        <b-select :options="bookTypes" v-model="filters.bookType" size="sm" class="mt-2"></b-select>
      </template>
      <template #head(status)="head">
        {{ head.label }}
        <b-select :options="statuses" v-model="filters.status" size="sm" class="mt-2"></b-select>
      </template>
      <template #cell(price)="cell">
        {{ formatPrice(cell.item.price) }}
      </template>
    </b-table>
    <div class="d-flex justify-content-between align-items-baseline">
      <span class="input-group w-auto align-items-baseline">
        <span class="input-group-append mr-2">Per Page: </span>
        <b-form-select v-model="limit" :options="[5, 10, 15]" class="custom-select custom-select-sm"
                       @change="getCatalogItems" />
      </span>
      <b-pagination :per-page="limit" :total-rows="totalCount" v-model="offset" @input="getCatalogItems"></b-pagination>
      <span>{{ totalCount }} books in {{ Math.ceil(totalCount / limit) }} pages</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Request } from '@/api/api'
import { api, BookType, bookTypes, Status, statuses, formatDate, formatPrice } from '@/helper'
export default Vue.extend({
  name: 'Catalog',
  data () {
    return {
      books: [] as Request[],
      totalCount: 0,
      limit: 10,
      offset: 1,
      filters: {
        bookName: '',
        author: '',
        isbn: '',
        bookType: '' as BookType,
        status: '' as Status
      }
    }
  },
  computed: {
    requestTableHeaders () {
      return [{ key: 'bookName', sortable: true },
        { key: 'author', sortable: true },
        { key: 'isbn', sortable: true },
        { key: 'bookType', sortable: true },
        { key: 'price', sortable: true }]
    },
    bookTypes () {
      return ['', ...bookTypes]
    },
    statuses () {
      return ['', ...statuses]
    },
    filteredList () {
      return this.$data.books.filter((request: Request) =>
        request.bookName.includes(this.filters.bookName) &&
        request.author.includes(this.filters.author) &&
        request.bookType.includes(this.filters.bookType) &&
        request.status!.includes(this.filters.status) &&
        request.isbn!.includes(this.filters.isbn)
      )
    }
  },
  methods: {
    formatDate,
    formatPrice,
    async getCatalogItems () {
      api.bookRequest.bookRequestList({ limit: this.limit.toString(), offset: (this.offset - 1).toString(), status: 'Purchased' })
        .then((res) => {
          this.books = res.data.requests
          this.totalCount = res.data.count
        })
        .catch(error => {
          this.$bvToast.toast(error.message, {
            title: 'Error',
            variant: 'danger',
            solid: true
          })
        })
    }
  },
  async created () {
    await this.getCatalogItems()
  }
})
</script>
