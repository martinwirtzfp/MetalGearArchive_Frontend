<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/personajes"></ion-back-button>
        </ion-buttons>
        <ion-title>Ficha de Personaje</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="loading" class="state-container">
        <ion-spinner></ion-spinner>
        <p>Cargando ficha...</p>
      </div>

      <div v-else-if="!character" class="state-container">
        <p>No se encontro el personaje.</p>
      </div>

      <section v-else class="detail-wrapper">
        <EntityImage class="hero-image" entityType="characters" :name="character.name" :fallback-url="character.imageUrl" :alt="character.name" />
        <h1>{{ character.name }}</h1>
        <p class="muted">{{ character.role }} · {{ character.nationality }}</p>

        <ion-list inset>
          <ion-item>
            <ion-label>
              <h3>Edad</h3>
              <p>{{ character.age }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h3>Genero</h3>
              <p>{{ character.gender }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h3>Descripcion</h3>
              <p>{{ character.description }}</p>
            </ion-label>
          </ion-item>
          <ion-item v-if="character.appearances && character.appearances.length > 0">
            <ion-label>
              <h3>Juegos relacionados</h3>
            </ion-label>
          </ion-item>
          <ion-item
            v-for="game in character.appearances || []"
            :key="`char-game-${game.id}`"
            button
            :router-link="`/juegos/${game.id}`"
          >
            <ion-label>
              <p>{{ game.name }}</p>
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
import { characterService, type Character } from '@/services/characterService';
import EntityImage from '@/components/EntityImage.vue';
import { recentlyViewedService } from '@/services/recentlyViewedService';

const route = useRoute();
const loading = ref(true);
const character = ref<Character | null>(null);

onMounted(async () => {
  const id = Number(route.params.id);
  if (!Number.isFinite(id)) {
    loading.value = false;
    return;
  }

  try {
    character.value = await characterService.getById(id);
    if (character.value) {
      await recentlyViewedService.add({
        id: character.value.id ?? id,
        name: character.value.name,
        path: `/personajes/${id}`,
        entity: 'personajes',
      });
    }
  } catch {
    character.value = null;
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
