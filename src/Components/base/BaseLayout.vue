<template>    
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button :default-href="pageDefaultBackLink"></ion-back-button>                       
                </ion-buttons>

                <ion-label slot="cantidad"></ion-label>
                <ion-label slot="Sucursal"></ion-label>
                
                
                <ion-title>{{pageTitle}}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">                       
            <div id="container">                 
                <slot></slot>                    
            </div>
        </ion-content>
    </ion-page>   
</template>

<script lang="ts">
import{
   IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonLabel,
   
}from "@ionic/vue";

export default{
    props: ['pageTitle','pageDefaultBackLink', 'mostrar'],
    components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,  
    IonBackButton,
    IonButtons,
    IonLabel,
    },
    data() {
        return {    
        }; 
  },
}

</script>
