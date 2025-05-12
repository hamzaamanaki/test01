export default {
  name: 'Dashboard',
  data() {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return {
      id: user.id || null, // 👈 ajouté
      editing: false,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      message: ''
    };
  },
  methods: {
    toggleEdit() {
      this.editing = !this.editing;
      this.message = '';
    },
    saveChanges() {
      if (!this.id) {
        this.message = "Impossible de sauvegarder : ID utilisateur manquant.";
        console.warn("ID utilisateur manquant pour la mise à jour.");
        return;
      }

      fetch('update_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: this.id, // 👈 plus clair et fiable
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email
        })        
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('user', JSON.stringify({
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email
          }));
          this.message = "Modifications enregistrées ✅";
          this.editing = false;
        } else {
          this.message = "Erreur : " + data.error;
        }
      })
      .catch(err => {
        console.error(err);
        this.message = "Erreur réseau.";
      });
    }
  },
  template: `
    <div class="container mt-5" id="dashboard">
      <div class="card shadow-sm">
        <div class="card-header bg-primary text-white text-center fw-bold">
          Mon espace
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Prénom</label>
            <input v-if="editing" type="text" v-model="first_name" class="form-control">
            <p v-else><i class="bi bi-person-fill text-primary me-2"></i>{{ first_name }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label">Nom</label>
            <input v-if="editing" type="text" v-model="last_name" class="form-control">
            <p v-else><i class="bi bi-person-vcard-fill text-primary me-2"></i>{{ last_name }}</p>
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-if="editing" type="email" v-model="email" class="form-control">
            <p v-else><i class="bi bi-envelope-fill text-primary me-2"></i>{{ email }}</p>
          </div>

          <div class="text-center">
            <button v-if="!editing" class="btn btn-outline-primary" @click="toggleEdit">Modifier</button>
            <div v-else>
              <button class="btn btn-success me-2" @click="saveChanges">Enregistrer</button>
              <button class="btn btn-secondary" @click="toggleEdit">Annuler</button>
            </div>
          </div>

          <p class="text-success mt-3 text-center" v-if="message">{{ message }}</p>
        </div>
      </div>
    </div>
  `
};
