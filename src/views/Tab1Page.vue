<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/menu"></ion-back-button>
        </ion-buttons>
        <ion-title>Personajes</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Personajes</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="tools">
        <ion-searchbar v-model="searchQuery" placeholder="Filtrar por nombre o rol"></ion-searchbar>
        <ion-button size="small" fill="outline" @click="loadCharacters">Recargar</ion-button>
        <ion-button size="small" @click="createDemoCharacter">Crear demo</ion-button>
      </div>

      <div v-if="errorMessage" class="error-container">
        <p>{{ errorMessage }}</p>
        <ion-button size="small" fill="outline" @click="loadCharacters">Reintentar</ion-button>
      </div>

      <div v-if="loading" class="loading-container">
        <ion-spinner></ion-spinner>
        <p>Cargando personajes...</p>
      </div>

      <div v-else-if="filteredCharacters.length === 0" class="empty-container">
        <p>No hay personajes disponibles</p>
      </div>

      <ion-list v-else>
        <ion-item v-for="character in filteredCharacters" :key="character.id" button :router-link="`/personajes/${character.id}`">
          <ion-avatar slot="start">
            <EntityImage
              entityType="characters"
              :name="character.name"
              :fallback-url="character.imageUrl"
              :alt="character.name"
            />
          </ion-avatar>
          <ion-label>
            <h2>{{ character.name }}</h2>
            <p>{{ character.role }}</p>
            <p class="secondary">{{ character.nationality }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonAvatar, IonSpinner, IonButtons, IonBackButton, IonSearchbar, IonButton } from '@ionic/vue';
import { characterService, type Character } from '@/services/characterService';
import EntityImage from '@/components/EntityImage.vue';
import { getNetworkErrorMessage } from '@/services/networkError';

const characters = ref<Character[]>([]);
const loading = ref(true);
const errorMessage = ref('');
const searchQuery = ref('');

const filteredCharacters = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return characters.value;
  }

  return characters.value.filter((character) =>
    `${character.name} ${character.role}`.toLowerCase().includes(query)
  );
});

const loadCharacters = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    characters.value = await characterService.getAll();
  } catch (error) {
    errorMessage.value = getNetworkErrorMessage(error);
  } finally {
    loading.value = false;
  }
};

const createDemoCharacter = async () => {
  errorMessage.value = '';
  const suffix = Date.now().toString().slice(-4);

  try {
    await characterService.create({
      name: `Operativo Demo ${suffix}`,
      role: 'Support',
      nationality: 'Unknown',
      age: 'Unknown',
      gender: 'Unknown',
      description: 'Registro de prueba para validar envio de datos.',
      imageUrl: 'https://via.placeholder.com/300x200?text=Demo',
      appearances: [],
    });
    await loadCharacters();
  } catch (error) {
    errorMessage.value = getNetworkErrorMessage(error);
  }
};

onMounted(async () => {
  await loadCharacters();
});
</script>

<style scoped>
.tools {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  padding: 8px 12px;
  align-items: center;
}

.error-container {
  margin: 0 12px 10px;
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
