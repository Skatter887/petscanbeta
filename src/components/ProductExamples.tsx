
import { Card, CardContent } from "./ui/card";
import { Shield, Award, Star, Heart } from "lucide-react";

const ProductExamples = () => {
  const products = [
    {
      name: "Royal Canin Adult",
      brand: "Royal Canin",
      grade: "A",
      score: 85,
      goodPoints: ["Proteine di qualità", "Senza coloranti artificiali"],
      concerns: ["Contiene cereali"],
      suitableFor: "Cani adulti di taglia media",
      color: "green",
      image: "/lovable-uploads/233a9caf-acb7-4486-8261-786d974aa4a5.png",
      type: "cane"
    },
    {
      name: "Hill's Science Diet",
      brand: "Hill's",
      grade: "B+",
      score: 78,
      goodPoints: ["Formulazione veterinaria", "Antiossidanti naturali"],
      concerns: ["Prezzo elevato", "Conservanti BHA/BHT"],
      suitableFor: "Cani con problemi digestivi",
      color: "blue",
      image: "/lovable-uploads/fcc92b02-aaac-410b-a57b-0a36b2439a8b.png",
      type: "cane"
    },
    {
      name: "Purina Felix",
      brand: "Purina",
      grade: "C",
      score: 65,
      goodPoints: ["Economico", "Appetibile"],
      concerns: ["Molti conservanti", "Sottoprodotti", "Coloranti artificiali"],
      suitableFor: "Gatti adulti sani (uso occasionale)",
      color: "orange",
      image: "/lovable-uploads/02bc290b-6eab-43aa-a59d-903d9e4cad84.png",
      type: "gatto"
    },
    {
      name: "Orijen Adult Dog",
      brand: "Orijen",
      grade: "A+",
      score: 95,
      goodPoints: ["Ingredienti freschi", "Alto contenuto proteico", "Senza cereali"],
      concerns: ["Prezzo premium"],
      suitableFor: "Cani attivi di tutte le età",
      color: "green",
      image: "/lovable-uploads/2c597613-c8a3-440a-9f97-06e814932fe9.png",
      type: "cane"
    }
  ];

  const getGradeGradient = (color: string) => {
    switch (color) {
      case "green": return "bg-gradient-to-br from-green-400 via-green-500 to-green-600";
      case "blue": return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600";
      case "orange": return "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600";
      default: return "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600";
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="prodotti" className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto max-w-7xl">
        {/* Header moderno */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm">
            <span className="text-lg">🔬</span>
            Analisi con AI e peer-review certificate!
          </div>
          <h2 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-8 leading-[0.9] tracking-tight">
            Prodotti già
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700">
              analizzati
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
          I nostri algoritmi di AI e il processo di peer-review certificato hanno analizzato centinaia di prodotti.
            <br className="hidden sm:block" />
            Scopri cosa rende davvero sicuro il cibo del tuo amico peloso.
          </p>
        </div>

        {/* Grid di prodotti - Design Hero Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {products.map((product, idx) => (
            <Card key={idx} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-white to-orange-50/30 backdrop-blur-sm hover:bg-white">
              {/* Decorative background elements - come nella Hero */}
              <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute bg-gradient-to-br from-orange-200/20 to-orange-300/20 rounded-full mix-blend-multiply filter blur-2xl opacity-40" style={{
                  top: '5%',
                  left: '5%',
                  width: '30%',
                  height: '30%'
                }}></div>
                <div className="absolute bg-gradient-to-br from-green-200/20 to-green-300/20 rounded-full mix-blend-multiply filter blur-2xl opacity-40" style={{
                  top: '20%',
                  right: '10%',
                  width: '25%',
                  height: '25%'
                }}></div>
                <div className="absolute bg-gradient-to-br from-blue-200/20 to-blue-300/20 rounded-full mix-blend-multiply filter blur-2xl opacity-40" style={{
                  bottom: '10%',
                  left: '20%',
                  width: '35%',
                  height: '35%'
                }}></div>
              </div>

              {/* Decorative corners - come nella Hero */}
              <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-bl from-orange-100/40 to-transparent rounded-bl-2xl"></div>
              <div className="absolute bottom-0 left-0 w-10 h-10 bg-gradient-to-tr from-green-100/40 to-transparent rounded-tr-2xl"></div>

              <CardContent className="p-6 relative z-10">
                {/* Header con immagine e grade - Layout Hero Style */}
                <div className="flex items-start justify-between mb-6">
                  {/* Prodotto info con immagine */}
                  <div className="flex items-start space-x-4">
                    <div className="relative group">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-xl flex items-center justify-center p-1 transition-all duration-500 shadow-lg group-hover:scale-105">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover rounded-lg transition-all duration-500 group-hover:scale-105" 
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h3>
                        <Award className="w-4 h-4 text-orange-500" />
                      </div>
                      <p className="text-gray-600 text-sm font-medium mb-1">{product.brand}</p>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-3 h-3 text-pink-500" />
                        <p className="text-gray-500 text-xs">{product.type === 'cane' ? '🐕' : '🐱'} {product.type}</p>
                      </div>
                    </div>
                  </div>

                  {/* Grade Score - Hero Style */}
                  <div className="relative group">
                    <div className={`h-16 w-16 ${getGradeGradient(product.color)} rounded-xl shadow-lg transition-all duration-500 flex flex-col items-center justify-center group-hover:scale-105 group-hover:shadow-xl relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-tl from-black/10 to-transparent rounded-xl"></div>
                      <div className="relative z-10 text-center">
                        <div className="text-white font-bold text-lg leading-none mb-0.5 drop-shadow">{product.grade}</div>
                        <div className="text-white/95 font-semibold text-xs leading-none">{product.score}/100</div>
                      </div>
                      <Star className="absolute top-1 right-1 w-2.5 h-2.5 text-white/40" />
                      <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/50 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Evaluations - Hero Style compatto */}
                <div className="bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-xl p-4 mb-4 border border-gray-100/40 shadow-inner">
                  <div className="space-y-3">
                    {/* Punti di forza */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <h4 className="font-semibold text-green-800 text-sm">Punti di forza</h4>
                      </div>
                      <div className="space-y-1">
                        {product.goodPoints.map((point, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-green-700 font-medium text-xs leading-relaxed">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Da considerare */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <h4 className="font-semibold text-orange-800 text-sm">Da considerare</h4>
                      </div>
                      <div className="space-y-1">
                        {product.concerns.map((point, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-orange-700 font-medium text-xs leading-relaxed">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation - Hero Style */}
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-green-50 to-emerald-50"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100/15 to-transparent"></div>
                  <div className="relative p-4 border border-green-200/40 transition-all duration-500">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-bold text-green-800 text-sm">Raccomandazione PetScan</h4>
                          <Star className="w-3 h-3 text-green-600" />
                        </div>
                        <p className="text-green-700 text-sm leading-snug font-medium">{product.suitableFor}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA finale - mantenuto uguale */}
        <div className="mt-24">
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-emerald-50 via-white to-green-50">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-transparent to-green-400/5"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/20 to-transparent rounded-full blur-3xl"></div>
            
            <CardContent className="relative p-12 lg:p-16 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="text-6xl mb-8">🔍</div>
                
                <h3 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                  Non trovi il tuo prodotto?
                </h3>
                
                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                  I nostri veterinari analizzeranno <span className="font-bold text-emerald-600">gratuitamente</span> qualsiasi cibo. 
                  Report professionale in 24 ore!
                </p>
                
                <button
                  onClick={() => scrollToSection("analisi-form")}
                  className="group relative bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="text-2xl">🩺</span>
                    Richiedi analisi gratuita
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500">✨</span>
                    <span className="font-medium">Analisi professionale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">📊</span>
                    <span className="font-medium">Report dettagliato</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">🆓</span>
                    <span className="font-medium">Sempre gratuito</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductExamples;
