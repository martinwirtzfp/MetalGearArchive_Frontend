<template>
  <img :src="src" :alt="alt" @error="handleError" loading="lazy" decoding="async" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { slugify } from '@/utils/slugify';

const props = defineProps<{
  entityType: 'characters' | 'games' | 'events' | 'locations' | 'organizations';
  name: string;
  alt: string;
  fallbackUrl?: string;
}>();

const slug = computed(() => slugify(props.name));

const localUrl = computed(() => `/images/${props.entityType}/${slug.value}.webp`);
const placeholder = computed(
  () =>
    `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"480\" height=\"320\"><rect width=\"100%\" height=\"100%\" fill=\"#1a241d\"/><text x=\"50%\" y=\"50%\" fill=\"#b5c8af\" font-size=\"20\" text-anchor=\"middle\" dominant-baseline=\"middle\" font-family=\"sans-serif\">${props.name}</text></svg>`)}`
);

const src = ref(localUrl.value);

const handleError = () => {
  if (src.value !== props.fallbackUrl && props.fallbackUrl) {
    src.value = props.fallbackUrl;
    return;
  }

  if (src.value !== placeholder.value) {
    src.value = placeholder.value;
  }
};
</script>
