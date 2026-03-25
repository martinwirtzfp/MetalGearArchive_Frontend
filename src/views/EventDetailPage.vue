<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/eventos"></ion-back-button>
        </ion-buttons>
        <ion-title>Ficha de Evento</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="loading" class="state-container">
        <ion-spinner></ion-spinner>
        <p>Cargando ficha...</p>
      </div>

      <div v-else-if="!eventItem" class="state-container">
        <p>No se encontro el evento.</p>
      </div>

      <section v-else class="detail-wrapper">
        <EntityImage class="hero-image" entityType="events" :name="eventItem.name" :fallback-url="eventItem.imageUrl" :alt="eventItem.name" />
        <h1>{{ eventItem.name }}</h1>
        <p class="muted">{{ eventItem.codeName }} · {{ eventItem.eventYear }}</p>

        <ion-list inset>
          <ion-item>
            <ion-label>
              <h3>Descripcion</h3>
              <p>{{ eventItem.description }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h3>Resultado</h3>
              <p>{{ eventItem.outcome || 'No especificado' }}</p>
            </ion-label>
          </ion-item>
          <ion-item v-if="eventItem.location?.name">
            <ion-label>
              <h3>Lugar</h3>
              <p>{{ eventItem.location.name }}</p>
            </ion-label>
          </ion-item>
          <ion-item v-if="eventItem.location?.id" button :router-link="`/lugares/${eventItem.location.id}`">
            <ion-label>
              <p>Ir a ficha del lugar</p>
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
import { eventService, type Event } from '@/services/eventService';
import EntityImage from '@/components/EntityImage.vue';
import { recentlyViewedService } from '@/services/recentlyViewedService';

const route = useRoute();
const loading = ref(true);
const eventItem = ref<Event | null>(null);

onMounted(async () => {
  const id = Number(route.params.id);
  if (!Number.isFinite(id)) {
    loading.value = false;
    return;
  }

  try {
    eventItem.value = await eventService.getById(id);
    if (eventItem.value) {
      await recentlyViewedService.add({
        id: eventItem.value.id ?? id,
        name: eventItem.value.name,
        path: `/eventos/${id}`,
        entity: 'eventos',
      });
    }
  } catch {
    eventItem.value = null;
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
