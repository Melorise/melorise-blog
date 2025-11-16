<script setup lang="ts">
const props = defineProps<{
  category?: string;
  filters?: Array<{ key: string; value: string }>;
  limit?: number;
}>();
</script>