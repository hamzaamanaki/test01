export default {
  name: 'rgpd-notice',
  template: `
    <div id="rgpd" class="container mt-5">
      <div class="card shadow-sm border-primary">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0"><i class="bi bi-shield-lock-fill me-2"></i> Politique de confidentialité (RGPD)</h4>
        </div>
        <div class="card-body">
          <p>
            Chez <strong>EasyTrip</strong>, nous nous engageons à protéger vos données personnelles.
            Voici les principaux points :
          </p>
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><i class="bi bi-person-fill-lock text-primary me-2"></i>
              Vos informations (nom, email, téléphone) sont uniquement utilisées pour les trajets et réservations.
            </li>
            <li class="list-group-item"><i class="bi bi-cookie text-primary me-2"></i>
              Nous utilisons des cookies techniques pour le bon fonctionnement du site (adresse de départ, sessions…).
            </li>
            <li class="list-group-item"><i class="bi bi-hourglass-split text-primary me-2"></i>
              Les données sont conservées pendant une durée maximale de 12 mois, sauf obligations légales contraires.
            </li>
            <li class="list-group-item"><i class="bi bi-envelope-open text-primary me-2"></i>
              Vous pouvez à tout moment demander la suppression de vos données via notre formulaire de contact.
            </li>
          </ul>
          <p class="mt-3">
            Pour toute question, contactez-nous à <a href="mailto:support@easytrip.com">support@easytrip.com</a>.
          </p>
        </div>
      </div>
    </div>
  `,
  mounted() {
    const el = document.getElementById('rgpd');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
};
