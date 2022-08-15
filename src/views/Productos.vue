<template>
    <base-layout pageTitle="Lista Productos" page-default-back-link="/Productos">
          <ion-searchbar
                v-model="search"
                show-cancel-button="focus"
                cancel-button-text="Custom Cancel"
          ></ion-searchbar>
             
         
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
              <ion-item v-for="producto in searchProd()" v-bind:key="producto.id">
              <ion-label>{{ producto.name }} </ion-label>
              <ion-label>{{ producto.year }} </ion-label>
              <ion-label>{{ producto.color }} </ion-label>                
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
    IonSearchbar,
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
        IonSearchbar,
        //IonButton,
       
    },
    data() {
        return {
        listProductos:[{id:0, name:"",year:0,color:"", pantone_value:"" }],       
        producto:  {id:0, name:"",year:0,color:"", pantone_value:"" },        
        entreCodigo: "",
        entreCantidad:"", 
        countDown: 10,
        value: 0,
        bandera: false,          
        focusCodigo:false,
        length:0,  
        buscar:"" ,
         search: ""
        }; 
  },

  mounted() {
    this.loadUsers();
    
   },
  computed:{ 
   },


    methods: {
     searchProd() {
      debugger;
     let se = []
     if(this.search !== '') {
      se = this.listProductos.filter(p => 
        p.name.toLowerCase().includes(this.search.toLowerCase()) /*||
        p.category.toLowerCase().includes(this.search.toLowerCase()) ||
        p.quantity === Number(this.search)*/
      )
     } else {
      se = this.listProductos
     }
     return se
    },
     loadUsers() {
      axios
        .get("https://reqres.in/api/articles")
        .then((response) => {
          this.listProductos = response.data.data; // assigns the data from api call to the producto variable
          
          console.log(this.listProductos);
        })
        .catch((error) => console.log(error));
    },
   

   Buscar() {     
      this.producto.id=2;
      axios
        .get("https://reqres.in/api/articles/",{params:{id:this.producto.id}})
        .then((response) => {            
          this.listProductos = response.data.data; 
           console.log(this.listProductos);
        }).catch((error) => console.log(error));
    },

    Crear() {
      this.producto.id=10;
      this.producto.name='Producto BEBE';
      this.producto.year=1987;
      this.producto.color='Mestizo';
      this.producto.pantone_value='15-4021';

      axios
        .post("https://reqres.in/api/articles",this.producto)
       .then((response) => {
           // assigns the data from api call to the producto variable
          console.log(this.producto);
        }).catch((error) => console.log(error));
    },

    
  


   /*  async created() {
       this.producto.id=10;
      this.producto.name='Producto BEBE';
      this.producto.year=1987;
      this.producto.color='Mestizo';
      this.producto.pantone_value='15-4021';
        // POST request using axios with async/await
        const article = { title: "Vue POST Request Example" };
        const response = await axios.post("https://reqres.in/api/articles", this.producto);
        this.producto.id = response.data.data.id;
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