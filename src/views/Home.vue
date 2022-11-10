<template>  


        <base-layout pageTitle=Tienda>
           <!--  <div id="nav">              
              <ion-button :router-link="{ name: 'Productos' }">Click Me</ion-button>
            </div>  -->    
            <ion-card class="card">    
             {{$route.query.sucursal}}   
             {{$route.query.CodSucursal}} 
            
             

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
                  </form>                  
                    
                </ion-card-content>
              </ion-card>
                        
              
        </base-layout>  
</template>

<script lang="ts">
import {  
  IonButton,
  IonItem,
    IonList,
    IonInput,
    IonLabel,IonCard, IonCardContent, IonCardHeader, IonCardTitle, alertController, 
   
} from "@ionic/vue";
import axios from "axios";
const API_URL = "http://9.39.252.72:6181/api";

import { defineComponent} from "vue";
import { useRouter} from 'vue-router';
export default defineComponent({
  name: "App",
  components: {   
    IonButton,
    IonItem,
    IonList,
    IonInput,
    IonLabel,IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  },
  props: ['foo'],
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
      CodSucuarsal:this.$route.query.CodSucursal,
      NombreSucursal:this.$route.query.sucursal,
    }; 
  },
   mounted() {   
        this.NombreSucursal=localStorage.nombre;
        this.CodSucuarsal=localStorage.CodSucuarsal;       
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
      axios.get(API_URL+"/admon/get_rm_remito?remito="+this.entreCodigo+"&sucursal="+localStorage.CodSucursal+"")
        .then((response) => {               
        this.remito=response.data[0];        
          if(this.remito.estado=='T'){
              this.Alert("El remito " + this.entreCodigo + " ya ha sido transferido");
              return;
            }

          if(!this.validaRemito(this.entreCodigo)){
              this.Alert("Ingresa un remito válido!");
              return;
            }
          this.$router.push({path:'/productos', query:{codRemito: this.entreCodigo}});
            
        }).catch((error) => this.Alert("Este remito no pertenece a esta sucursal o existe problema de conexión"))

        
                    
    },
    mostararSucursales(){        
          this.$router.push("/sucursales");        
    }

  },
});

</script>

// scoped limita el css solo para este componente
<style scoped>
    button > * {
        pointer-events: none;
        cursor: pointer;
        width: 80%;
    }  
    .formulario{    
      width: 80%;   
      margin-left: 10%;
    }
    .card{
      margin-top: 50%;
      height:50% ;
    }
    .title{
      text-align:center;
    }
   #divfooter .btn-enviar 
    {
      background-color: brown;
        display: none !important;
    }    
</style>

