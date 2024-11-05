<template>

  <body class="font-vt323 text-xl font-normal bg-custom-bg text-white min-h-screen">
    <div id="app" class="container mx-auto px-4 md:px-6 lg:px-8 py-5 min-h-screen">
      <div class="bg-custom-secondary rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
        <!-- Header with Logo -->
        <header class="flex flex-col items-center mb-5 pb-2.5 border-b border-neutral-600">
          <div class="flex items-center gap-3 mb-2">
            <img src="@/assets/logo.jpg" alt="ChromindScan Logo"
              class="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full" />
            <h1 class="text-2xl md:text-3xl lg:text-4xl">
              <a href="/"
                class="text-custom-purple no-underline hover:text-custom-purple/80 transition-colors flex items-center">
                ChromindScan Explorer
              </a>
            </h1>
          </div>
          <!-- Optional: Navigation Menu -->
          <nav class="flex gap-6 text-sm md:text-base">
            <a href="/" class="text-gray-300 hover:text-custom-purple transition-colors">
              Home
            </a>
            <a href="https://github.com/chromindscan" target="_blank" rel="noopener noreferrer"
              class="text-gray-300 hover:text-custom-purple transition-colors">
              Github
            </a>
            <a href="https://explorer.chromia.com/mainnet/blockchain/E55CAEA35948B8FA13F9E19B201D5A93BAA664AD57E6CE52AE9022B5024B8083"
              target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-custom-purple transition-colors">
              Chromia Explorer
            </a>
          </nav>
        </header>

        <main class="flex-1 overflow-hidden">
          <router-view></router-view>
        </main>

        <!-- Updated Footer -->
        <footer class="text-center text-purple-300 py-4 px-5 border-t border-neutral-600 mt-auto">
          <div class="flex justify-center items-center gap-2">
            <img src="@/assets/logo.jpg" alt="ChromindScan Logo" class="w-6 h-6 object-contain" />
            <p>&copy; 2024 Chromia</p>
          </div>
        </footer>
      </div>
    </div>
  </body>
</template>

<script>
export default {
  name: "App",
};
</script>
