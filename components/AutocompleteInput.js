export default {
  name: 'autocomplete-input',
  props: ['placeholder'],
  emits: ['selected'],
  data() {
    return {
      inputValue: '',
      suggestions: [],
      selectedIndex: -1,
      debounceTimer: null
    };
  },
  template: `
    <div class="position-relative">
      <input 
        type="text" 
        class="form-control" 
        v-model="inputValue" 
        @input="debouncedInput"
        @keydown.down.prevent="onArrowDown"
        @keydown.up.prevent="onArrowUp"
        @keydown.enter.prevent="onEnter"
        :placeholder="placeholder || 'Adresse...'"
        autocomplete="off"
      />
      <ul v-if="suggestions.length" class="list-group position-absolute z-3 w-100 shadow-sm">
        <li 
          class="list-group-item list-group-item-action" 
          v-for="(item, index) in suggestions" 
          :key="index"
          :class="{ active: index === selectedIndex }"
          @click="selectSuggestion(item)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  `,
  methods: {
    debouncedInput() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(this.onInput, 300); // ⚡ debounce 300ms
    },
    onInput() {
      if (this.inputValue.length < 3) {
        this.suggestions = [];
        return;
      }

      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(this.inputValue)}&limit=5`)
        .then(res => res.json())
        .then(data => {
          this.suggestions = data.features.map(f => {
            const p = f.properties;
            return `${p.name || ''}, ${p.postcode || ''} ${p.city || ''}, ${p.country || ''}`;
          }).filter(Boolean);
          this.selectedIndex = -1;
        })
        .catch(() => {
          this.suggestions = [];
        });
    },
    selectSuggestion(suggestion) {
      this.inputValue = suggestion;
      this.suggestions = [];
      this.$emit('selected', suggestion);
    },
    onArrowDown() {
      if (this.selectedIndex < this.suggestions.length - 1) this.selectedIndex++;
    },
    onArrowUp() {
      if (this.selectedIndex > 0) this.selectedIndex--;
    },
    onEnter() {
      if (this.selectedIndex >= 0) {
        this.selectSuggestion(this.suggestions[this.selectedIndex]);
      }
    }
  }
};

