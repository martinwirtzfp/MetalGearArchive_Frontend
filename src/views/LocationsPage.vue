<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/menu"></ion-back-button>
        </ion-buttons>
        <ion-title>Lugares</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-if="errorMessage" class="error-container">
        <p>{{ errorMessage }}</p>
        <ion-button size="small" fill="outline" @click="loadLocations">Reintentar</ion-button>
      </div>

      <div v-if="loading" class="loading-container">
        <ion-spinner></ion-spinner>
        <p>Cargando lugares...</p>
      </div>

      <div v-else-if="locations.length === 0" class="empty-container">
        <p>No hay lugares disponibles</p>
      </div>

      <ion-list v-else>
        <ion-item v-for="place in locations" :key="place.id" button :router-link="`/lugares/${place.id}`">
          <ion-thumbnail slot="start">
            <EntityImage
              entityType="locations"
              :name="place.name"
              :fallback-url="place.imageUrl"
              :alt="place.name"
            />
          </ion-thumbnail>
          <ion-label>
            <h2>{{ place.name }}</h2>
            <p>{{ place.region }}</p>
            <p class="secondary">{{ place.description.substring(0, 62) }}...</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonButton,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { locationService, type Location } from '@/services/locationService';
import EntityImage from '@/components/EntityImage.vue';
import { getNetworkErrorMessage } from '@/services/networkError';

const locations = ref<Location[]>([]);
const loading = ref(true);
const errorMessage = ref('');

const loadLocations = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    locations.value = await locationService.getAll();
  } catch (error) {
    errorMessage.value = getNetworkErrorMessage(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadLocations();
});
</script>

<style scoped>
.error-container {
  margin: 10px 12px;
  border: 1px solid rgba(255, 180, 120, 0.45);
  background: rgba(42, 24, 13, 0.45);
  border-radius: 10px;
  padding: 10px;
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 1rem;
  color: #666;
}

.secondary {
  font-size: 0.9rem;
  color: #999;
}
</style>
