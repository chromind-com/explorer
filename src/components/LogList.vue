<!-- src/components/LogList.vue -->
<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold mb-4 bg-gradient-to-r from-custom-purple to-[#ca67b7] text-transparent bg-clip-text">
        Address Details
      </h2>
      <p class="text-gray-300">{{ address }}</p>
    </div>

    <!-- Loading and Error States -->
    <div v-if="isLoading" class="text-center text-custom-purple">Loading logs...</div>
    <div v-if="error" class="text-center text-[#fdb3c2]">{{ error }}</div>

    <!-- Logs Container -->
    <div v-if="!isLoading && !error" class="space-y-6">
      <div v-for="log in logs" 
           :key="log.uuid" 
           class="bg-[#3a3750]/30 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-all">
        <!-- Timestamp -->
        <div class="text-custom-purple text-sm mb-3">
          {{ formatTimestamp(log.created_at) }}
        </div>

        <!-- UUID Section -->
        <div class="mb-4">
          <span class="text-gray-300">UUID: </span>
          <router-link 
            :to="`/log/${log.uuid}`" 
            class="text-[#ca67b7] hover:text-[#fdb3c2] transition-colors"
          >
            {{ log.uuid }}
          </router-link>
        </div>

        <!-- Messages -->
        <div class="space-y-4">
          <div v-for="(message, index) in JSON.parse(log.request_messages)"
               :key="index"
               :class="[
                 'flex items-start gap-3',
                 message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
               ]">
            <span class="text-2xl flex-shrink-0">
              {{ message.role === 'user' ? '👱‍♂️' : '🤖' }}
            </span>
            <div :class="[
              'px-4 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap break-words',
              message.role === 'user' ? 'bg-[#6a5acd]' : 'bg-[#4b3f68]'
            ]">
              {{ message.content }}
            </div>
          </div>
          
          <!-- Assistant Reply -->
          <div class="flex items-start gap-3">
            <span class="text-2xl">🤖</span>
            <div class="bg-[#4b3f68] px-4 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap break-words">
              {{ log.assistant_reply }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getClient } from '../chromia';

export default {
  name: 'LogList',
  props: {
    address: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      logs: [],
      message: 'Chromind  Explorer',
      isLoading: true,
      error: null,
    };
  },
  methods: {
    formatTimestamp(timestamp) {
      if (!timestamp) return 'N/A';
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    async fetchLogs() {
      try {
        const client = await getClient();
        const result = await client.query({
          name: 'get_logs',
          args: {
            address: this.address,
            start_time: 0,
            end_time: Date.now(),
            pointer: 0,
            n_prompts: 10,
          },
        });

        if (result.logs && Array.isArray(result.logs)) {
          this.logs = result.logs;
        } else {
          throw new Error('Invalid data format received from the client.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        this.error = 'Failed to load logs. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchLogs();
  },
};
</script>