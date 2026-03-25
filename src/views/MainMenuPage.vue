<template>
  <ion-page>
    <ion-content class="menu-content" :fullscreen="true">
      <div class="atmosphere-grid"></div>
      <div class="atmosphere-scan"></div>

      <section class="hero">
        <p class="label">Sistema Tactico de Inteligencia</p>
        <h1>METAL GEAR ARCHIVE</h1>
        <p class="subtitle">Terminal de inteligencia clasificada para consultar operaciones, actores clave y eventos historicos.</p>

        <div class="status-line">
          <span class="status-dot" :class="backendStatus"></span>
          <span>Backend {{ backendStatusLabel }}</span>
          <span class="separator">|</span>
          <span>{{ now }}</span>
        </div>
      </section>

      <section class="recent-panel" v-if="recentItems.length > 0">
        <h3>Ultimos elementos vistos</h3>
        <button
          v-for="item in recentItems"
          :key="`${item.entity}-${item.id}`"
          class="recent-item"
          @click="goTo(item.path)"
        >
          <span>{{ item.name }}</span>
          <small>{{ item.entity }}</small>
        </button>
      </section>

      <section class="module-grid">
        <button
          v-for="module in modules"
          :key="module.title"
          class="module-card"
          @click="goTo(module.path)"
        >
          <div class="card-head">
            <ion-icon :icon="module.icon" aria-hidden="true" />
            <span>{{ module.code }}</span>
          </div>
          <h2>{{ module.title }}</h2>
          <p>{{ module.description }}</p>
        </button>
      </section>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonContent, IonIcon, IonPage } from '@ionic/vue';
import { business, location, people, library, gameController } from 'ionicons/icons';
import apiClient from '@/services/api';
import { recentlyViewedService, type RecentlyViewedItem } from '@/services/recentlyViewedService';

const router = useRouter();
const backendStatus = ref<'online' | 'offline'>('offline');
const now = ref('');
const recentItems = ref<RecentlyViewedItem[]>([]);
let timer: ReturnType<typeof setInterval> | undefined;

const modules = [
  {
    title: 'Personajes',
    code: 'CHR-01',
    description: 'Operativos legendarios, perfiles y alianzas a lo largo de la cronologia.',
    path: '/personajes',
    icon: people,
  },
  {
    title: 'Juegos',
    code: 'OPS-02',
    description: 'Operaciones cronologicas y plataformas dentro del universo Metal Gear.',
    path: '/juegos',
    icon: gameController,
  },
  {
    title: 'Lore / Eventos',
    code: 'EVT-03',
    description: 'Incidentes clave, nombres en clave y consecuencias que cambiaron el mundo.',
    path: '/eventos',
    icon: library,
  },
  {
    title: 'Lugares',
    code: 'LOC-04',
    description: 'Ubicaciones estrategicas y zonas de conflicto mapeadas para consulta rapida.',
    path: '/lugares',
    icon: location,
  },
  {
    title: 'Organizaciones',
    code: 'ORG-05',
    description: 'Grupos militares, agencias y cadenas de mando.',
    path: '/organizaciones',
    icon: business,
  },
];

const backendStatusLabel = computed(() => (backendStatus.value === 'online' ? 'EN LINEA' : 'DESCONECTADO'));

const syncClock = () => {
  now.value = new Date().toLocaleString();
};

const checkBackendStatus = async () => {
  try {
    await apiClient.get('/characters');
    backendStatus.value = 'online';
  } catch {
    backendStatus.value = 'offline';
  }
};

const goTo = (path: string) => {
  router.push(path);
};

onMounted(async () => {
  syncClock();
  await checkBackendStatus();
  recentItems.value = (await recentlyViewedService.list()).slice(0, 6);
  timer = setInterval(syncClock, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.menu-content {
  --background: radial-gradient(circle at 15% 20%, #314e3a 0%, #131a17 38%, #090d0b 100%);
  color: #e7efd8;
  position: relative;
  overflow: hidden;
}

.atmosphere-grid,
.atmosphere-scan {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.atmosphere-grid {
  background-image: linear-gradient(rgba(115, 173, 121, 0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(115, 173, 121, 0.11) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.24;
}

.atmosphere-scan {
  background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0 2px, rgba(0, 0, 0, 0) 2px 5px);
  mix-blend-mode: screen;
  animation: drift 9s linear infinite;
}

.hero {
  position: relative;
  z-index: 1;
  padding: 32px 20px 22px;
}

.label {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.19em;
  font-size: 0.68rem;
  color: #acbe99;
}

h1 {
  margin: 8px 0 12px;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.08em;
  font-size: clamp(1.9rem, 6vw, 2.8rem);
  text-shadow: 0 0 8px rgba(146, 241, 171, 0.4);
}

.subtitle {
  margin: 0;
  max-width: 720px;
  color: #c4d4b5;
  line-height: 1.4;
}

.status-line {
  margin-top: 18px;
  font-size: 0.8rem;
  display: flex;
  gap: 8px;
  align-items: center;
  color: #c6cfc0;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.online {
  background: #6cff97;
  box-shadow: 0 0 10px #6cff97;
}

.status-dot.offline {
  background: #ffc46c;
  box-shadow: 0 0 10px #ffc46c;
}

.separator {
  opacity: 0.55;
}

.module-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  padding: 0 20px 24px;
}

.module-card {
  background: linear-gradient(158deg, rgba(58, 75, 62, 0.82), rgba(19, 24, 21, 0.94));
  border: 1px solid rgba(162, 238, 167, 0.34);
  border-radius: 14px;
  color: #e8efd8;
  text-align: left;
  padding: 14px;
  min-height: 172px;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}

.module-card:active,
.module-card:hover {
  transform: translateY(-3px);
  border-color: rgba(202, 255, 194, 0.76);
  box-shadow: 0 0 22px rgba(100, 183, 114, 0.28);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #a8c997;
  font-family: 'Oxanium', sans-serif;
  letter-spacing: 0.05em;
}

.card-head ion-icon {
  font-size: 1.24rem;
}

.module-card h2 {
  margin: 14px 0 8px;
  font-family: 'Oxanium', sans-serif;
  letter-spacing: 0.04em;
}

.module-card p {
  margin: 0;
  color: #c7d4be;
  line-height: 1.35;
}

.recent-panel {
  position: relative;
  z-index: 1;
  padding: 0 20px 22px;
}

.recent-panel h3 {
  margin: 0 0 10px;
  font-family: 'Oxanium', sans-serif;
  color: #c6d9bb;
}

.recent-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(146, 205, 151, 0.32);
  background: rgba(16, 24, 20, 0.78);
  color: #d7e6d0;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  text-align: left;
}

.recent-item small {
  opacity: 0.8;
  text-transform: capitalize;
}

@media (max-width: 640px) {
  .hero {
    padding: 22px 14px 16px;
  }

  .module-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0 14px 18px;
  }

  .module-card {
    min-height: 146px;
    padding: 12px;
  }

  .status-line {
    flex-wrap: wrap;
    row-gap: 3px;
  }
}

@keyframes drift {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(12px);
  }
}
</style>
