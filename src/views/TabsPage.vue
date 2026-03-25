<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="people" />
          <ion-label>Personajes</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="gameController" />
          <ion-label>Juegos</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon aria-hidden="true" :icon="library" />
          <ion-label>Lore</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { people, gameController, library } from 'ionicons/icons';
</script>

<style scoped>
ion-tab-bar {
  --background: rgba(9, 14, 11, 0.92);
  border-top: 1px solid rgba(144, 196, 140, 0.35);
  backdrop-filter: blur(8px);
}

ion-tab-button {
  --color: #95a492;
  --color-selected: #c7f2c5;
  font-family: 'Oxanium', sans-serif;
  letter-spacing: 0.04em;
}
</style>
