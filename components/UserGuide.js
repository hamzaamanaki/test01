export default {
  name: 'user-guide',
  template: `
    <div id="guide-utilisateur" class="container my-5">
      <div class="card shadow-sm">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">
            <i class="bi bi-info-circle-fill me-2 text-white"></i>Guide Utilisateur EasyTrip
          </h4>
        </div>
        <div class="card-body">
          <p class="fw-bold">Bienvenue sur <span class="text-primary">EasyTrip</span> !</p>
          <p>Consultez les sections ci-dessous selon vos besoins :</p>

          <div class="accordion" id="guideAccordion">

            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                  <i class="bi bi-person-plus-fill text-primary me-2"></i>Créer un compte, se connecter et se déconnecter
                </button>
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#guideAccordion">
                <div class="accordion-body">
                  Cliquez sur “Inscription” dans la barre de navigation, remplissez le formulaire et validez. Une fois inscrit, vous pouvez vous connecter et accéder à votre espace.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                  <i class="bi bi-search text-primary me-2"></i>Rechercher un trajet et réserver
                </button>
              </h2>
              <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#guideAccordion">
                <div class="accordion-body">
                  Depuis la page d’accueil, saisissez une adresse de départ, une destination et une date. Cliquez sur “Rechercher” puis cliquez sur “Réserver” pour valider.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                  <i class="bi bi-question-circle-fill text-primary me-2"></i>Fonctionnalités supplémentaires
                </button>
              </h2>
              <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#guideAccordion">
                <div class="accordion-body">
                  Vous pouvez consulter vos réservations dans “Mon espace”, modifier vos informations personnelles ou accéder à ce guide à tout moment.
                </div>
              </div>
            </div>

          </div>

          <div class="text-center mt-4">
            <a href="assets/docs/Guide_Utilisateur_EasyTrip.pdf" download class="btn btn-outline-primary">
              <i class="bi bi-download me-2 text-primary"></i>Télécharger le guide en PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  mounted() {
    const el = document.getElementById('guide-utilisateur');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
};



  
  
  