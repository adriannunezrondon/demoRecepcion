<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Demo Application</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="small">Demo Application</ion-title>
        </ion-toolbar>
      </ion-header>

      <div
        id="container"
        v-bind:class="{ 'top-margin': !users, usersShowing: users }"
      >
        <ion-button v-show="!users" @click="loadUsers()" expand="block"
          >View All Users</ion-button
        >
        <strong v-show="users"> Todos los Productos </strong>
        <ion-list>
          <!-- Loops through the users array -->
          <ion-item>
            <ion-label position="floating">Codigo</ion-label>
            <ion-input v-on:keyup.enter="presentAlert" type="text" required v-model="entreCodigo"/>
          </ion-item>
          <ion-item v-for="user in users" v-bind:key="user.id">
            <ion-label>{{ user.name }} </ion-label>
          </ion-item>
        </ion-list>
        <ion-button v-show="users" @click="users = null" color="danger"
          >Hide Users</ion-button
        >
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  alertController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  name: "Home-Home",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonButton,
  },
  data() {
    return {
      users: null,
      entreCodigo: "",
    }; // sets users to null on instantiation
  },
  methods: {
    loadUsers() {
      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((response) => {
          this.users = response.data; // assigns the data from api call to the users variable
          console.log(this.users);
        })
        .catch((error) => console.log(error));
    },

    enter() {
      console.log(this.entreCodigo);
    },

    async presentAlert() {
      const alert = await alertController.create({
        header: "Atencion",
        subHeader: "Codigo de Producto",
        message: this.entreCodigo,
        buttons: ["OK"],
      });

      await alert.present();
    },
  },
});
</script>
<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;

  transform: translateY(-50%);
}
.top-margin {
  top: 20%;
}
.usersShowing {
  margin-top: 70%;
}
</style>
