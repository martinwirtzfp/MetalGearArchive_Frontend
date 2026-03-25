<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/organizaciones"></ion-back-button>
        </ion-buttons>
        <ion-title>Ficha de Organizacion</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="loading" class="state-container">
        <ion-spinner></ion-spinner>
        <p>Cargando ficha...</p>
      </div>

      <div v-else-if="!organization" class="state-container">
        <p>No se encontro la organizacion.</p>
      </div>

      <section v-else class="detail-wrapper">
        <EntityImage class="hero-image" entityType="organizations" :name="organization.name" :fallback-url="organization.imageUrl" :alt="organization.name" />
        <h1>{{ organization.name }}</h1>
        <p class="muted">{{ organization.type }}</p>

        <ion-list inset>
          <ion-item>
            <ion-label>
              <h3>Cuartel General</h3>
              <p>{{ organization.headquarters || 'No especificado' }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h3>Descripcion</h3>
              <p>{{ organization.description }}</p>
            </ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label>
              <h3>Relaciones</h3>
              <p>Esta entidad aun no tiene relaciones cruzadas modeladas en el backend.</p>
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
import { organizationService, type Organization } from '@/services/organizationService';
import EntityImage from '@/components/EntityImage.vue';
import { recentlyViewedService } from '@/services/recentlyViewedService';

const route = useRoute();
const loading = ref(true);
const organization = ref<Organization | null>(null);

onMounted(async () => {
  const id = Number(route.params.id);
  if (!Number.isFinite(id)) {
    loading.value = false;
    return;
  }

  try {
    organization.value = await organizationService.getById(id);
    if (organization.value) {
      await recentlyViewedService.add({
        id: organization.value.id ?? id,
        name: organization.value.name,
        path: `/organizaciones/${id}`,
        entity: 'organizaciones',
      });
    }
  } catch {
    organization.value = null;
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
