<template>       
        <base-layout pageTitle="App Recepción">
           <!--  <div id="nav">              
              <ion-button :router-link="{ name: 'Productos' }">Click Me</ion-button>
            </div>  -->       
            <form class="ion-padding" @submit.prevent="submitFrom">
              <ion-list>

                  <ion-item>
                    <ion-label position="floating">Usuaio</ion-label>
                    <ion-input type="text" required v-model="entreUsuario"/>
                  </ion-item>
                  <ion-item>
                    <ion-label position="floating">Contraseña</ion-label>
                    <ion-input type="password" required v-model="entreContrasena "/>
                  </ion-item>
                  
              </ion-list>
              <ion-button type="submit" expand="block">Enviar</ion-button>
            </form>
        </base-layout>  
</template>

<script lang="ts">

import {  
  IonButton,
  IonItem,
    IonList,
    IonInput,
    IonLabel,
   
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from 'vue-router';
export default defineComponent({
  name: "App",
  components: {   
    IonButton,
    IonItem,
    IonList,
    IonInput,
    IonLabel,
    
  },
  data() {
    return {
      entreUsuario:"",
      entreContrasena:""
     
    }; 
  },
  methods: {
    submitFrom(){
      const usuario={
        user:this.entreUsuario,
        pass:this.entreContrasena,
      };
    
       if(usuario.user=="adrian" && usuario.pass=="123"){
          console.log("Enviando datos de Autenticacion");
          this.$router.push("/Productos");
       }
          
    }

  },
});

</script>
