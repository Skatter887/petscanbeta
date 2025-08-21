
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, MessageCircle, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ContactModal from '@/components/ContactModal';
import SEOHead from '@/components/SEOHead';

const Contacts = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contatti PetScan",
    "description": "Contatta PetScan per supporto e informazioni sul servizio di analisi dell'alimentazione per cani e gatti",
    "mainEntity": {
      "@type": "Organization",
      "name": "PetScan",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+39-02-1234567",
          "contactType": "customer service",
          "email": "info@petscan.it",
          "availableLanguage": "Italian"
        },
        {
          "@type": "ContactPoint",
          "contactType": "technical support",
          "email": "support@petscan.it"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Via Roma 123",
        "addressLocality": "Milano",
        "postalCode": "20121",
        "addressCountry": "IT"
      }
    }
  };

  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Contatti - PetScan"
        description="Contatta PetScan per supporto e informazioni sul servizio di analisi dell'alimentazione per cani e gatti"
        structuredData={structuredData}
      />
      <Header />
      
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla home
            </Button>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contatti</h1>
            <p className="text-xl text-gray-600">
              Siamo qui per aiutarti! Contattaci per qualsiasi domanda su PetScan.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Informazioni di contatto */}
            <div className="space-y-8">
              <div className="bg-green-50 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Informazioni di contatto</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email generale</h3>
                      <p className="text-gray-600">info@petscan.it</p>
                      <p className="text-sm text-gray-500">Per domande generali e supporto</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Supporto tecnico</h3>
                      <p className="text-gray-600">support@petscan.it</p>
                      <p className="text-sm text-gray-500">Per problemi tecnici e bug</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Orari di supporto</h3>
                      <p className="text-gray-600">Lun - Ven: 9:00 - 18:00</p>
                      <p className="text-sm text-gray-500">Risposta entro 24 ore lavorative</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Sede legale</h3>
                      <p className="text-gray-600">Via Roma 123, 20121 Milano (MI)</p>
                      <p className="text-sm text-gray-500">Italia</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Domande frequenti</h3>
                <p className="text-gray-600 mb-4">
                  Prima di contattarci, dai un'occhiata alle nostre FAQ per trovare 
                  risposte immediate alle domande più comuni.
                </p>
                <Button 
                  onClick={() => navigate('/#faq')}
                  variant="outline"
                  className="border-orange-200 hover:border-orange-300 text-orange-700"
                >
                  Vai alle FAQ
                </Button>
              </div>
            </div>

            {/* Form di contatto */}
            <div className="bg-white border border-green-100 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Invia un messaggio</h2>
              
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">💬</span>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Hai una domanda?</h3>
                  <p className="text-gray-600 mb-6">
                    Clicca qui sotto per aprire il nostro modulo di contatto e 
                    ricevere assistenza personalizzata.
                  </p>
                </div>

                <Button 
                  onClick={() => setIsContactModalOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contattaci ora
                </Button>

                <p className="text-sm text-gray-500">
                  Ti risponderemo entro 24 ore lavorative
                </p>
              </div>
            </div>
          </div>

          {/* Sezione aggiuntiva */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                La salute dei tuoi amici a quattro zampe è la nostra priorità
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Il team di PetScan è composto da esperti appassionati di nutrizione animale. 
                Siamo qui per aiutarti a fare le scelte migliori per i tuoi cani e gatti.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

export default Contacts;
