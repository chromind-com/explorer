<template>
  <div class="flex flex-col min-h-screen">
    <div v-if="isLoading" class="text-center text-custom-purple">Loading log details...</div>
    <div v-if="error" class="text-center text-[#fdb3c2]">{{ error }}</div>

    <div v-if="!isLoading && !error" class="space-y-6">
      <div class="mb-8">
        <h2 class="text-3xl font-bold mb-4 bg-gradient-to-r from-custom-purple to-[#ca67b7] text-transparent bg-clip-text">
          Log Details
        </h2>
      </div>

      <div class="grid gap-6">
        <div
          v-for="(section, key) in detailSections"
          :key="key"
          class="bg-[#3a3750]/30 backdrop-blur-sm rounded-xl p-6"
        >
          <h3 class="text-custom-purple text-lg mb-2">{{ section.title }}</h3>
          <div class="text-gray-300 break-all">
            <component :is="section.component" v-bind="section.props">
              <template v-if="section.props.html" v-html="section.props.html"></template>
              <template v-else>{{ section.props.text }}</template>
            </component>
          </div>
        </div>
      </div>

      <router-link
        to="/"
        class="inline-flex items-center px-6 py-2 bg-custom-purple/20 rounded-full text-custom-purple hover:bg-custom-purple/30 transition-all duration-300 mt-6"
      >
        ← Back to Explorer
      </router-link>
    </div>
  </div>
</template>

<script>
import { getClient } from "../chromia";
import { uint8ArrayToHex } from "../util";

export default {
  name: "LogDetails",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      log: {},
      isLoading: true,
      error: null,
    };
  },
  computed: {
    detailSections() {
      const sections = {
        uuid: {
          title: "UUID",
          component: "router-link",
          props: {
            to: `/log/${this.log.uuid}`,
            class: "text-[#ca67b7] hover:text-[#fdb3c2] transition-colors",
            text: this.log.uuid,
          },
        },
        address: {
          title: "Address",
          component: "router-link",
          props: {
            to: `/address/${this.uint8ArrayToHex(this.log.address)}`,
            class: "text-[#ca67b7] hover:text-[#fdb3c2] transition-colors",
            text: this.uint8ArrayToHex(this.log.address),
          },
        },
        timestamp: {
          title: "Created At",
          component: "span",
          props: {
            text: this.formatTimestamp(this.log.created_at),
          },
        },
        userQuestion: {
          title: "User Question",
          component: "div",
          props: {
            class: "bg-[#6a5acd] px-4 py-2 rounded-xl",
            text: this.log.user_question,
          },
        },
        assistantReply: {
          title: "Assistant Reply",
          component: "div",
          props: {
            class: "bg-[#4b3f68] px-4 py-2 rounded-xl",
            text: this.log.assistant_reply,
          },
        },
        chatId: {
          title: "Chat ID",
          component: "span",
          props: {
            text: this.log.chat_id,
          },
        },
        finishReason: {
          title: "Finish Reason",
          component: "span",
          props: {
            text: this.log.finish_reason || "N/A",
          },
        },
        requestModel: {
          title: "Request Model",
          component: "span",
          props: {
            text: this.log.request_model,
          },
        },
        responseModel: {
          title: "Response Model",
          component: "span",
          props: {
            text: this.log.response_model || "N/A",
          },
        },
        ...(this.log.response_provider && {
          responseProvider: {
            title: "Response Provider",
            component: "span",
            props: {
              text: this.log.response_provider || "N/A",
            },
          },
        }),
        responseCreated: {
          title: "Response Created",
          component: "span",
          props: {
            text: this.formatTimestamp(this.log.response_created),
          },
        },
        responseObject: {
          title: "Response Object",
          component: "pre",
          props: {
            class: "bg-[#2c2734] p-2 rounded mt-1 overflow-x-auto",
            text: this.parseJSON(this.log.response_object),
          },
        },
        ...(this.hasTokenUsage && {
          usageStats: {
            title: "Token Usage",
            component: "div",
            props: {
              class: "grid grid-cols-2 gap-2",
              html: `
                ${this.log.response_usage?.prompt_tokens ? `<div>Prompt Tokens: ${this.log.response_usage.prompt_tokens}</div>` : ""}
                ${this.log.response_usage?.completion_tokens ? `<div>Completion Tokens: ${this.log.response_usage.completion_tokens}</div>` : ""}
                ${this.log.response_usage?.total_tokens ? `<div>Total Tokens: ${this.log.response_usage.total_tokens}</div>` : ""}
              `,
            },
          },
        }),
        ...(this.hasTechnicalDetails && {
          technicalDetails: {
            title: "Technical Details",
            component: "details",
            props: {
              class: "technical-details",
              html: `
                <summary class="cursor-pointer hover:text-custom-purple">Show Technical Details</summary>
                <div class="mt-4 space-y-4">
                  ${this.log.request_messages ? `
                    <div>
                      <h4 class="text-custom-purple">Request Messages</h4>
                      <pre class="bg-[#2c2734] p-2 rounded mt-1 overflow-x-auto">${this.parseJSON(this.log.request_messages)}</pre>
                    </div>
                  ` : ""}
                  ${this.log.request_raw ? `
                    <div>
                      <h4 class="text-custom-purple">Request Raw</h4>
                      <pre class="bg-[#2c2734] p-2 rounded mt-1 overflow-x-auto">${this.parseJSON(this.log.request_raw)}</pre>
                    </div>
                  ` : ""}
                  ${this.log.response_raw ? `
                    <div>
                      <h4 class="text-custom-purple">Response Raw</h4>
                      <pre class="bg-[#2c2734] p-2 rounded mt-1 overflow-x-auto">${this.parseJSON(this.log.response_raw)}</pre>
                    </div>
                  ` : ""}
                  ${this.log.system_fingerprint ? `
                    <div>
                      <h4 class="text-custom-purple">System Fingerprint</h4>
                      <div class="mt-1">${this.log.system_fingerprint}</div>
                    </div>
                  ` : ""}
                </div>
              `,
            },
          },
        }),
      };

      return sections;
    },
    hasTokenUsage() {
      return !!(
        this.log?.response_usage?.prompt_tokens ||
        this.log?.response_usage?.completion_tokens ||
        this.log?.response_usage?.total_tokens
      );
    },
    hasTechnicalDetails() {
      return !!(
        this.log?.request_messages ||
        this.log?.request_raw ||
        this.log?.response_raw ||
        this.log?.system_fingerprint
      );
    },
  },
  methods: {
    uint8ArrayToHex,
    formatTimestamp(timestamp) {
      if (!timestamp) return "N/A";
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
    parseJSON(data) {
      if (!data) return "N/A";
      try {
        if (typeof data === "object") {
          return JSON.stringify(data, null, 2);
        }
        if (typeof data === "string") {
          data = data.trim();
          if (data.startsWith("{") || data.startsWith("[")) {
            return JSON.stringify(JSON.parse(data), null, 2);
          } else {
            return data;
          }
        }
        return data;
      } catch {
        return data;
      }
    },
    async fetchLogDetails() {
      try {
        const client = await getClient();
        const result = await client.query({
          name: "get_log",
          args: {
            uuid: this.uuid,
          },
        });
        if (result) {
          this.log = result;
        } else {
          throw new Error("Log not found.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        this.error = "Failed to load log details. Please try again later.";
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchLogDetails();
  },
};
</script>

<style>
</style>