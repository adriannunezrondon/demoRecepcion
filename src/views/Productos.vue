<template>    
  <ion-page>
      <ion-header>
          <ion-toolbar>
              <ion-buttons slot="start">
                  <ion-back-button :default-href="pageDefaultBackLink"></ion-back-button>    
              </ion-buttons>
              
              <ion-title>{{pageTitle}}</ion-title>
          </ion-toolbar>
      </ion-header>

      <ion-content :fullscreen="true">                       
        <ion-searchbar placeholder="Código de artículo" ref="buscar" @ion-focus="OnFocus()" @keypress.enter="BuscarArticulo()" :debounce="1000" v-model="idArticulo" ></ion-searchbar>        
      <ion-list>        
        <ion-radio-group v-model="CodArticulo" @ionChange="handelArticulo($event)" checked="false" >     
          <ion-row>
            <ion-col>
              <ion-item  v-for="articulo in results" v-bind:key="articulo.fecha_Ingreso"> 
                <ion-label class="labelCont">              
                 <ion-label class="desc">{{ articulo.descripcion }}</ion-label>
                 <ion-label class="articulo">Código:{{ articulo.idArticulo }}</ion-label>
                 <ion-label class="cantidad">Cant:{{ articulo.cantidad }}</ion-label> 
                </ion-label>  
                <ion-radio slot="start" :value="articulo.fecha_Ingreso"></ion-radio>         
              </ion-item>
            </ion-col>
          </ion-row>  
        </ion-radio-group>      
    </ion-list>
      </ion-content>       

      <ion-footer  id="footer">
                  <div id="divfooter">            
                      <ion-button shape="round" @click="AlertCustomEnvioDeRemito()" class="btn-enviar" color="primary">Enviar</ion-button>     
                  </div> 
      </ion-footer>
  </ion-page>
 
</template>

<script lang="ts">
  import { 
    IonList,
    IonItem,
    IonLabel,  
    IonCol,
    IonRow,     
    IonSearchbar,  
    alertController, 
    IonRadioGroup,   
    IonRadio,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonFooter,
    IonContent,
    IonButton

   
    
  } from '@ionic/vue';
  
import { defineComponent, ref, } from "vue";
import axios from "axios";
const API_URL = "http://9.39.252.72:6181/api";


export default defineComponent ({
    name: 'Prod',
    props: ['pageTitle','pageDefaultBackLink'],
    components: {
        IonList,
        IonItem,
        IonLabel,          
        IonCol,
        IonRow,       
        IonSearchbar, 
        IonRadioGroup,
        IonRadio, 
        IonHeader,
        IonPage,
        IonTitle,
        IonToolbar,
        IonBackButton,
        IonButtons,
        IonFooter,
        IonContent,
        IonButton
       
      
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
        focusBuscar:false,
        length:0,                  
        listaSucursales:[{idsucursal:"",sucursal:""}],
        results:[{idArticulo:"",descripcion:"",cantidad:"", fecha_Ingreso:""}],       

        CodArticulo:-1,   
        NombreSucursal:"",

        objSucursal:{nombre:"",codigo:""},
        remito:"",
        lstArticulos:[{idArticulo:"",descripcion:"",cantidad:"",fecha_Ingreso:""}],
        codSucursal:"001",
        focus:false,
        idArticulo:"",
        objArticulo:{descripcion:"",idArticulo:"", cantidad:"",codigoBarra:"" ,fecha_Ingreso:"",edit:""},

        show:"ok",
        }; 
  },

  mounted() {
       this.remito=String(this.$route.query.codRemito)
       this.CargarTodosLosArticulosRemito(this.remito);
    }, 
 

  methods: { 
    handelArticulo(event:any){    
      this.ValorRadio();
    },  

    alert(msj:string, head:string) {
      return alertController
        .create({
          header:head,          
          message: msj,
          buttons: ['OK'],
        }).then(a => a.present());
    },
      
    AlertCustomEnvioDeRemito() {
      return alertController
        .create({
          header: 'Desea enviar el remito?', 
          cssClass:'custom-alert',  

          buttons: [            
             {
              text: 'Enviar',
              role: 'enviar',
              cssClass: 'alert-button-enviarRM',
                handler: () => {
                  console.log(" Enviando Remito ....");
                  this.EnviarRemito();
                },
              },                  
              {
              text: 'Cancel',
              role: 'Cancel',
              cssClass: 'alert-button-cancelRM',
                handler: () => {
                  console.log(" Cancelando ....");
                },
            }, 
          ]
            
        }).then(a => a.present())
      
      },
   


    ValorRadio(){       
        localStorage.CodArticulo =this.CodArticulo;
        for(var i = 0 ; i <= this.results.length-1; i++)
        {
          if(this.results[i].fecha_Ingreso==localStorage.CodArticulo){
            this.objArticulo.idArticulo=this.results[i].idArticulo;
            this.objArticulo.descripcion=this.results[i].descripcion;
            this.objArticulo.cantidad=this.results[i].cantidad;
            this.objArticulo.fecha_Ingreso=this.results[i].fecha_Ingreso;
            this.objArticulo.edit="true";
            break;
          }
        }
        this.PresentAlertPromptArticulo(this.objArticulo);       
    },

    salvarRemito(idremito: string, articulos: any[]) {        
      axios.put( API_URL+"/admon/save_rm_remito?remito="+idremito+"", articulos)
        .then((response) => {          
         this.CargarTodosLosArticulosRemito(idremito);
        })
        .catch((error) => console.log(error));
    },
    
    EnviarRemito() {            
      axios.put(API_URL+"/admon/send_rm_remito?remito="+this.remito+"", this.lstArticulos)
        .then((response) => {          
       
         this.$router.push({path:'/home'});
        })
        .catch((error) => console.log(error));
    },

    CargarArticulosPorCodRemitoYCodSucursal(){
      axios.get(API_URL+"/admon/get_rm_remito?remito="+this.remito +"&sucursal="+this.codSucursal+"")
        .then((response) => {          
          this.lstArticulos= response.data;
          this.results=this.lstArticulos;
          console.log(this.results);
        }).catch((error) => console.log(error));

    },       
    CargarTodosLosArticulosRemito(remito:string) {    
      axios.get(API_URL+"/admon/get_rm_remito_articles?remito="+remito+"")
        .then((response) => {
          this.lstArticulos= response.data;
          this.results=this.lstArticulos;
          console.log(this.results);       
        })
        .catch((error) => console.log(error));
    }, 
    OnFocus(){
      this.focusBuscar=true;     
    }, 
    
  BuscarArticulo(){    
    if (this.idArticulo!=="" && this.focusBuscar) { 

      this.CargarTodosLosArticulosRemito(this.remito);          
       axios.get(API_URL+"/admon/get_search_articles?articulo="+this.idArticulo+"")
        .then((response) => {
          this.objArticulo=response.data[0];
          if(this.objArticulo.idArticulo==null){
            this.Alert();  
            this.idArticulo="";          
          }else{
            this.PresentAlertPromptArticulo(this.objArticulo);
          }
        })
        .catch((error) => this.Alert()); 
        
      }
    },
    EditarArticulo(idArticulo:string){       
    if (this.idArticulo) { 

      this.CargarTodosLosArticulosRemito(this.remito);          
       axios.get(API_URL+"/admon/get_search_articles?articulo="+this.idArticulo+"")
        .then((response) => {
          this.objArticulo=response.data[0];
          if(this.objArticulo.idArticulo==null){
            this.Alert();  
            this.idArticulo="";          
          }else{
            this.PresentAlertPromptArticulo(this.objArticulo);
          }
        })
        .catch((error) => this.Alert()); 
        
      }
    },

  remove:function(i:any){
     this.lstArticulos.splice(i,1)
    },
    Alert() {
      return alertController
        .create({
          header: '¡Upsss!',          
          message: 'No se encontro el artículo!',
          buttons: ['OK'],
        }).then(a => a.present());
    },
    
    PresentAlertPromptArticulo(obj:any) {
      return alertController
        .create({
          header: 'Artículo', 
          cssClass:'custom-alert',      
          inputs: [
            {
              cssClass: 'inputDesc',
              label: 'Descripción',
              type: 'textarea',              
              name: 'Descripción',
              disabled:true,                          
              value: obj.descripcion + " código artículo : "+ obj.idArticulo,
            },            
            {
              cssClass: 'inputCant',
              label: 'Cantidad',
              name: 'Cantidad',
              type: 'number',
              value: obj.cantidad,
            },
           
          ],
          buttons: [            
         /*    {
              text: 'Cancel',
              role: 'Cancel',
              cssClass: 'alert-button-cancel',
              handler: () => {
                console.log(" Cancelando ....");
              },
            }, */
            {
              text: 'Eliminar',
              role: 'Eliminar',
              cssClass: 'alert-button-delete',
              handler: () => {                
              
                for (let i = 0; i < this.lstArticulos.length; i++) {
                  
                  if(this.lstArticulos[i].fecha_Ingreso==obj.fecha_Ingreso)
                  {
                     this.remove(i);
                    break;
                  }                  
                } 
                this.salvarRemito(this.remito,this.lstArticulos);                      
              },
            },
            {
              text: 'Guardar',
              cssClass: 'alert-button-guardar',
              handler: (alertData) => {                         
                obj.cantidad=alertData.Cantidad;       
                if(obj.edit=="true")
                {       
                      
                  for (let i = 0; i < this.lstArticulos.length; i++) {
                  
                    if(this.lstArticulos[i].fecha_Ingreso==obj.fecha_Ingreso)
                    {
                      this.lstArticulos[i].cantidad=obj.cantidad;
                      break;
                    }                  
                  } 
                 
                  
                }
                else
                {
                    this.lstArticulos.push(obj);  
                    this.lstArticulos.reverse();  
                    //this.salvarRemito(this.remito,this.lstArticulos);
                   
                }
                
                this.idArticulo="";
                this.focusBuscar=false;
                //this.CargarTodosLosArticulosRemito(this.remito);
                this.salvarRemito(this.remito,this.lstArticulos);
              },
            },
          ],
        })
        .then(a => a.present())
    },
   
   onFocus() {    
    
      console.log("Variable Focus Buscar : " +this.focusBuscar);
      if (this.idArticulo!=="" && this.focusBuscar) { 
        console.log("Existe un articulo" +this.idArticulo);
        
       }
     
    },
  },
    
  });
</script>

<style>
 .btn-enviar{
     width: 100px !important;
     text-align: center !important;
  } 

  .custom-alert .inputDesc{     
      margin-top: 0px;
      height: 50px !important;    
  }
  .custom-alert .inputCant
  {
    height: 0px !important;
  }
  .custom-alert .alert-button-guardar
  {
   
    bottom: 15px;
    margin-right: 20px;
    
  }
  .custom-alert .alert-button-guardar
  {
   
    bottom: 15px;
    margin-right: 20px;
    
  }
  .custom-alert .alert-button-delete
  {
    bottom: 55px;
    margin-right: 13em;
  }
  .custom-alert .alert-button-cancel
  {
    
    /*margin-top: 0em;*/
    bottom: 15px;
    margin-right: 100px;
    
  }
  .custom-alert .alert-button-enviarRM
  {
    
    /*margin-top: 0em;*/
    bottom: 5px;
    margin-right: 100px;
    
  }
  .labelCont{
    display: block;
    margin: 1em 0 0 0;    
  }
  .inputDesc{   
    font-size: 85% !important;
    font-family: Arial;
  }
  .desc{
    font-size:14px !important;
  }
  .articulo{
    font-size:12px !important;
    margin-bottom: auto;
    font-family: Arial;
    background-color: transparent;
  }


  .cantidad{
    margin-left:70%;
    font-size:14px !important;
  }
  #footer
  {
      display: block !important;
      text-align: center;
      /*position:relative;*/
      
  }



    

</style>