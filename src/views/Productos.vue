<template>    
  <ion-page>
      <ion-header>
          <ion-toolbar>
              <ion-buttons slot="start">
                  <ion-back-button :default-href="pageDefaultBackLink" ></ion-back-button> 
                  <ion-label slot="cantidad">Cantidad : {{this.suma}}</ion-label>                                  
                  <ion-label class="sucursal" slot="sucursal">Sucursal : {{this.codSucursal}}</ion-label>                  
              </ion-buttons>
              <ion-title>{{pageTitle}}</ion-title>
          </ion-toolbar>
      </ion-header>

      <ion-content :fullscreen="true">                       
        <ion-searchbar placeholder="Código de artículo" ref="buscar" @ion-focus="OnFocus()" @ionChange="BuscarArticulo()" @keypress.enter="BuscarArticulo()" :debounce="1000" v-model="idArticulo" ></ion-searchbar>        
      <ion-list>        
        <ion-radio-group v-model="CodArticulo" @ionChange="handelArticulo()" checked="false" >     
          <ion-row>
            <ion-col>
              <ion-item  v-for="articulo in results" v-bind:key="articulo.iD_RM_StockRemitos_Articulos"> 
                <ion-label class="labelCont">              
                 <ion-label class="desc">{{ articulo.descripcion }}</ion-label>
                 <ion-label class="articulo">Código:{{ articulo.idArticulo }}</ion-label>
                 <ion-label class="cantidad">Cant:{{ articulo.cantidad }}</ion-label> 
                 
                 <ion-label class="cantidad">Id:{{ articulo.iD_RM_StockRemitos_Articulos }}</ion-label> 
                </ion-label>  
                <ion-radio slot="start" :value="articulo.iD_RM_StockRemitos_Articulos"></ion-radio>         
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
    IonButton,
    loadingController    
    
  } from '@ionic/vue';
  
import { defineComponent } from "vue";
import axios from "axios";
import { continueStatement } from '@babel/types';
const API_URL = "http://9.39.252.247:6181/api";
//const API_URL = "http://localhost:3164/api";


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
        results:[{idArticulo:"",descripcion:"",cantidad:"", fecha_Ingreso:"", iD_RM_StockRemitos_Articulos:""}],       

        CodArticulo:-1,   
        NombreSucursal:"",

        objSucursal:{nombre:"",codigo:""},
        remito:"",
        lstArticulos:[{idArticulo:"",descripcion:"",cantidad:"",fecha_Ingreso:"", iD_RM_StockRemitos_Articulos:""}],
        codSucursal: localStorage.CodSucursal,
        focus:false,
        idArticulo:"",
        objArticulo:{descripcion:"",idArticulo:"", cantidad:"",codigoBarra:"" ,fecha_Ingreso:"",edit:"", iD_RM_StockRemitos_Articulos:""},

        timeout: 1000,
        data:[{idArticulo:"",descripcion:"",cantidad:"",fecha_Ingreso:""}],
        show:"ok",

        suma:0,
       
        }; 
  },

  mounted() {
       this.remito=String(this.$route.query.codRemito)
       this.presentLoadingArticulos();       
       //setInterval(this.CargarTodosLosArticulosRemito,1000,this.remito);
       //this.CargarTodosLosArticulosRemito(this.remito);
       this.TotalArticulos();
       this.suma=0;
       
    },  
  
    

  methods: { 
    async presentLoadingSalvarRemito() {  
        const loading = await loadingController
          .create({
            cssClass: 'my-custom-class',
            message: 'Guardando artículo...',
            duration: this.timeout,            
          });
        await loading.present();
        await this.salvarRemito(this.remito,this.lstArticulos); 
       
       
        if(this.data.length>1){
                
                loading.dismiss();
                this.data=[];
            }  
            if(this.data.length===1){              
              this.AlertCustomLoading();
              loading.dismiss();
              this.data=[];
            }
        
      }, 
 
    async presentLoadingEnviarRemito() {
        const loading = await loadingController
          .create({
            cssClass: 'my-custom-class',
            message: 'Enviando Remito...',
            duration: this.timeout,            
          });
        await loading.present();
      
      setTimeout(() => {
        this.EnviarRemito();       
      }, this.timeout);

      setTimeout(function() {
          loading.dismiss()
        }, this.timeout);

        
      }, 

    async presentLoadingArticulos() {
      this.suma=0;
        const loading = await loadingController
          .create({
            cssClass: 'my-custom-class',
            message: 'Cargando artículo...',                     
          });
        await loading.present();
        await this.CargarTodosLosArticulosRemito(this.remito);  

        setTimeout(() => {
         
            this.TotalArticulos();
         
            loading.dismiss();
      }, 1000);
        
      }, 

      TotalArticulos(){
         //Contar los articulos 
         this.suma=0;
       for (let i = 0; i< this.results.length; i++) {
          this.suma+=parseInt(this.results[i].cantidad);
        }    
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
                  this.presentLoadingArticulos();
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
   

    handelArticulo(){  
        
      this.presentLoadingRadios();
    },  

      
      
    async presentLoadingRadios() {
        const loading = await loadingController
          .create({
            cssClass: 'my-custom-class',
            message: 'Cargando artículo...'
                       
          });
        await loading.present();
      
      setTimeout(() => {
        this.ValorRadio();          
        loading.dismiss()   
      },1000);

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
                  //this.EnviarRemito();
                  this.presentLoadingEnviarRemito();
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
          if(this.results[i].iD_RM_StockRemitos_Articulos===localStorage.CodArticulo){
            this.objArticulo.idArticulo=this.results[i].idArticulo;
            this.objArticulo.descripcion=this.results[i].descripcion;
            this.objArticulo.cantidad=this.results[i].cantidad;
            this.objArticulo.fecha_Ingreso=this.results[i].fecha_Ingreso;
            this.objArticulo.iD_RM_StockRemitos_Articulos=this.results[i].iD_RM_StockRemitos_Articulos;
            this.objArticulo.edit="true";
            break;
          }
        }
        this.PresentAlertPromptArticulo(this.objArticulo);  
            
    },

   salvarRemito(idremito: string, articulos: any[]) {     
     axios.put( API_URL+"/admon/save_rm_remito?remito="+idremito+"", articulos)
        .then((response) => {  
         response.data;
        })
        .catch((error) => console.log(error));
        
    },
  
    async EnviarRemito() {              
      await axios.post(API_URL+"/admon/enviar_remito?remito="+this.remito+"")
        .then((response) => {          
       
         this.$router.push({path:'/home',query: { sucursal: localStorage.nombre, CodSucursal:localStorage.CodSucursal}});
        })
        .catch((error) => console.log(error));
    },

    async CargarArticulosPorCodRemitoYCodSucursal(){
      await axios.get(API_URL+"/admon/get_rm_remito?remito="+this.remito +"&sucursal="+this.codSucursal+"")
        .then((response) => {          
          this.lstArticulos= response.data;
          this.results=this.lstArticulos;
          console.log(this.results);
        }).catch((error) => console.log(error));

    },  
    
     CargarTodosLosArticulosRemito(remito:string) {  
    
       axios.get(API_URL+"/admon/get_articles_por_remito?remito="+remito+"")
        .then((response) => {          
          this.lstArticulos= response.data;
          this.results=this.lstArticulos;               
          this.data= response.data;
        })
        .catch((error) => console.log(error));
    }, 
    OnFocus(){
      this.focusBuscar=true;     
      
    }, 
 
    
  async BuscarArticulo(){    
    if (this.idArticulo!=="" && this.focusBuscar) { 

      this.CargarTodosLosArticulosRemito(this.remito);
       await axios.get(API_URL+"/admon/get_search_articles?articulo="+this.idArticulo+"")
        .then((response) => {
          this.objArticulo=response.data[0];
          if(this.objArticulo.idArticulo==null){
            this.Alert();  
            this.idArticulo="";          
          }
          if(this.objArticulo.idArticulo!=null){
            this.PresentAlertPromptArticulo(this.objArticulo);
          }
        })
        .catch((error) => this.Alert()); 
        
      }
    },
    async EditarArticulo(idArticulo:string){       
    if (this.idArticulo) { 

      this.CargarTodosLosArticulosRemito(this.remito);          
       await axios.get(API_URL+"/admon/get_search_articles?articulo="+this.idArticulo+"")
        .then((response) => {
          this.objArticulo=response.data[0];
          if(this.objArticulo.idArticulo==null){
            this.Alert();  
            this.idArticulo="";          
          }
          if(this.objArticulo.idArticulo!=null){
            this.PresentAlertPromptArticulo(this.objArticulo);
          }
        })
        .catch((error) => this.Alert()); 
        
      }
    },

  remove:function(i:any){
     this.lstArticulos.splice(i,1)
    },
    async Alert() {
      const a=await alertController
        .create({
          header: '¡Upsss!',
          message: 'No se encontro el artículo!',
          buttons: ['OK'],
        });
      return await a.present();
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
            {//Eliminar
              text: 'Eliminar',
              role: 'Eliminar',
              cssClass: 'alert-button-delete',              
              handler: () => {                
                for (let i = 0; i < this.lstArticulos.length; i++) 
                  {
                    if(this.lstArticulos[i].iD_RM_StockRemitos_Articulos==obj.iD_RM_StockRemitos_Articulos)
                      {
                        this.remove(i);                    
                        break;
                      }                
                  }

                //Insertar la lista de elementos
              
                axios.put( API_URL+"/admon/delete_articulo?Id="+obj.iD_RM_StockRemitos_Articulos+"")
                  .then((response) => {  
                    //  axios.get(API_URL+"/admon/get_rm_remito_articles?remito="+this.remito+"")
                    //       .then((response) => {                  
                    //         this.lstArticulos= response.data;
                    //         this.results=this.lstArticulos;                 
                    //         this.data= response.data;                  
                    //     }) 
                }).catch((error) => console.log(error));
                           
              },
            },
            
            {//Guardar
              text: 'Guardar',
              cssClass: 'alert-button-guardar',
              handler: (alertData) => {                         
                obj.cantidad=alertData.Cantidad; 

              
              if(obj.edit=="true")//Modificar
              {                      
                  for (let i = 0; i < this.lstArticulos.length; i++) 
                  {                  
                    if(this.lstArticulos[i].iD_RM_StockRemitos_Articulos==obj.iD_RM_StockRemitos_Articulos)
                    {
                      this.lstArticulos[i].cantidad=obj.cantidad;
                      break;
                    }                  
                  }
                
              
                  //Insertar la lista de elementos
                  axios.put(API_URL+"/admon/update_articulo?Id="+ obj.iD_RM_StockRemitos_Articulos+"&"+"Cantidad="+obj.cantidad)
                    .then((response) => {  
                      //Cargar todos los artículos por remito
                         axios.get(API_URL+"/admon/get_articles_por_remito?remito="+this.remito+"")
                          .then((response) => {                  
                            this.lstArticulos= response.data;
                            this.results=this.lstArticulos;                 
                            this.data= response.data;                  
                        }) 
                  }).catch((error) => console.log(error));
                 
                }
                  else //Guardar
                  { 

                    this.lstArticulos.push(obj);                   
                    //Insertar la lista de elementos                 
                    axios.post( API_URL+"/admon/insertar_articulo_remito?remito="+this.remito+"&Id="+ obj.idArticulo+"&Cantidad="+obj.cantidad)
                      .then((response) => {  

                        axios.get(API_URL+"/admon/get_articles_por_remito?remito="+this.remito+"")
                          .then((response) => {                                            
                            this.lstArticulos= response.data;
                            this.results=this.lstArticulos;                 
                            this.data= response.data;                            
                            })                           
                    })
                    .catch((error) => console.log(error));                    
                   
                  }
                  
                  this.idArticulo="";
                  this.focusBuscar=false;
                  
                  
                  // window.location.reload();
                  // this.$router.push("/productos?codRemito=test50");
                  
                  //Actualiza la variable suma
                
                  this.TotalArticulos();
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
  .sucursal{
    margin-left:100px !important;
    
  }
  #footer
  {
      display: block !important;
      text-align: center;
      position:absolute;
      margin-top: 145%;
      background-color: transparent;
      
  }



    

</style>