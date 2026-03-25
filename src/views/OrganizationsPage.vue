<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/menu"></ion-back-button>
        </ion-buttons>
        <ion-title>Organizaciones</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-if="errorMessage" class="error-container">
        <p>{{ errorMessage }}</p>
        <ion-button size="small" fill="outline" @click="loadOrganizations">Reintentar</ion-button>
      </div>

      <div v-if="loading" class="loading-container">
        <ion-spinner></ion-spinner>
        <p>Cargando organizaciones...</p>
      </div>

      <div v-else-if="organizations.length === 0" class="empty-container">
        <p>No hay organizaciones disponibles</p>
      </div>

      <ion-list v-else>
        <ion-item v-for="organization in organizations" :key="organization.id" button :router-link="`/organizaciones/${organization.id}`">
          <ion-thumbnail slot="start">
            <EntityImage
              entityType="organizations"
              :name="organization.name"
              :fallback-url="organization.imageUrl"
              :alt="organization.name"
            />
          </ion-thumbnail>
          <ion-label>
            <h2>{{ organization.name }}</h2>
            <p>{{ organization.type }}</p>
            <p class="secondary">HQ: {{ organization.headquarters }}</p>
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
import { organizationService, type Organization } from '@/services/organizationService';
import EntityImage from '@/components/EntityImage.vue';
import { getNetworkErrorMessage } from '@/services/networkError';

const organizations = ref<Organization[]>([]);
const loading = ref(true);
const errorMessage = ref('');

const loadOrganizations = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    organizations.value = await organizationService.getAll();
  } catch (error) {
    errorMessage.value = getNetworkErrorMessage(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadOrganizations();
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
