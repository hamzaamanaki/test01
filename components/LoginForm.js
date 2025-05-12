// LoginForm.js
// Composant Vue 3 pour la connexion utilisateur EasyTrip

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      loginMessage: '',
      errorMessage: ''
    };
  },
  template: `
    <div class="container mt-5">
      <h2 class="text-center mb-4">Connexion</h2>

      <div v-if="loginMessage" class="alert alert-success text-center">
        {{ loginMessage }}
      </div>

      <div v-if="errorMessage" class="alert alert-danger text-center">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="submitLogin">
        <div class="mb-3">
          <input type="email" v-model="email" class="form-control" placeholder="Email" required>
        </div>
        <div class="mb-3">
          <input type="password" v-model="password" class="form-control" placeholder="Mot de passe" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Se connecter</button>
      </form>
    </div>
  `,
  methods: {
    submitLogin() {
      fetch('login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      })
      .then(res => {
        if (!res.ok) throw new Error('Échec de la connexion');
        return res.json();
      })
      .then(result => {
        if (result.success) {
          this.loginMessage = result.message;
          this.errorMessage = '';
          localStorage.setItem('user', JSON.stringify(result.user));
setTimeout(() => location.reload(), 1000);

          // Appel de mise à jour de la navbar sans rechargement
          if (window.app && typeof window.app.updateAuthMenu === 'function') {
            window.app.updateAuthMenu();
          }

        } else {
          this.errorMessage = result.error || 'Erreur inconnue';
        }
      })
      .catch(err => {
        console.error(err);
        this.errorMessage = "Connexion échouée. Vérifie tes identifiants.";
      });
    }
  }
};
