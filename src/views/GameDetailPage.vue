<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/juegos"></ion-back-button>
        </ion-buttons>
        <ion-title>Ficha de Juego</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="loading" class="state-container">
        <ion-spinner></ion-spinner>
        <p>Cargando ficha...</p>
      </div>

      <div v-else-if="!game" class="state-container">
        <p>No se encontro el juego.</p>
      </div>

      <section v-else class="detail-wrapper">
        <EntityImage class="hero-image" entityType="games" :name="game.name" :fallback-url="game.imageUrl" :alt="game.name" />
        <h1>{{ game.name }}</h1>
        <p class="muted">Lanzamiento: {{ game.releaseYear }}</p>

        <ion-list inset>
          <ion-item>
            <ion-label>
              <h3>Plataformas</h3>
              <p>{{ game.platforms }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <h3>Sinopsis</h3>
              <p>{{ game.synopsis }}</p>
            </ion-label>
          </ion-item>
          <ion-item v-if="game.videoUrl">
            <ion-label>
              <h3>Video</h3>
              <p>{{ game.videoUrl }}</p>
            </ion-label>
          </ion-item>
          <ion-item v-if="relatedCharacters.length > 0">
            <ion-label>
              <h3>Personajes relacionados</h3>
            </ion-label>
          </ion-item>
          <ion-item
            v-for="character in relatedCharacters"
            :key="`game-char-${character.id}`"
            button
            :router-link="`/personajes/${character.id}`"
          >
            <ion-label>
              <p>{{ character.name }}</p>
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
import { gameService, type Game } from '@/services/gameService';
import { characterService, type Character } from '@/services/characterService';
import EntityImage from '@/components/EntityImage.vue';
import { recentlyViewedService } from '@/services/recentlyViewedService';

const route = useRoute();
const loading = ref(true);
const game = ref<Game | null>(null);
const relatedCharacters = ref<Character[]>([]);

onMounted(async () => {
  const id = Number(route.params.id);
  if (!Number.isFinite(id)) {
    loading.value = false;
    return;
  }

  try {
    game.value = await gameService.getById(id);
    if (game.value) {
      await recentlyViewedService.add({
        id: game.value.id ?? id,
        name: game.value.name,
        path: `/juegos/${id}`,
        entity: 'juegos',
      });
    }

    const characters = await characterService.getAll();
    relatedCharacters.value = characters.filter((character) =>
      (character.appearances || []).some((appearance) => appearance.id === id)
    );
  } catch {
    game.value = null;
    relatedCharacters.value = [];
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
