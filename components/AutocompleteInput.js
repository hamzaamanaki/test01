export default {
  name: 'AutocompleteInput',
  props: ['placeholder'],
  data() {
    return {
      query: '',
      results: [],
      activeIndex: -1
    };
  },
  watch: {
    query(newQuery) {
      if (newQuery.length >= 2) {
        fetch(`proxy_nominatim.php?q=${encodeURIComponent(newQuery)}&countrycodes=be`)
          .then(res => res.json())
          .then(data => {
            console.log("📦 Résultat brut de Nominatim :", data);
            this.results = (data || []).map(f => f.display_name || '');
            console.log("✅ Résultats extraits :", this.results);
            this.activeIndex = -1;
          })
          .catch(err => {
            console.error("❌ Erreur proxy Nominatim :", err);
            this.results = [];
          });
      } else {
        this.results = [];
      }
    }
  },
  methods: {
    select(address) {
      this.query = address;
      this.results = [];
      this.$emit('selected', address);
    },
    navigate(direction) {
      if (!this.results.length) return;
      this.activeIndex += direction;

      if (this.activeIndex < 0) this.activeIndex = this.results.length - 1;
      if (this.activeIndex >= this.results.length) this.activeIndex = 0;
    },
    onEnter() {
      if (this.activeIndex >= 0 && this.activeIndex < this.results.length) {
        this.select(this.results[this.activeIndex]);
      } else if (this.results.length === 1) {
        this.select(this.results[0]);
      }
    }
  },
  template: `
    <div class="autocomplete position-relative">
      <input
        type="text"
        class="form-control"
        :placeholder="placeholder"
        v-model="query"
        @keydown.down.prevent="navigate(1)"
        @keydown.up.prevent="navigate(-1)"
        @keydown.enter.prevent="onEnter"
        autocomplete="off"
      />

      <ul
        v-if="results.length > 0"
        class="list-group position-absolute w-100 shadow mt-1"
        style="z-index: 9999; max-height: 200px; overflow-y: auto; background: white;"
      >
        <li
          v-for="(r, index) in results"
          :key="index"
          class="list-group-item list-group-item-action"
          :class="{ active: index === activeIndex }"
          @click="select(r)"
        >
          {{ r }}
        </li>
      </ul>
    </div>
  `
};
