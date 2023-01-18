<template>
   
  <base-layout pageTitle="Elige una Sucursal" page-default-back-link="/sucursales">
    
    <ion-searchbar :debounce="1000" @ionChange="handleChange($event)"></ion-searchbar>        
    <ion-list>     
        <ion-radio-group v-model="CodSucursal" @ionChange="handelSucursal($event)" >
          <ion-row>            
            <ion-col>
              <ion-item  v-for="sucursal in results" v-bind:key="sucursal.idsucursal">
                <ion-label >{{ sucursal.sucursal }}</ion-label>
                <ion-label>{{ sucursal.idsucursal }}</ion-label>
                <ion-radio slot="start" :value="sucursal.idsucursal"></ion-radio>
              </ion-item>
            </ion-col>             
          </ion-row>          
        </ion-radio-group>
    </ion-list>
  
  </base-layout > 
 
</template>

<script lang="ts">
  import { 
    IonList,
    IonItem,
    IonLabel,
    alertController,    
    IonRadio, 
    IonRadioGroup,
    IonCol,
    IonRow,   
    IonSearchbar,    
    loadingController  
       
  } from '@ionic/vue';
 
import { defineComponent, ref} from "vue";
import axios from "axios";
const API_URL = "http://9.39.252.247:6181/api";
//const API_URL = "http://localhost:3164/api";

  export default defineComponent ({
    name: 'Prod',
    components: {
        IonList,
        IonItem,
        IonLabel,
        IonRadio, 
        IonRadioGroup,
        IonCol,
        IonRow,       
        IonSearchbar,        
    },
    props: {
    timeout: { type: Number, default: 2000},
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
        listaSucursales:[{idsucursal:"",sucursal:""}],
        results:[{idsucursal:"",sucursal:""}],
        CodSucursal:-1,   
        NombreSucursal:"",        
        objSucursal:{nombre:"",codigo:""},
        show:"",
        data:[{idsucursal:"",sucursal:""}],
           
        }; 
  },

  mounted() {
       this.presentLoadingSucursales();       
       console.log(this.show);
       
    },

  methods: {
    async presentLoadingSucursales() {
        const loading = await loadingController
          .create({
            cssClass: 'my-custom-class',
            message: 'Espere por favor...',
            //duration: this.timeout,            
          });

        await loading.present();
        await this.CargarSucursales();     
        setTimeout(() => {         
        
            if(this.data.length>1){
                loading.dismiss();
            }  
            if(this.data.length===1){              
              this.AlertCustomLoading();
              loading.dismiss();
            }

          }, );
      }, 

      AlertCustomLoading() {
      return alertController
        .create({
          header: 'Problemas con la conexión...', 
          cssClass:'custom-alert',  

          buttons: [            
             {
              text: 'Reintentar',
              role: 'Reintentar',
              cssClass: 'alert-button-enviarRM',
                handler: () => {
                  this.presentLoadingSucursales();
                },
              },                  
              {
              text: 'Cancel',
              role: 'Cancel',
              cssClass: 'alert-button-cancelRM',
                handler: () => {
                  //console.log(" Cancelando ....");
                },
            }, 
          ]
            
        }).then(a => a.present())
      
      },
   

    handelSucursal(event:any){
      this.ValorRadio();
    },   
        
    handleChange(event:any){      
      const query = event.target.value.toLowerCase();      
      this.results = this.listaSucursales.filter(p =>p.sucursal.toLowerCase().includes(query));
    },

    async CargarSucursales() {
      console.log("LOG - ENTRANDO A CARGAR SUCURSALES");

      await axios.get(API_URL+"/articulos/getSucursalZona/")
        .then((response) => {          
          this.listaSucursales= response.data;
          this.results=this.listaSucursales; 
          this.data=response.data; 
        })
        .catch(
          (error) => console.log("LOG-" + error)          
          );
    },
    
    ValorRadio(){      
        localStorage.CodSucursal =this.CodSucursal;
        for(var i = 0 ; i <= this.listaSucursales.length-1; i++)
        {
          if(this.listaSucursales[i].idsucursal==localStorage.CodSucursal){
            localStorage.nombre=this.listaSucursales[i].sucursal;
            break;
          }
        }       
        console.log(localStorage.CodSucursal);
        console.log(localStorage.nombre);
        this.$router.push({ path: '/home', query: { sucursal: localStorage.nombre, CodSucursal:localStorage.CodSucursal}})   
    },  

  },
    
});
</script>
<style scoped>
 

</style>

