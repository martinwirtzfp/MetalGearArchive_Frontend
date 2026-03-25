<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/menu"></ion-back-button>
        </ion-buttons>
        <ion-title>Eventos</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Eventos</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="errorMessage" class="error-container">
        <p>{{ errorMessage }}</p>
        <ion-button size="small" fill="outline" @click="loadEvents">Reintentar</ion-button>
      </div>

      <div v-if="loading" class="loading-container">
        <ion-spinner></ion-spinner>
        <p>Cargando eventos...</p>
      </div>

      <div v-else-if="events.length === 0" class="empty-container">
        <p>No hay eventos disponibles</p>
      </div>

      <ion-list v-else>
        <ion-item v-for="event in events" :key="event.id" button :router-link="`/eventos/${event.id}`">
          <ion-thumbnail slot="start">
            <EntityImage
              entityType="events"
              :name="event.name"
              :fallback-url="event.imageUrl"
              :alt="event.name"
            />
          </ion-thumbnail>
          <ion-label>
            <h2>{{ event.name }}</h2>
            <p>{{ event.codeName }} ({{ event.eventYear }})</p>
            <p class="secondary">{{ event.description.substring(0, 50) }}...</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonSpinner, IonButtons, IonBackButton, IonButton } from '@ionic/vue';
import { eventService, type Event } from '@/services/eventService';
import EntityImage from '@/components/EntityImage.vue';
import { getNetworkErrorMessage } from '@/services/networkError';

const events = ref<Event[]>([]);
const loading = ref(true);
const errorMessage = ref('');

const loadEvents = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    events.value = await eventService.getAll();
  } catch (error) {
    errorMessage.value = getNetworkErrorMessage(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadEvents();
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
