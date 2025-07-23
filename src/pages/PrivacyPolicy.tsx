
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla home
            </Button>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Ultimo aggiornamento: 10 giugno 2024</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informazioni che raccogliamo</h2>
              <p className="text-gray-700 leading-relaxed">
                PetScan raccoglie le seguenti informazioni quando utilizzi il nostro servizio:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Informazioni sui prodotti alimentari che analizzi</li>
                <li>Dati sul tuo animale domestico (specie, età, peso, condizioni di salute)</li>
                <li>Indirizzo email per le comunicazioni del servizio</li>
                <li>Dati di utilizzo del sito web per migliorare l'esperienza</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Come utilizziamo le tue informazioni</h2>
              <p className="text-gray-700 leading-relaxed">
                Utilizziamo le informazioni raccolte per:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Fornire analisi personalizzate dell'alimentazione</li>
                <li>Migliorare i nostri algoritmi di valutazione</li>
                <li>Inviarti aggiornamenti sui prodotti analizzati</li>
                <li>Rispondere alle tue richieste di supporto</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Condivisione delle informazioni</h2>
              <p className="text-gray-700 leading-relaxed">
                Non vendiamo, affittiamo o condividiamo le tue informazioni personali con terze parti per scopi commerciali. 
                Possiamo condividere dati aggregati e anonimi per ricerca scientifica nel campo della nutrizione animale.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Sicurezza dei dati</h2>
              <p className="text-gray-700 leading-relaxed">
                Implementiamo misure di sicurezza appropriate per proteggere le tue informazioni personali 
                contro accessi non autorizzati, alterazioni, divulgazioni o distruzioni.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. I tuoi diritti</h2>
              <p className="text-gray-700 leading-relaxed">
                Hai il diritto di:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Accedere ai tuoi dati personali</li>
                <li>Richiedere la correzione di dati inesatti</li>
                <li>Richiedere la cancellazione dei tuoi dati</li>
                <li>Opporti al trattamento dei tuoi dati</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contatti</h2>
              <p className="text-gray-700 leading-relaxed">
                Per qualsiasi domanda riguardo questa Privacy Policy, contattaci a: 
                <a href="mailto:privacy@petscan.it" className="text-green-600 hover:text-green-700 ml-1">
                  privacy@petscan.it
                </a>
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
