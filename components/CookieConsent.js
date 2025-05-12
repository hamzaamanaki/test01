export default {
  name: 'CookieConsent',
  data() {
    return {
      visible: !document.cookie.includes('cookiesAccepted=true')
    };
  },
  methods: {
    acceptCookies() {
      document.cookie = "cookiesAccepted=true; path=/; max-age=31536000"; // 1 an
      this.visible = false;
    },
    refuseCookies() {
      this.visible = false;
    },
    goToRgpd() {
      if (typeof window.openRgpd === 'function') {
        this.visible = false;
        window.openRgpd();
      }
    }
  },
  template: `
    <div v-if="visible" class="cookie-consent bg-dark text-white p-3 fixed-bottom shadow">
      <div class="container d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div class="mb-2 mb-md-0">
          Ce site utilise des cookies pour améliorer votre expérience. 
          <a href="#" @click.prevent="goToRgpd" class="text-info text-decoration-underline ms-1">En savoir plus</a>
        </div>
        <div>
          <button class="btn btn-outline-light btn-sm me-2" @click="refuseCookies">Refuser</button>
          <button class="btn btn-primary btn-sm" @click="acceptCookies">Accepter</button>
        </div>
      </div>
    </div>
  `
};

