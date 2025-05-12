export default {
  name: 'ContactForm',
  data() {
    return {
      name: '',
      email: '',
      message: '',
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    submitForm() {
      this.successMessage = '';
      this.errorMessage = '';

      if (!this.name || !this.email || !this.message) {
        this.errorMessage = "Veuillez remplir tous les champs.";
        return;
      }

      // Simule une soumission réussie
      this.successMessage = "Votre message a bien été envoyé. Merci !";
      this.name = this.email = this.message = '';
    }
  },
  template: `
    <div id="contact" class="container mt-5">
      <h2 class="mb-4 text-center text-primary">
        <i class="bi bi-envelope-paper-fill me-2"></i> Contactez-nous
      </h2>

      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <form @submit.prevent="submitForm" class="row g-3">
        <div class="col-md-6">
          <input v-model="name" type="text" class="form-control" placeholder="Votre nom" required>
        </div>
        <div class="col-md-6">
          <input v-model="email" type="email" class="form-control" placeholder="Votre adresse email" required>
        </div>
        <div class="col-12">
          <textarea v-model="message" rows="5" class="form-control" placeholder="Votre message..." required></textarea>
        </div>
        <div class="col-12 text-center">
          <button type="submit" class="btn btn-primary px-4">
            <i class="bi bi-send me-2"></i>Envoyer
          </button>
        </div>
      </form>
    </div>
  `
};

