<template>
    <base-layout pageTitle="Lista Productos" page-default-back-link="/Productos">

       <!--  <div id="nav">   
            <router-link to="/home">Home</router-link>
            <ion-button :router-link="{ name: 'Home' }">Click Me</ion-button>
         </div> -->
            <ion-item>
              <ion-label  position="floating">Codigo</ion-label>
              <ion-input  type="text" required v-model="entreCodigo" placeholder="Entre el Codigo"/>
            </ion-item>              

            <ion-item>                  
              <ion-label  position="floating">Cantidad</ion-label>
              <ion-input v-on:keyup.enter="presentAlert"  @ion-focus="onFocus" type="text"  required v-model="entreCantidad" placeholder="Entere la Cantidad"/>
            </ion-item>    

            <ion-list>
              <ion-item v-for="user in users" v-bind:key="user.id">
              <ion-label>{{ user.name }} </ion-label>
              <ion-label>{{ user.year }} </ion-label>
              <ion-label>{{ user.color }} </ion-label>                
              </ion-item>
            </ion-list>
       
    </base-layout> 
</template>

<script lang="ts">
  import { 
    IonList,
    IonItem,
    IonLabel,
    alertController,
    IonInput,
    //IonButton,
  
  } from '@ionic/vue';
 
import { defineComponent } from "vue";
import axios from "axios";

  export default defineComponent ({
    name: 'Prod',
    components: {
        IonList,
        IonItem,
        IonLabel,
        IonInput,
        //IonButton,
       
    },
    data() {
        return {
        users: {id:0, name:"",year:0,color:"", pantone_value:""},
        entreCodigo: "",
        entreCantidad:"", 
        countDown: 10,
        value: 0,
        bandera: false,          
        focusCodigo:false,
        length:0,  
        buscar:0 
        }; 
  },

   mounted() {
    this.loadUsers();
   },

    methods: {
     loadUsers() {
      axios
        .get("https://reqres.in/api/articles")
        .then((response) => {
          this.users = response.data.data; // assigns the data from api call to the users variable
          console.log(this.users);
        })
        .catch((error) => console.log(error));
    },
   

   Buscar() {     
      this.users.id=2;
      axios
        .get("https://reqres.in/api/articles/",{params:{id:this.users.id}})
        .then((response) => {            
          this.users = response.data.data; 
           console.log(this.users);
        }).catch((error) => console.log(error));
    },

    Crear() {
      this.users.id=10;
      this.users.name='Producto BEBE';
      this.users.year=1987;
      this.users.color='Mestizo';
      this.users.pantone_value='15-4021';

      axios
        .post("https://reqres.in/api/articles",this.users)
       .then((response) => {
           // assigns the data from api call to the users variable
          console.log(this.users);
        }).catch((error) => console.log(error));
    },

    
  


   /*  async created() {
       this.users.id=10;
      this.users.name='Producto BEBE';
      this.users.year=1987;
      this.users.color='Mestizo';
      this.users.pantone_value='15-4021';
        // POST request using axios with async/await
        const article = { title: "Vue POST Request Example" };
        const response = await axios.post("https://reqres.in/api/articles", this.users);
        this.users.id = response.data.data.id;
    }, */

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
         //this.Crear();
         this.Buscar();
      } 
    },
    

  },
    
  });
</script>