
import { Check, Star, Zap, Heart, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Pro = () => {
  const features = {
    free: [
      "Analisi base del prodotto",
      "Punteggio generale",
      "3 analisi al mese",
      "Supporto via email"
    ],
    pro: [
      "Analisi avanzata e dettagliata",
      "Consigli personalizzati specifici",
      "Analisi illimitate",
      "Scanner codice a barre mobile",
      "Storico analisi e preferiti",
      "Notifiche richiami prodotti",
      "Confronto prodotti",
      "Supporto prioritario",
      "Accesso beta nuove funzioni"
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Crown className="w-4 h-4" />
            <span>Funzionalità Premium</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">PetScan Pro</span>
          </h1>
          
          <p className="text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            L'analisi più completa e personalizzata per la salute del tuo animale. 
            Tutto quello di cui hai bisogno per prendere le decisioni migliori.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl">
              <Star className="w-5 h-5 mr-2" />
              Prova Pro Gratis
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-purple-200 hover:border-purple-300 text-purple-700 px-8 py-4 rounded-full font-semibold text-lg">
              Scopri le differenze
            </Button>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Cosa ottieni con <span className="text-purple-600">Pro</span>
            </h2>
            <p className="text-xl text-gray-600">
              Confronta le funzionalità e scopri perché migliaia di pet parent scelgono Pro
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">PetScan Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">Gratis</div>
                <p className="text-gray-600">Perfetto per iniziare</p>
              </div>

              <ul className="space-y-4 mb-8">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="w-full py-3 border-2 border-gray-300 text-gray-700">
                Sempre disponibile
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-3xl p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  🔥 Più popolare
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">PetScan Pro</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">€9,99</div>
                <div className="text-gray-600 mb-4">al mese</div>
                <p className="text-gray-600">Analisi complete e personalizzate</p>
              </div>

              <ul className="space-y-4 mb-8">
                {features.pro.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                <Star className="w-4 h-4 mr-2" />
                Inizia prova gratuita
              </Button>
              
              <p className="text-center text-sm text-gray-600 mt-3">
                7 giorni gratis, poi €9,99/mese. Cancella quando vuoi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Funzionalità <span className="text-purple-600">avanzate</span>
            </h2>
            <p className="text-xl text-gray-600">
              Tutto quello che serve per monitorare al meglio l'alimentazione del tuo animale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Analisi Istantanee",
                description: "Scanner integrato per ottenere analisi immediate con la fotocamera del telefono",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: Heart,
                title: "Profili Personalizzati",
                description: "Crea profili dettagliati per ogni animale con preferenze, allergie e condizioni di salute",
                color: "from-pink-400 to-red-500"
              },
              {
                icon: Star,
                title: "Consigli Veterinari",
                description: "Suggerimenti specifici basati su database veterinari e studi scientifici aggiornati",
                color: "from-blue-400 to-purple-500"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Pronto a dare il meglio al tuo animale?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Inizia la prova gratuita di 7 giorni. Nessun impegno, cancella quando vuoi.
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg">
            <Star className="w-5 h-5 mr-2" />
            Inizia prova gratuita
          </Button>
          <p className="text-sm mt-4 opacity-75">
            Oltre 5.000 pet parent si fidano già di PetScan Pro
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pro;
