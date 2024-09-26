<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-data-table :headers="headers" :items="networks" item-value="name" class="elevation-1" :items-per-page="5">
          <template v-slot:top>
            <v-col cols="auto">
              <v-btn color="primary" size="small" @click="openDialog(dialog)">Додати мережу</v-btn>
            </v-col>
          </template>

          <template v-slot:['item.actions']="{ item }">
            <v-icon small @click="openDialog(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteNetwork(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>



  <!-- Діалогове вікно для додавання/редагування -->
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:default="dialog">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditMode ? 'Редагувати мережу' : 'Додати мережу' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent>
            <v-text-field class="text-h5" v-model="network.number" variant="outlined" label="Номер"
              required></v-text-field>
            <v-text-field v-model="network.name" variant="outlined" label="Назва" required></v-text-field>
            <v-text-field v-model="network.frequency" variant="outlined" label="Частоти" required></v-text-field>
            <v-text-field v-model="network.calling" variant="outlined" label="Позивний" required></v-text-field>
            <v-text-field v-model="network.description" variant="outlined" label="Опис" required></v-text-field>
            <v-text-field v-model="network.particularity" variant="outlined" label="Особливості"
              required></v-text-field>
            <v-text-field v-model="network.x" label="X" variant="outlined" required></v-text-field>
            <v-text-field v-model="network.y" label="Y" variant="outlined" required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeDialog">Скасувати</v-btn>
          <v-btn color="blue darken-1" text @click="handleSubmit">{{ isEditMode ? "Оновити" : "Додати" }}</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>



<script>
import axios from "axios";

export default {
  data() {
    return {
      networks: [],
      headers: [
        { title: "Номер", value: "number" },
        { title: "Назва", value: "name", sortable: true },
        { title: "Частоти", value: "frequency" },
        { title: "Позивні", value: "calling" },
        { title: "Опис", value: "description" },
        { title: "Примітки", value: "particularity" },
        { title: "X", value: "x" },
        { title: "Y", value: "y" },
        { title: "Дії", value: "actions", sortable: false },
      ],
      dialog: false,
      isEditMode: false,
      network: {
        id: null,
        number: '',
        name: '',
        calling: '',
        frequency: '',
        description: '',
        particularity: '',
        x: '',
        y: ''
      }
    };
  },
  created() {
    this.fetchNetworks();
  },
  methods: {
    async fetchNetworks() {
      try {
        const response = await axios.get("http://localhost:3000/networks");
        this.networks = response.data;
      } catch (error) {
        console.error("Помилка заватаження списку мереж", error);
      }
    },

    openDialog(item = null) {
      if (item) {
        this.network = {...item};
        this.isEditMode = true;
      } else {
        this.resetForm();
        this.isEditMode = false;
      }
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },


    async handleSubmit() {
      if (this.isEditMode) {
        await this.updateNetwork();
      } else {
        await this.addNetwork();
      }
    },

    resetForm() {
      this.network = {
        id: null,
        number: '',
        name: '',
        calling: '',
        frequency: '',
        description: '',
        particularity: '',
        x: '',
        y: ''
      };
      this.isEditMode = false;
    },

    async addNetwork() {
      const sendNetwork = {
        number: parseInt(this.network.number),
        name: this.network.name.trim(),
        calling: this.network.calling.trim(),
        frequency: parseFloat(this.network.frequency),
        description: this.network.description.trim(),
        particularity: this.network.particularity.trim(),
        x: parseFloat(this.network.x),
        y: parseFloat(this.network.y)
      }

      try {
        const response = await axios.post('http://localhost:3000/networks', sendNetwork);       
        this.networks.push(response.data);
        this.closeDialog();
      } catch (error) {
        console.log(`Помилка додавання мережі ${error}`)
      }
    },

    async updateNetwork() {
      try {
        const response = await axios.put(`http://localhost:3000/networks/${this.network.id}`, this.network);
        const index = this.networks.findIndex(n => n.id === this.network.id);
        this.networks.splice(index, 1, response.data);
        this.closeDialog();
      } catch (error) {
        console.error('Помилка редагування мережі:', error);
      }
    },

    editNetwork() {
      this.network = {...this.network};
      this.isEditMode = true;
      this.dialog = true;
    },

    async deleteNetwork(id) {
      try {
        await axios.delete(`http://localhost:3000/networks/${id}`);
        this.networks = this.networks.filter(n => n.id !== id);  // Видалити мережу зі списку
      } catch (error) {
        console.error('Помилка видалення мережі:', error);
      }
    },
  },
};
</script>

<style scoped>
.v-data-table-header th {
  font-weight: bold;
}
</style>