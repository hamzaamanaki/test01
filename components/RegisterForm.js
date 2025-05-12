export default {
  name: 'RegisterForm',
  data() {
    return {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      gender: '',
      birth_date: '',
      confirmationMessage: ''
    };
  },
  template: `
    <div id="register" class="container mt-5">
      <h2 class="text-center mb-4">Inscription</h2>

      <div v-if="confirmationMessage" class="alert alert-success text-center">
        {{ confirmationMessage }}
        <br>
        <button class="btn btn-outline-success mt-3" @click="goToLogin">
          Se connecter maintenant
        </button>
      </div>

      <form v-else @submit.prevent="submitForm" class="bg-light p-4 rounded shadow-sm">
        <p class="text-muted mb-4 text-center">Remplissez le formulaire pour créer votre compte EasyTrip.</p>

        <div class="mb-3">
          <input type="text" v-model="first_name" class="form-control" placeholder="Ex : John" required>
        </div>
        <div class="mb-3">
          <input type="text" v-model="last_name" class="form-control" placeholder="Ex : Doe" required>
        </div>
        <div class="mb-3">
          <input type="email" v-model="email" class="form-control" placeholder="email.exemple@gmail.com" required>
        </div>
        <div class="mb-3">
          <input type="password" v-model="password" class="form-control" placeholder="Mot de passe sécurisé" required>
        </div>
        <div class="mb-3">
          <input type="tel" v-model="phone" class="form-control" placeholder="Ex : +32 495 12 34 56" required>
        </div>
        <div class="mb-3">
          <select v-model="gender" class="form-select" required>
            <option value="" disabled>Sélectionnez votre sexe</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="non_repondu">Préfère ne pas dire</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Date de naissance</label>
          <input type="date" v-model="birth_date" class="form-control" required>
        </div>

        <button type="submit" class="btn btn-primary w-100">S'inscrire</button>
      </form>
    </div>
  `,
  methods: {
    submitForm() {
      const data = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: this.password,
        phone: this.phone,
        gender: this.gender,
        birth_date: this.birth_date
      };

      fetch('inscription.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          if (!response.ok) throw new Error("Erreur serveur : " + response.status);
          return response.json();
        })
        .then(result => {
          if (result.success) {
            localStorage.setItem('user', JSON.stringify(result.user));
            this.confirmationMessage = `Bienvenue ${result.user.first_name}, votre inscription est validée !`;
            this.resetForm();
          } else {
            alert('Erreur : ' + (result.error || 'Une erreur est survenue.'));
          }
        })
        .catch(error => {
          console.error('Erreur fetch :', error);
          alert("Erreur réseau lors de l'envoi du formulaire.");
        });
    },
    resetForm() {
      this.first_name = '';
      this.last_name = '';
      this.email = '';
      this.password = '';
      this.phone = '';
      this.gender = '';
      this.birth_date = '';
    },
    goToLogin() {
      this.$root.currentView = 'login-form';
      this.$nextTick(() => {
        const el = document.getElementById('login');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }
};

