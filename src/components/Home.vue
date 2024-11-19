<!-- src/components/Home.vue -->
<template>
  <div class="flex flex-col items-center min-h-screen">
    <section class="container mx-auto px-4 py-12 text-center">
      <h2
        class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-custom-purple via-[#ca67b7] to-[#fdb3c2] text-transparent bg-clip-text">
        Explore Chromia Blockchain
      </h2>
      <p class="text-xl mb-10 max-w-2xl mx-auto text-gray-300">
        Search and analyze AI data with ease using ChromindScan Explorer (powered by Chromia)
      </p>

      <!-- Search Bar -->
      <div class="w-full max-w-2xl mx-auto mb-16">
        <div class="flex flex-col sm:flex-row gap-3">
          <input type="text" v-model="searchQuery" @keyup.enter="performSearch"
            placeholder="Search logs by UUID or address..."
            class="flex-1 px-6 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-[#3a3750] border border-neutral-600 focus:border-custom-purple focus:outline-none text-white placeholder-gray-400" />
          <button @click="performSearch"
            class="px-8 py-3 bg-gradient-to-r from-custom-purple to-[#ca67b7] text-white rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:opacity-90 transition-opacity">
            Search
          </button>
        </div>
      </div>

      <!-- Number of Logs Display -->
      <div class="w-full max-w-2xl mx-auto bg-[#3a3750]/50 rounded-xl p-8 backdrop-blur-sm mb-8">
        <h2 class="text-2xl font-bold mb-6 text-custom-purple">Total Inferences</h2>
        <p class="text-xl text-gray-300">{{ noOfLogs }}</p>
      </div>

      <!-- Top Addresses Section -->
      <div class="w-full max-w-2xl mx-auto bg-[#3a3750]/50 rounded-xl p-8 backdrop-blur-sm">
        <h2 class="text-2xl font-bold mb-6 text-custom-purple">Top Addresses</h2>
        <div class="grid gap-4">
          <div v-for="{ address } in topAddresses" :key="address"
            class="p-4 bg-[#2c2734] rounded-lg hover:bg-[#3a3750] transition-colors">
            <router-link :to="`/address/${uint8ArrayToHex(address)}`"
              class="text-[#ca67b7] hover:text-[#fdb3c2] transition-colors break-all">
              {{ uint8ArrayToHex(address) }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto px-4 py-12">
      <h2
        class="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-custom-purple to-[#ca67b7] text-transparent bg-clip-text">
        Explore Our Features
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(feature, index) in features" :key="index"
          class="bg-[#3a3750]/30 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
          <component :is="feature.icon" class="w-12 h-12 mb-4" :class="feature.iconColor" />
          <h3 class="text-xl font-semibold mb-2 text-custom-purple">{{ feature.title }}</h3>
          <p class="text-gray-300">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Partners Section -->
    <section class="container mx-auto px-4 py-16">
      <h2
        class="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-custom-purple to-[#ca67b7] text-transparent bg-clip-text">
        Trusted Partners & Integrations
      </h2>
      <p class="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
        Working together with industry leaders to build a more transparent blockchain ecosystem
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-items-center">
        <div v-for="(partner, index) in partners" :key="index"
          class="w-full max-w-[300px] p-8 bg-[#3a3750]/30 backdrop-blur-sm rounded-xl hover:bg-[#3a3750]/50 transition-all duration-300">
          <div class="space-y-4">
            <div class="flex flex-col items-center">
              <img :src="partner.logo" :alt="partner.name"
                class="w-full h-32 object-contain mb-4" />
              <span class="text-lg font-semibold text-custom-purple">
                {{ partner.name }}
              </span>
            </div>
            <p class="text-sm text-center text-gray-300">{{ partner.description }}</p>
            <div class="text-center">
              <a :href="partner.link" target="_blank" rel="noopener noreferrer"
                class="inline-block px-6 py-2 bg-custom-purple/20 rounded-full text-custom-purple hover:bg-custom-purple/30 transition-all duration-300">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { Database, Shield, Zap, Search, Activity, Clock, CheckCircle, Code, Eye } from 'lucide-vue-next'
import { getClient } from "../chromia";
import { catchError, uint8ArrayToHex } from "../util";

export default {
  name: "Home",
  components: {
    Database,
    Shield,
    Zap,
    Search,
    Activity,
    Clock,
    CheckCircle,
    Code,
    Eye
  },
  data() {
    return {
      noOfLogs: 0,
      searchQuery: "",
      topAddresses: [],
      features: [
        {
          icon: CheckCircle,
          iconColor: 'text-custom-purple',
          title: "Verifiable AI Interactions",
          description: "All AI interactions are logged on-chain, providing real-time, publicly verifiable records."
        },
        {
          icon: Code,
          iconColor: 'text-[#ca67b7]',
          title: "Easy Integration",
          description: "Integrate Chromind with just a few lines of code."
        },
        {
          icon: Eye,
          iconColor: 'text-[#fdb3c2]',
          title: "Transparency in AI Usage",
          description: "Ensure transparency by recording AI activities on Chromia's blockchain."
        },
        {
          icon: Search,
          iconColor: 'text-custom-purple',
          title: "Verify AI Claims",
          description: "Confirm if projects claiming AI usage actually utilize AI technology."
        },
        {
          icon: Activity,
          iconColor: 'text-[#ca67b7]',
          title: "Real-Time Monitoring",
          description: "Monitor AI interactions as they happen."
        }
      ],
      partners: [
        {
          name: "Neetoshi",
          logo: "/partners/neetoshi.jpg",
          description: "NEEToshi, an AI agent powered by xAI Grok-Beta, Chromia, and Elfa AI, is conducting the first experiment of ChromindScan by simulating using @xai’s model and promoting $CHR.",
          link: "https://twitter.com/AlphaOnChain"
        },
        {
          name: "Truth By Aria",
          logo: "/partners/truth_by_aria.png",
          description: "",
          link: "https://x.com/truth_by_aria"
        }
      ]
    };
  },
  methods: {
    uint8ArrayToHex,
    async fetchNoOfLogs() {
      const client = await getClient();
      const [error, result] = await catchError(
        client.query({
          name: "get_logs_count",
        })
      );
      if (error) {
        console.error(error);
        return;
      }
      this.noOfLogs = result;
    },
    async fetchTopAddresses() {
      const client = await getClient();
      const [error, result] = await catchError(
        client.query({
          name: "get_top_allowlist",
        })
      );
      console.log(result);
      if (error) {
        console.error(error);
        return;
      }
      this.topAddresses = result;
    },
    async performSearch() {
      const query = this.searchQuery.trim();
      if (query === "") {
        alert("Please enter a search query.");
        return;
      }
      const client = await getClient();
      const [error, result] = await catchError(
        client.query({
          name: "check_allowlist",
          args: {
            address: query,
          },
        })
      );
      if (error) this.$router.push(`/log/${query}`);
      else this.$router.push(`/address/${query}`);
    },
  },
  mounted() {
    this.fetchTopAddresses();
    this.fetchNoOfLogs();
  },
};
</script>