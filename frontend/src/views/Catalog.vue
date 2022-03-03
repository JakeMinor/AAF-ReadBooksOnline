<template>
  <div>
    <h1 class="font-color-black">Catalog</h1>
    <b-table responsive striped hover :items="filteredList" :fields="requestTableHeaders" :current-page="offset"
             :per-page="0" show-empty empty-text="We currently have no books available, why not request one!">
      <template #head(bookName)="head">
        {{ head.label }}
        <b-input id="Book-Name-Filter" v-model="filters.bookName" size="sm" class="mt-2" placeholder="Book Name..."></b-input>
      </template>
      <template #head(author)="head">
        {{ head.label }}
        <b-input id="Author-Filter" v-model="filters.author" size="sm" class="mt-2" placeholder="Author..."></b-input>
      </template>
      <template #head(isbn)="head">
        {{ head.label }}
        <b-input id="ISBN-Filter" v-model="filters.isbn" size="sm" class="mt-2" placeholder="ISBN..."></b-input>
      </template>
      <template #head(bookType)="head">
        {{ head.label }}
        <b-select id="Book-Type-Filter" :options="bookTypes" v-model="filters.bookType" size="sm" class="mt-2"></b-select>
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
      <span id="Pagination-Details">{{ totalCount }} books in {{ Math.ceil(totalCount / limit) }} pages</span>
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
      books: [] as Request[], // The books which have been purchased.
      totalCount: 0, // The total count of the books displayed in the table.
      limit: 10, // The amount of items to be shown on the table.
      offset: 1, // The tables current page.
      filters: {
        bookName: '', // Filters the table by the book name.
        author: '', // Filters the table by the author name.
        isbn: '', // Filters the table by the books ISBN.
        bookType: '' as BookType // Filters the table by the book type.
      }
    }
  },
  computed: {
    /**
     * The headings for the table and if they are sortable fields.
     */
    requestTableHeaders () {
      return [{ key: 'bookName', sortable: true },
        { key: 'author', sortable: true },
        { key: 'isbn', sortable: true },
        { key: 'bookType', sortable: true },
        { key: 'price', sortable: true }]
    },
    /**
     * The available book types.
     */
    bookTypes () {
      return ['', ...bookTypes]
    },
    /**
     * Applies any filters and updates the table.
     */
    filteredList () {
      return this.$data.books.filter((request: Request) =>
        request.bookName.includes(this.filters.bookName) &&
        request.author.includes(this.filters.author) &&
        request.bookType.includes(this.filters.bookType) &&
        request.isbn!.includes(this.filters.isbn)
      )
    }
  },
  methods: {
    /**
     * The format price method from helper.ts
     */
    formatDate,
    /**
     * The format date method from helper.ts
     */
    formatPrice,
    /**
     * Gets the items which are to be displayed in the table.
     */
    async getCatalogItems () {
      // Makes an API call to get the request filtering by the Purchased status and pagination filter.
      api.bookRequest.bookRequestList({ limit: this.limit.toString(), offset: (this.offset - 1).toString(), status: 'Purchased' })
        .then((res) => {
          // Sets the returned books and count
          this.books = res.data.requests
          this.totalCount = res.data.count
        })
        .catch(error => {
          // Catch any errors and display a toast informing the user.
          this.$bvToast.toast(error.message, {
            title: 'Error',
            variant: 'danger',
            solid: true
          })
        })
    }
  },
  /**
   * Created hook which gets the table items.
   */
  async created () {
    await this.getCatalogItems()
  }
})
</script>
