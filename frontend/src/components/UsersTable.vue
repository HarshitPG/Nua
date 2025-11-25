<template>
  <v-container class="pa-6" fluid>
    <v-row class="mb-4" align="center" justify="space-between">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="globalSearch"
          label="Search all fields"
          clearable
        />
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="itemsPerPage"
          :items="itemsPerPageOptions"
          label="Rows per page"
        />
      </v-col>

      <v-col cols="12" md="3" class="d-flex justify-end">
        <v-btn
          color="primary"
          @click="fetchFromPublicAPI"
          :loading="loadingFetch"
        >
          Fetch & Insert 1000 users
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-2" dense>
      <v-col cols="12" sm="4">
        <v-text-field v-model="filters.name" label="Filter Name" clearable />
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field v-model="filters.email" label="Filter Email" clearable />
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field v-model="filters.city" label="Filter City" clearable />
      </v-col>
    </v-row>

    <v-data-table
      :items="pagedItems"
      :headers="headers"
      :items-per-page="itemsPerPage"
      :items-length="filteredItems?.length || 0"
      v-model:sort-by="sortBy"
      class="elevation-1"
    >
      <template #item.action="{ item }">
        <v-btn small @click="openEdit(item)">Edit</v-btn>
      </template>

      <template #no-data>
        <v-alert type="info">No users found.</v-alert>
      </template>
    </v-data-table>

    <v-row class="mt-3" align="center" justify="end">
      <v-pagination v-model="page" :length="pageCount" :total-visible="7" />
    </v-row>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Edit User</v-card-title>

        <v-card-text>
          <v-form ref="editForm" v-model="valid">
            <v-text-field
              v-model="form.name"
              label="Name"
              :rules="[rules.required]"
            />

            <v-text-field
              v-model="form.email"
              label="Email"
              :rules="[rules.required, rules.email]"
            />

            <v-text-field
              v-model="form.city"
              label="City"
              :rules="[rules.required]"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancel</v-btn>

          <v-btn
            color="primary"
            :loading="saving"
            @click="save"
            :disabled="!valid"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import { ref, reactive, computed, onMounted } from "vue";

export default {
  name: "UsersTable",

  setup() {
    const api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const users = ref([]);
    const loadingFetch = ref(false);
    const saving = ref(false);

    const sortBy = ref([{ key: "name", order: "asc" }]);

    const page = ref(1);
    const itemsPerPage = ref(25);
    const itemsPerPageOptions = [10, 25, 50, 100];

    const globalSearch = ref("");
    const filters = reactive({
      name: "",
      email: "",
      city: "",
    });

    const dialog = ref(false);
    const form = reactive({
      uuid: "",
      name: "",
      email: "",
      city: "",
    });

    const valid = ref(false);
    const editForm = ref(null);

    const rules = {
      required: (v) => !!v || "Required",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Invalid email",
    };

    const headers = [
      { title: "Name", value: "name" },
      { title: "Email", value: "email" },
      { title: "City", value: "city" },
      { title: "Action", value: "action", sortable: false },
    ];

    const loadUsers = async () => {
      const res = await api.get("/");
      users.value = res.data;
    };

    const fetchFromPublicAPI = async () => {
      loadingFetch.value = true;
      await api.post("/fetch");
      await loadUsers();
      loadingFetch.value = false;
    };

    const openEdit = (item) => {
      Object.assign(form, item);
      dialog.value = true;
    };

    const save = async () => {
      saving.value = true;

      await api.put(`/${form.uuid}`, {
        name: form.name,
        email: form.email,
        city: form.city,
      });

      await loadUsers();
      dialog.value = false;
      saving.value = false;
    };

    const filteredItems = computed(() => {
      const s = globalSearch.value.toLowerCase();

      return users.value.filter((u) => {
        if (
          filters.name &&
          !u.name.toLowerCase().includes(filters.name.toLowerCase())
        )
          return false;
        if (
          filters.email &&
          !u.email.toLowerCase().includes(filters.email.toLowerCase())
        )
          return false;
        if (
          filters.city &&
          !u.city.toLowerCase().includes(filters.city.toLowerCase())
        )
          return false;

        if (!s) return true;

        return (
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          u.city.toLowerCase().includes(s)
        );
      });
    });

    const pageCount = computed(() =>
      Math.ceil(filteredItems.value.length / itemsPerPage.value)
    );

    const pagedItems = computed(() => {
      const start = (page.value - 1) * itemsPerPage.value;
      return filteredItems.value.slice(start, start + itemsPerPage.value);
    });

    onMounted(loadUsers);

    return {
      users,
      loadingFetch,
      saving,
      globalSearch,
      filters,
      headers,
      page,
      pageCount,
      pagedItems,
      sortBy,
      itemsPerPage,
      itemsPerPageOptions,
      dialog,
      form,
      valid,
      editForm,
      rules,
      loadUsers,
      fetchFromPublicAPI,
      openEdit,
      save,
    };
  },
};
</script>

<style scoped></style>
