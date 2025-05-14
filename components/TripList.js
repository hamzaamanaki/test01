export default {
  name: 'TripList',
  props: ['trips'],
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('user');
    }
  },
  methods: {
    reserveTrip(tripId) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        this.displayAlert("Veuillez vous connecter pour réserver.", 'warning');
        return;
      }

      fetch('book_trip.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: tripId,
          user_id: user.id,
          seats_booked: 1
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.displayAlert("Réservation réussie !", 'success');
        } else {
          this.displayAlert("Erreur : " + data.error, 'danger');
        }
      })
      .catch(err => {
        console.error(err);
        this.displayAlert("Erreur réseau.", 'danger');
      });
    },

    displayAlert(message, type = 'danger') {
      if (typeof window.showAlert === 'function') {
        window.showAlert(message, type);
      } else {
        alert(message);
      }
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
    }
  },

  template: `
    <div v-if="trips && trips.length" class="container mt-5" id="trip-results">
      <h4 class="mb-4 text-primary">
        <i class="bi bi-pin-map-fill me-2"></i> Trajets les plus proches
      </h4>
      <div class="card mb-4 shadow-sm" v-for="trip in trips" :key="trip.id">
        <div class="card-body">
          <div class="row mb-2">
            <div class="col-md-6">
              <i class="bi bi-geo-alt-fill text-primary me-2"></i>
              <strong>Départ :</strong> {{ trip.departure_address }}
            </div>
            <div class="col-md-6">
              <i class="bi bi-flag-fill text-primary me-2"></i>
              <strong>Arrivée :</strong> {{ trip.arrival_address }}
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-md-6">
              <i class="bi bi-clock-fill text-primary me-2"></i>
              <strong>Heure :</strong>
              {{ formatShortDateTime(trip.departure_time) }} →
              {{ formatShortDateTime(trip.arrival_time) }}
            </div>
            <div class="col-md-6">
              <i class="bi bi-signpost-2-fill text-primary me-2"></i>
              <strong>Distance :</strong> {{ trip.distance.toFixed(2) }} km
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <span class="fw-bold">
              <i class="bi bi-currency-euro text-primary me-1"></i>
              Prix : {{ trip.price }} €
            </span>

            <button
              class="btn btn-outline-primary btn-sm"
              @click="reserveTrip(trip.id)"
              :title="!isAuthenticated ? 'Connectez-vous pour réserver' : 'Réserver ce trajet'"
            >
              <i class="bi bi-cart-plus me-1"></i> Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  `
};



