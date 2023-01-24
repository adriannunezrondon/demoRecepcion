<template>
   
    <base-layout pageTitle="Estados de últimos remitos" page-default-back-link="/home">
        <p class="parrafo">
            Se muestran los remitos de las <ion-text color="danger">útimas 24 horas.</ion-text> 
        </p>
        
            <p class="parrafo"><ion-text color="primary">Guardado</ion-text>:El remito y las unidades están guardados en base datos Mosca.</p>
            <p class="parrafo"><ion-text color="danger">Pendiente</ion-text>:El remito está enviado por la sucursal y pendiente a que Poscomm lo procese. </p>
            <p class="parrafo"><ion-text color="warning">Transferido</ion-text>:El remito ya fue procesado por Poscomm y cargado con éxito.</p> 
            

    
                <ion-grid  :fixed="true" padding class="tab5-content">
                    <ion-row class="cabecera">
                        <ion-col>Remito</ion-col>
                        <ion-col>Estado</ion-col>
                        <ion-col>Fecha</ion-col>
                    </ion-row>
              
                    <ion-row class="filas" v-for="remito in results" v-bind:key="remito.idStockRemito">                       
                        <ion-col>{{ remito.idStockRemito }}</ion-col>
                        <div v-if="remito.estado==='P'"> 
                            <ion-col class=clnEstado>{{'Pendiente'}}</ion-col>
                        </div>
                        <div v-if="remito.estado==='T'">
                            <ion-col class=clnEstado>{{'Transferido'}}</ion-col>
                        </div>
                        <div v-if="remito.estado==='G'">
                            <ion-col class=clnEstado>{{'Guardado'}}</ion-col>
                        </div>
                        
                        <ion-col>{{ remito.fecha_tranferencia }}</ion-col>
                    </ion-row>
                </ion-grid> 
    </base-layout > 
   
  </template>
  
  <script lang="ts">
    import { 
      IonCol,
      IonRow,
      IonGrid,
     
      IonText
    } from '@ionic/vue';
  
  import { defineComponent, ref} from "vue";
  import axios from "axios";
  const API_URL = "http://9.39.252.247:6181/api";
  //const API_URL = "http://localhost:3164/api";
  
    export default defineComponent ({
      name: 'Prod',
      components: {                                           
          IonCol,
          IonRow, 
          IonGrid, 
          
          IonText
      },

    mounted() {
        this.CargarEstadosRemitosAlDia();
       
    },  
     
      
    data() {
        return {
            results:[{idStockRemito:"",estado:"", fecha_tranferencia:"", sucursal:""}],
            sucursal:"",
        }; 
    },
    
  
    methods: {
        async CargarEstadosRemitosAlDia(){         
            this.sucursal=localStorage.CodSucursal;
            await axios.get(API_URL+"/admon/get_estado_remitos_al_dia?sucursal="+this.sucursal+"")
                .then((response) => {          
                    this.results= response.data;                
                    console.log(this.results);
                }).catch((error) => console.log(error));

            },  
     
    },
      
  });
  </script>
  <style scoped>
   .cabecera{
    font-size: 12px;
    
    
   }
   .filas{
        font-size: 10px;
        
   }
   .parrafo{
    font-size: 12px;
    text-justify: auto;
   }
   .clnEstado{
    margin-right: 60px;
   }
   .Estado{
    margin-right:100px;
   }
  </style>
  
  