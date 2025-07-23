
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Termini di Servizio</h1>
            <p className="text-gray-600">Ultimo aggiornamento: 10 giugno 2024</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Accettazione dei termini</h2>
              <p className="text-gray-700 leading-relaxed">
                Utilizzando PetScan, accetti di essere vincolato da questi Termini di Servizio. 
                Se non accetti tutti i termini e le condizioni, non utilizzare il nostro servizio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrizione del servizio</h2>
              <p className="text-gray-700 leading-relaxed">
                PetScan è un servizio di analisi dell'alimentazione per cani e gatti che fornisce 
                valutazioni informative sui prodotti alimentari. Il servizio non sostituisce il 
                parere di un veterinario qualificato.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Limitazioni di responsabilità</h2>
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                <p className="text-orange-800 font-medium">
                  ⚠️ Importante: Le analisi fornite da PetScan sono solo a scopo informativo
                </p>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>PetScan non fornisce consigli medici veterinari</li>
                <li>Le valutazioni non sostituiscono la consulenza professionale</li>
                <li>Non siamo responsabili per decisioni prese basandosi sulle nostre analisi</li>
                <li>Consulta sempre un veterinario per questioni di salute del tuo animale</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Uso appropriato</h2>
              <p className="text-gray-700 leading-relaxed">
                Ti impegni a utilizzare PetScan solo per scopi legittimi e a non:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Fornire informazioni false o fuorvianti</li>
                <li>Tentare di compromettere la sicurezza del servizio</li>
                <li>Utilizzare il servizio per scopi commerciali senza autorizzazione</li>
                <li>Violare diritti di proprietà intellettuale</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Proprietà intellettuale</h2>
              <p className="text-gray-700 leading-relaxed">
                Tutti i contenuti, algoritmi, design e funzionalità di PetScan sono di proprietà 
                esclusiva di PetScan e sono protetti da diritti d'autore e altre leggi sulla 
                proprietà intellettuale.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Modifiche ai termini</h2>
              <p className="text-gray-700 leading-relaxed">
                Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. 
                Le modifiche saranno pubblicate su questa pagina con la data di aggiornamento. 
                L'uso continuato del servizio costituisce accettazione dei termini modificati.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contatti</h2>
              <p className="text-gray-700 leading-relaxed">
                Per domande sui Termini di Servizio, contattaci a: 
                <a href="mailto:legal@petscan.it" className="text-green-600 hover:text-green-700 ml-1">
                  legal@petscan.it
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

export default TermsOfService;
