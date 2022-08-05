<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Demo Application Recepcion</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="small">Demo Application Recepcion</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="container">
        <ion-button v-show="!users" @click="loadUsers()" expand="block">Productos</ion-button>
        <strong v-show="users"> Todos los Productos </strong>
        <ion-list>
          <!-- Loops through the users array -->
             
             <ion-item>
                 <ion-label v-show="users" position="floating">Codigo</ion-label>
                 <ion-input v-show="users"  type="text" required v-model="entreCodigo" placeholder="Entre el Codigo"/>
            </ion-item>
            <ion-item>
                <ion-label v-show="users" position="floating">Cantidad</ion-label>
                <ion-input v-show="users" v-on:keyup.enter="presentAlert"  @ion-focus="onFocus" type="text"  required v-model="entreCantidad" placeholder="Entere la Cantidad"/>
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
import { onMounted, ref } from "vue"

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
      entreCantidad:"", 
      countDown: 10,
      value: 0,
      bandera: false,          
      focusCodigo:false,
      length:0,   
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
   onFocus() {
      this.$emit('onFocus')
      this.focusCodigo=true;
      console.log(this.focusCodigo);
    },
   
    async presentAlert() {
      if (this.entreCodigo!==" " && this.focusCodigo) {       
         const alert = await alertController.create({
          header: "Atencion",
          subHeader: "Producto",
          message: "Codigo de Producto es :  " + this.entreCodigo + " La Cantidad es : " +this.entreCantidad,        
          buttons: ["Enviar"],
          
        });
                
         this.entreCodigo=" ";
         this.entreCantidad=" ";
         await alert.present(); 
      } 
    },
    

  },
});
</script>
<style scoped>
#container {
  margin-top: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;

  transform: translateY(-50%);
}
.input {
  margin-top: 20%;
  margin-right: 0px;
}
.top-margin {
  top:50%;
}
.usersShowing {
  margin-top: 70%;
}
</style>
