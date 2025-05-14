import RegisterForm from '../components/RegisterForm.js';
import LoginForm from '../components/LoginForm.js';
import Dashboard from '../components/Dashboard.js';
import AutocompleteInput from '../components/AutocompleteInput.js';
import UserGuide from '../components/UserGuide.js';
import TripList from '../components/TripList.js';
import CookieConsent from '../components/CookieConsent.js';
import RgpdNotice from '../components/RgpdNotice.js';
import ContactForm from '../components/ContactForm.js';

const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      currentView: '',
      pendingScrollToId: null,
      trips: [],
      departure: '',
      arrival: ''
    };
  },

  methods: {
    selectedArrival(address) {
      this.arrival = address;
    },
    selectedDeparture(address) {
      this.departure = address;
    },

    formatShortDateTime(dateTime) {
      if (!dateTime) return '';
      const options = {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateTime).toLocaleString('fr-BE', options);
    },

    async searchTrips() {
      try {
        this.currentView = '';

        const address = this.departure;
        if (!address) {
          alert("Veuillez entrer une adresse de départ.");
          return;
        }

        const geoUrl = `proxy_nominatim.php?q=${encodeURIComponent(address)}&countrycodes=be`;
        const geoRes = await fetch(geoUrl, {
          headers: {
            'User-Agent': 'EasyTripApp/1.0 (hamza.amanaki@student.hepl.be)'
          }
        });

        const geoData = await geoRes.json();
        console.log("📦 Données retournées par Photon :", geoData);

        const features = geoData.features || [];
        if (!features.length) {
          alert("Adresse introuvable.");
          return;
        }

        const { lat, lon } = features[0].geometry.coordinates
          ? { lat: features[0].geometry.coordinates[1], lon: features[0].geometry.coordinates[0] }
          : {};

        const city = (address.split(',')[0] || '').trim();
        console.log("🏙️ Ville extraite depuis l'adresse saisie :", city);

        if (!city || !lat || !lon) {
          alert("Impossible de déterminer la ville ou les coordonnées GPS.");
          return;
        }

        const tripsRes = await fetch(`get_closest_trips.php?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}`);
        const result = await tripsRes.json();

        if (result.success) {
          if (result.trips.length === 0) {
            alert(`🚫 Aucun trajet trouvé au départ de ${city}.`);
            this.trips = [];
            return;
          }

          this.trips = result.trips;
          this.$nextTick(() => {
            const el = document.getElementById('trip-results');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          });
        } else {
          this.trips = [];
          alert(result.error || 'Aucun trajet trouvé.');
        }
      } catch (err) {
        console.error("💥 Erreur dans searchTrips :", err);
        alert("Erreur réseau lors de la recherche.");
      }
    },

    scrollToComponent(view, elementId) {
      if (this.currentView === view) {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        this.pendingScrollToId = elementId;
        this.currentView = view;
      }
    },

    openRegister() {
      this.currentView = 'register-form';
      this.$nextTick(() => {
        setTimeout(() => {
          const el = document.getElementById('register');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      });
    },

    openContact() {
      this.scrollToComponent('contact-form', 'contact');
    },

    openRgpd() {
      this.scrollToComponent('rgpd-notice', 'rgpd');
    },

    openLogin() {
      this.currentView = 'login-form';
      this.$nextTick(() => {
        setTimeout(() => {
          const el = document.getElementById('login');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      });
    },

    openDashboard() {
      this.scrollToComponent('dashboard', 'dashboard');
    },

    scrollToGuide() {
      this.scrollToComponent('user-guide', 'guide-utilisateur');
    },

    updateAuthMenu() {
      const authContainer = document.getElementById('auth-actions');
      const user = JSON.parse(localStorage.getItem('user'));
      if (!authContainer) return;

      if (user) {
        authContainer.innerHTML = `
          <li class="nav-item">
            <span class="nav-link fw-bold">Bienvenue, ${user.first_name}</span>
          </li>
          <li class="nav-item">
            <a class="btn btn-outline-primary ms-2" href="#" onclick="event.preventDefault(); openDashboard()">Mon espace</a>
          </li>
          <li class="nav-item">
            <button class="btn btn-outline-danger ms-2" onclick="logout()">Déconnexion</button>
          </li>
        `;
      } else {
        authContainer.innerHTML = `
          <li class="nav-item">
            <a class="btn btn-primary me-2" href="#register" onclick="event.preventDefault(); openRegister()">Inscription</a>
          </li>
          <li class="nav-item">
            <a class="btn btn-outline-dark" href="#" onclick="event.preventDefault(); openLogin()">Connexion</a>
          </li>
        `;
      }
    }
  },

  updated() {
    if (this.pendingScrollToId) {
      const el = document.getElementById(this.pendingScrollToId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      this.pendingScrollToId = null;
    }
  },

  mounted() {
    this.updateAuthMenu();
    window.logout = () => {
      localStorage.removeItem('user');
      location.reload();
    };
  },

  components: {
    'register-form': RegisterForm,
    'login-form': LoginForm,
    'dashboard': Dashboard,
    'autocomplete-input': AutocompleteInput,
    'user-guide': UserGuide,
    'trip-list': TripList,
    'cookie-consent': CookieConsent,
    'rgpd-notice': RgpdNotice,
    'contact-form': ContactForm
  }
});

const myApp = app.mount('#app');

// Fonctions globales
window.openUserGuide = () => myApp.scrollToGuide();
window.openRegister = () => myApp.openRegister();
window.openRgpd = () => myApp.openRgpd();
window.openLogin = () => myApp.openLogin();
window.openDashboard = () => myApp.openDashboard();
window.openContact = () => myApp.openContact();
window.searchTrips = () => myApp.searchTrips();
window.app = myApp;


