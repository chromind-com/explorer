<template>
  <div class="flex flex-col">
    <div class="mb-8">
      <h2
        class="text-3xl font-bold mb-4 bg-gradient-to-r from-custom-purple to-[#ca67b7] text-transparent bg-clip-text"
      >
        Address Details
      </h2>
      <p class="text-gray-300">{{ address }}</p>
    </div>

    <div v-if="isLoading" class="text-center text-custom-purple">
      <div class="loading-spinner"></div>
      <p class="mt-2">Loading logs...</p>
    </div>
    <div v-if="error" class="text-center text-[#fdb3c2]">{{ error }}</div>

    <div v-if="logs.length === 0 && !isLoading" class="flex flex-col items-center justify-center py-12 px-4">
      <div class="bg-[#3a3750]/30 backdrop-blur-sm rounded-xl p-8 text-center max-w-md">
        <span class="text-5xl mb-4 block">📝</span>
        <h3 class="text-xl font-semibold text-custom-purple mb-2">
          No Chat Logs Found
        </h3>
        <p class="text-gray-300 text-sm">
          This address hasn't generated any chat logs yet. Start a conversation to see your chat history appear here.
        </p>
      </div>
    </div>

    <div v-if="!isLoading && !error" class="space-y-6">
      <div
        v-for="log in logs"
        :key="log.uuid"
        class="bg-[#3a3750]/30 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-all"
      >
        <div class="text-custom-purple text-sm mb-3">
          {{ formatTimestamp(log.created_at) }}
        </div>

        <div class="mb-4">
          <span class="text-gray-300">UUID: </span>
          <router-link
            :to="`/log/${log.uuid}`"
            class="text-[#ca67b7] hover:text-[#fdb3c2] transition-colors"
          >
            {{ log.uuid }}
          </router-link>
        </div>

        <div class="space-y-4">
          <div
            v-for="(message, index) in JSON.parse(log.request_messages)"
            :key="index"
            :class="[
              'flex items-start gap-3',
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row',
            ]"
          >
            <span class="text-2xl flex-shrink-0">
              {{ message.role === "user" ? "👱‍♂️" : "🤖" }}
            </span>
            <div
              :class="[
                'px-4 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap break-words',
                message.role === 'user' ? 'bg-[#6a5acd]' : 'bg-[#4b3f68]',
              ]"
            >
              {{ message.content }}
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="text-2xl">🤖</span>
            <div
              class="bg-[#4b3f68] px-4 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap break-words"
            >
              {{ log.assistant_reply }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoadingMore" class="text-center py-4">
        <div class="loading-spinner"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getClient } from "../chromia";

export default {
  name: "LogList",
  props: {
    address: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      logs: [],
      message: "Chromind Explorer",
      isLoading: true,
      error: null,
      endTime: Date.now(),
      pointer: 0,
      hasMore: true,
      isLoadingMore: false,
      n_prompts: 10,
      startTime: this.$route.query.start_time ? parseInt(this.$route.query.start_time) : 0,
    };
  },
  methods: {
    formatTimestamp(timestamp) {
      if (!timestamp) return "N/A";
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    async handleScroll() {
      const bottomOfWindow = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100;
      
      if (bottomOfWindow && !this.isLoadingMore && this.hasMore) {
        await this.loadMoreLogs();
      }
    },
    
    async loadMoreLogs() {
      if (this.isLoadingMore) return;
      
      this.isLoadingMore = true;
      try {
        const client = await getClient();
        const result = await client.query({
          name: "get_logs",
          args: {
            address: this.address,
            start_time: this.startTime,
            end_time: this.endTime,
            pointer: this.pointer,
            n_prompts: this.n_prompts,  
          },
        });
        
        if (result.logs && Array.isArray(result.logs)) {
          if (result.logs.length < this.n_prompts) {
            this.hasMore = false;
          }
          this.logs = [...this.logs, ...result.logs];
          this.pointer += result.logs.length;
        }
      } catch (err) {
        console.error("Fetch error:", err);
        this.error = "Failed to load more logs. Please try again later.";
      } finally {
        this.isLoadingMore = false;
      }
    },

    async fetchLogs() {
      try {
        const client = await getClient();
        const result = await client.query({
          name: "get_logs",
          args: {
            address: this.address,
            start_time: 0,
            end_time: this.endTime,
            pointer: 0,
            n_prompts: this.n_prompts,
          },
        });
        
        if (result.logs && Array.isArray(result.logs)) {
          this.logs = result.logs;
          this.pointer = result.logs.length;
          if (result.logs.length < this.n_prompts) {
            this.hasMore = false;
          }
        } else {
          throw new Error("Invalid data format received from the client.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        this.error = "Failed to load logs. Please try again later.";
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchLogs();
    window.addEventListener('scroll', this.handleScroll);
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style scoped>
.space-y-6 {
  width: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ca67b7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
