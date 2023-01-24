<template> 
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">

                    <div v-if="this.$route.query.CodSucursal!=null"> 
                      <ion-title>{{this.$route.query.sucursal}}</ion-title> 
                    </div>
                    <div v-else>
                      <ion-title>{{this.nombreSucursal}}</ion-title>
                    </div>
                    
                    
                    <!-- <div v-if="this.$route.query.CodSucursal!=null">                      
                      <ion-label class="sucursal" slot="sucursal">Sucursal: {{this.$route.query.sucursal}}-{{this.$route.query.CodSucursal}}</ion-label> 
                    </div>
                    <div v-else>                      
                      <ion-label class="sucursal" slot="sucursal">Sucursal: {{this.nombreSucursal}}-{{this.codSucursal}}</ion-label> 
                    </div> -->
                                                        
                </ion-buttons>
               
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">                       
          <ion-card class="card">
              <ion-card-header>
                <!-- <ion-card-subtitle>Destination</ion-card-subtitle> -->
                  <ion-card-title class="title">Ingresar o escanear el remito</ion-card-title>
              </ion-card-header>

                <ion-card-content>
                    <form class="formulario" @submit.prevent="submitFrom">
                    <ion-list>

                      <ion-item>
                        <ion-label  class="labelCodigo" position="floating">Código</ion-label>
                        <ion-input class="codigo" type="text" required v-model="entreCodigo"/>                    
                      </ion-item>                      
                      
                    </ion-list>
                    <ion-button type="submit"  color="success" expand="block">CONTINUAR</ion-button>  
                    <ion-button  @click="mostararSucursales()" expand="block">SELECCIONAR SUCURSALES</ion-button>   
                    <ion-button  @click="mostararEstadoRemitosDelDia()" expand="block">ESTADO ÚLTIMOS REMITOS</ion-button>              
                    </form>                  
            
                </ion-card-content>
          </ion-card> 
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import {  
  IonButton,
  IonItem,
    IonList,
    IonInput,
    IonLabel,
    IonCard, 
    IonCardContent,
    IonCardHeader, 
    IonCardTitle, 
    alertController,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonContent,
    loadingController   
   
} from "@ionic/vue";
import axios from "axios";
const API_URL = "http://9.39.252.72:6181/api";

//const API_URL = "http://localhost:3164/api";


import { defineComponent} from "vue";
import { useRouter} from 'vue-router';


export default defineComponent({
  name: "App",
  components: {   
    IonButton,
    IonItem,
    IonList,
    IonInput,
    IonLabel,
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardTitle,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonContent
  },
  props: {
    
  },
  data() {
    return {
     
      entreCodigo:"",
      valor:"",
      ss:[],
      lstArticulos:[{idArticulo:"",descripcion:"",cantidad:"",fecha_Ingreso:""}],        
      sucursal:"",
      result:[],
      remito:{estado:"",idStockRemito:"", sucursal:""},
      estadoRemito:"",
      codSucursal: localStorage.CodSucursal,
      nombreSucursal:localStorage.nombre,
     
    }; 
  },
   mounted() {   
        this.codSucursal=localStorage.CodSucursal;
        this.nombreSucursal=localStorage.nombre;
        this.entreCodigo="";
    }, 

   methods: {

    Alert(msj:any) {
      return alertController
        .create({
          header: '¡Upsss!',          
          message: msj,
          buttons: ['OK'],
        }).then(a => a.present());
    },
    validaRemito: function (remito:string) {
      var re = /^[a-z0-9]+$/i;
      if (!re.test(remito))
          return false;
        return true;
            
    },


    submitFrom(){ 
      
        if(localStorage.CodSucursal==null){
              this.Alert("Selecciona una sucursal");
              return;
            }  
        if(this.entreCodigo==""){
              this.Alert("Este campo no puede estar en blanco");
              return;
          } 
          if(!this.validaRemito(this.entreCodigo)){
              this.Alert("Ingresa un remito válido!");
              return;
            }     
            
      axios.get(API_URL+"/admon/get_rm_remito?remito="+this.entreCodigo+"&sucursal="+localStorage.CodSucursal+"")
        .then((response) => {
          this.remito=response.data[0];            
          if(this.remito.estado=='T'){
              this.Alert("El remito " + this.entreCodigo + " ya ha sido transferido");
              return;
            }
            if(this.remito.estado=='P'){
              this.Alert("El remito " + this.entreCodigo + " ya ha sido enviado");
              return;
            }          
            localStorage.CodRemito=this.entreCodigo;
            this.$router.replace({path:'/productos'});
            this.entreCodigo="";

         
            
        }).catch((error) => this.Alert("Este remito no pertenece a esta sucursal o existe problema de conexión"))
    },

    mostararSucursales(){
          this.$router.push("/sucursales");        
    },

    mostararEstadoRemitosDelDia(){
          this.$router.push("/estados");        
    }

  },
});

</script>

// scoped limita el css solo para este componente
<style scoped>
 ion-spinner {
    color: blue;
    }
    button > * {
        pointer-events: none;
        cursor: pointer;
        width: 80%;
    }  
    .formulario{ 
      margin-top: 0px !important;   
      width: 80%;   
      margin-left: 10%;
    }
    .card-content-md{
      margin-top: -17px;
    }
    .card{
      margin-top: 30%;
      height:60% ;
    }
    .title{
      text-align:center;
    }
   #divfooter .btn-enviar 
    {
      background-color: brown;
        display: none !important;
    }   
    .sucursal{
    margin-left:25px !important;
    
  } 
</style>

