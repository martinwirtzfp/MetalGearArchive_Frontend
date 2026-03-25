<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/lugares"></ion-back-button>
        </ion-buttons>
        <ion-title>Ficha de Lugar</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="loading" class="state-container">
        <ion-spinner></ion-spinner>
        <p>Cargando ficha...</p>
      </div>

      <div v-else-if="!locationItem" class="state-container">
        <p>No se encontro el lugar.</p>
      </div>

      <section v-else class="detail-wrapper">
        <EntityImage class="hero-image" entityType="locations" :name="locationItem.name" :fallback-url="locationItem.imageUrl" :alt="locationItem.name" />
        <h1>{{ locationItem.name }}</h1>
        <p class="muted">{{ locationItem.region }}</p>

        <ion-list inset>
          <ion-item>
            <ion-label>
              <h3>Descripcion</h3>
              <p>{{ locationItem.description }}</p>
            </ion-label>
          </ion-item>
          <ion-item v-if="locationItem.coordinates">
            <ion-label>
              <h3>Coordenadas</h3>
              <p>{{ locationItem.coordinates }}</p>
            </ion-label>
          </ion-item>
          <ion-item v-if="relatedEvents.length > 0">
            <ion-label>
              <h3>Eventos relacionados</h3>
            </ion-label>
          </ion-item>
          <ion-item
            v-for="eventItem in relatedEvents"
            :key="`location-event-${eventItem.id}`"
            button
            :router-link="`/eventos/${eventItem.id}`"
          >
            <ion-label>
              <p>{{ eventItem.name }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      </section>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { locationService, type Location } from '@/services/locationService';
import { eventService, type Event } from '@/services/eventService';
import EntityImage from '@/components/EntityImage.vue';
import { recentlyViewedService } from '@/services/recentlyViewedService';

const route = useRoute();
const loading = ref(true);
const locationItem = ref<Location | null>(null);
const relatedEvents = ref<Event[]>([]);

onMounted(async () => {
  const id = Number(route.params.id);
  if (!Number.isFinite(id)) {
    loading.value = false;
    return;
  }

  try {
    locationItem.value = await locationService.getById(id);
    if (locationItem.value) {
      await recentlyViewedService.add({
        id: locationItem.value.id ?? id,
        name: locationItem.value.name,
        path: `/lugares/${id}`,
        entity: 'lugares',
      });
    }

    const events = await eventService.getAll();
    relatedEvents.value = events.filter((eventItem) => eventItem.location?.id === id);
  } catch {
    locationItem.value = null;
    relatedEvents.value = [];
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.state-container {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.detail-wrapper {
  padding: 16px;
}

.hero-image {
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}

h1 {
  margin: 0;
}

.muted {
  margin-top: 8px;
  color: #8ea08e;
}
</style>
