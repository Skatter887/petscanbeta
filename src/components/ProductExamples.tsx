import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle, Zap, Leaf } from "lucide-react";

const ProductExamples = () => {
  const products = [
    {
      name: "Royal Canin Adult",
      brand: "Royal Canin",
      score: 85,
      evaluationStatus: 'approved' as const,
      evaluationLabel: "APPROVATO",
      nutritionalValues: [
        { label: "Proteine", value: 26, status: 'excellent' as const, icon: "protein" },
        { label: "Grassi", value: 14, status: 'good' as const, icon: "fat" },
        { label: "Fibre", value: 3.4, status: 'good' as const, icon: "fiber" },
        { label: "Ceneri", value: 7.2, status: 'fair' as const, icon: "ash" },
        { label: "Umidità", value: 9.5, status: 'excellent' as const, icon: "moisture" }
      ],
      recommendation: "Ottima scelta per cani adulti di taglia media. Formula bilanciata con proteine di alta qualità.",
      image: "/lovable-uploads/233a9caf-acb7-4486-8261-786d974aa4a5.png",
      type: "cane"
    },
    {
      name: "Hill's Science Diet",
      brand: "Hill's",
      score: 78,
      evaluationStatus: 'could-be-better' as const,
      evaluationLabel: "POTREBBE ESSERE MIGLIORE",
      nutritionalValues: [
        { label: "Proteine", value: 22, status: 'good' as const, icon: "protein" },
        { label: "Grassi", value: 15, status: 'good' as const, icon: "fat" },
        { label: "Fibre", value: 2.8, status: 'fair' as const, icon: "fiber" },
        { label: "Ceneri", value: 6.5, status: 'good' as const, icon: "ash" },
        { label: "Umidità", value: 10, status: 'excellent' as const, icon: "moisture" }
      ],
      recommendation: "Prodotto accettabile con formulazione veterinaria, ma esistono alternative con ingredienti più naturali.",
      image: "/lovable-uploads/fcc92b02-aaac-410b-a57b-0a36b2439a8b.png",
      type: "cane"
    },
    {
      name: "Purina Felix",
      brand: "Purina",
      score: 45,
      evaluationStatus: 'not-approved' as const,
      evaluationLabel: "NON APPROVATO",
      nutritionalValues: [
        { label: "Proteine", value: 13, status: 'poor' as const, icon: "protein" },
        { label: "Grassi", value: 4, status: 'poor' as const, icon: "fat" },
        { label: "Fibre", value: 0.5, status: 'poor' as const, icon: "fiber" },
        { label: "Ceneri", value: 2.5, status: 'fair' as const, icon: "ash" },
        { label: "Umidità", value: 82, status: 'poor' as const, icon: "moisture" }
      ],
      recommendation: "Questo prodotto non è raccomandato per il tuo pet. Ti consigliamo di scegliere un'alternativa con migliori valori nutrizionali.",
      image: "/lovable-uploads/02bc290b-6eab-43aa-a59d-903d9e4cad84.png",
      type: "gatto"
    },
    {
      name: "Orijen Adult Dog",
      brand: "Orijen",
      score: 95,
      evaluationStatus: 'approved' as const,
      evaluationLabel: "APPROVATO",
      nutritionalValues: [
        { label: "Proteine", value: 38, status: 'excellent' as const, icon: "protein" },
        { label: "Grassi", value: 18, status: 'excellent' as const, icon: "fat" },
        { label: "Fibre", value: 4, status: 'excellent' as const, icon: "fiber" },
        { label: "Ceneri", value: 8, status: 'good' as const, icon: "ash" },
        { label: "Umidità", value: 12, status: 'excellent' as const, icon: "moisture" }
      ],
      recommendation: "Eccellente! Ingredienti freschi e alto contenuto proteico. Perfetto per cani attivi di tutte le età.",
      image: "/lovable-uploads/2c597613-c8a3-440a-9f97-06e814932fe9.png",
      type: "cane"
    }
  ];

  // Helper functions matching the real ProductAnalysisCard
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-primary';
      case 'good': return 'bg-secondary';
      case 'fair': return 'bg-accent';
      case 'poor': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getEvaluationBadgeClass = (status: 'approved' | 'could-be-better' | 'not-approved') => {
    switch (status) {
      case 'approved': return 'bg-green-500 hover:bg-green-600 text-white border-green-500';
      case 'could-be-better': return 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500';
      case 'not-approved': return 'bg-red-500 hover:bg-red-600 text-white border-red-500';
      default: return '';
    }
  };

  const getEvaluationIcon = (status: 'approved' | 'could-be-better' | 'not-approved') => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'could-be-better': return <Zap className="w-4 h-4 mr-1" />;
      case 'not-approved': return <XCircle className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Eccellente';
      case 'good': return 'Buono';
      case 'fair': return 'Discreto';
      case 'poor': return 'Scarso';
      default: return 'N/A';
    }
  };

  const getIconForNutrient = (icon: string) => {
    switch (icon) {
      case 'protein': return '💪';
      case 'fat': return '🥑';
      case 'fiber': return '🥦';
      case 'ash': return '🧱';
      case 'moisture': return '💧';
      default: return '📊';
    }
  };

  const getProgressColor = (evaluationStatus: 'approved' | 'could-be-better' | 'not-approved') => {
    switch (evaluationStatus) {
      case 'approved': return '#22c55e';
      case 'could-be-better': return '#f97316';
      case 'not-approved': return '#ef4444';
      default: return '#ef4444';
    }
  };

  const getScoreColor = (evaluationStatus: 'approved' | 'could-be-better' | 'not-approved') => {
    switch (evaluationStatus) {
      case 'approved': return '#22c55e';
      case 'could-be-better': return '#f97316';
      case 'not-approved': return '#ef4444';
      default: return '#ef4444';
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
        {/* Header */}
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

        {/* Grid di prodotti - Layout identico al vero ProductAnalysisCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {products.map((product, idx) => {
            const circumference = 2 * Math.PI * 40;
            const strokeDasharray = circumference;
            const strokeDashoffset = circumference - (product.score / 100) * circumference;

            return (
              <div key={idx} className="w-full">
                <Card className="w-full max-w-none mx-auto animate-fade-in" style={{ padding: 0, margin: '0 auto' }}>
                  <CardHeader className="text-center space-y-2 px-0" style={{ padding: '1rem 1rem 0.5rem 1rem' }}>
                    <div className="flex items-center justify-center space-x-3">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-gray-100"
                        />
                      )}
                      <div className="text-center">
                        <CardTitle className="text-lg font-bold text-gray-900 leading-tight mb-1">
                          {product.name}
                        </CardTitle>
                        <div className="mb-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border border-green-200">
                            {product.brand}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Circular Progress */}
                    <div className="flex items-center justify-center space-x-3">
                      <div className="relative">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="hsl(var(--muted))"
                            strokeWidth="5"
                            fill="none"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            strokeWidth="5"
                            fill="none"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke={getProgressColor(product.evaluationStatus)}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold" style={{ color: getScoreColor(product.evaluationStatus) }}>
                            {product.score}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: getScoreColor(product.evaluationStatus) }}>
                          {product.score}/100
                        </div>
                        <Badge 
                          className={`mt-1 ${getEvaluationBadgeClass(product.evaluationStatus)}`}
                        >
                          {getEvaluationIcon(product.evaluationStatus)}
                          {product.evaluationLabel}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 px-0" style={{ padding: '0 1rem 0.5rem 1rem' }}>
                    {/* Nutritional Analysis */}
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-2 flex items-center">
                        <Leaf className="w-4 h-4 mr-2" style={{ color: '#1FC77C' }} />
                        Analisi Nutrizionale
                      </h3>
                      
                      <div className="space-y-2">
                        {product.nutritionalValues.map((nutrient, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-accent rounded-lg">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {getIconForNutrient(nutrient.icon)}
                              </span>
                              <div>
                                <div className="font-medium text-foreground text-sm">
                                  {nutrient.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {nutrient.value}%
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <div 
                                className={`w-2 h-2 rounded-full ${getStatusColor(nutrient.status)}`}
                              />
                              <span className="text-xs font-medium text-foreground">
                                {getStatusText(nutrient.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendation */}
                    {product.recommendation && (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-primary mb-1 text-sm">
                              Raccomandazione
                            </h4>
                            <p className="text-xs text-foreground">
                              {product.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Success Message */}
                    {product.evaluationStatus === 'approved' && (
                      <div className="text-center">
                        <div className="text-xl mb-1">🎉</div>
                        <p className="text-sm font-medium text-primary">
                          Ottima Scelta per il tuo Pet!
                        </p>
                      </div>
                    )}

                    {/* Warning Message for "Could be better" */}
                    {product.evaluationStatus === 'could-be-better' && (
                      <div className="text-center">
                        <div className="text-xl mb-1">⚠️</div>
                        <p className="text-sm font-medium text-secondary">
                          Prodotto accettabile, ma esistono alternative migliori
                        </p>
                      </div>
                    )}

                    {/* Alert Message for "Not approved" */}
                    {product.evaluationStatus === 'not-approved' && (
                      <div className="text-center">
                        <div className="text-xl mb-1">❌</div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Ti consigliamo di scegliere un prodotto diverso
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* CTA Button "Scannerizza" inspired by the image design */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => scrollToSection("scannerizza-form")}
            className="group relative bg-white hover:bg-gray-50 text-gray-700 font-bold py-6 px-8 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.05] hover:-translate-y-2 backdrop-blur-sm"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.05)',
              minWidth: '320px',
              height: '80px'
            }}
          >
            {/* Animated PetScan border - always active */}
            <div className="absolute -inset-0.5 rounded-full opacity-100 animate-border-pulse">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-green-400 via-orange-400 to-green-400 animate-gradient-shift p-0.5">
                <div className="w-full h-full bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Enhanced glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400/30 via-orange-400/30 to-green-400/30 rounded-full blur-xl opacity-60 group-hover:opacity-100 animate-pulse transition-all duration-500 -z-10"></div>
            
            {/* Shimmer effect - always active */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer"></div>
            
            {/* Additional sparkle effects */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute top-4 left-8 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-6 right-12 w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-6 left-12 w-0.5 h-0.5 bg-green-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-4 right-8 w-0.5 h-0.5 bg-orange-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '1.5s' }}></div>
            </div>
            
            <div className="relative flex items-center justify-center space-x-4 h-full">
              {/* Barcode Scanner Icon - recreating the icon from the image */}
              <div className="relative">
                <svg width="48" height="36" viewBox="0 0 48 36" className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  {/* Scanner frame */}
                  <rect x="2" y="2" width="44" height="32" rx="4" ry="4" fill="none" stroke="currentColor" strokeWidth="2.5"/>
                  
                  {/* Corner brackets */}
                  <path d="M8 8L8 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 8L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  
                  <path d="M40 8L40 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M40 8L34 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  
                  <path d="M8 28L8 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 28L14 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  
                  <path d="M40 28L40 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M40 28L34 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  
                  {/* Barcode lines */}
                  <rect x="12" y="14" width="1.5" height="8" fill="currentColor"/>
                  <rect x="15" y="14" width="1" height="8" fill="currentColor"/>
                  <rect x="17.5" y="14" width="2" height="8" fill="currentColor"/>
                  <rect x="21" y="14" width="1" height="8" fill="currentColor"/>
                  <rect x="23.5" y="14" width="1.5" height="8" fill="currentColor"/>
                  <rect x="26.5" y="14" width="1" height="8" fill="currentColor"/>
                  <rect x="29" y="14" width="2" height="8" fill="currentColor"/>
                  <rect x="32.5" y="14" width="1" height="8" fill="currentColor"/>
                  <rect x="35" y="14" width="1.5" height="8" fill="currentColor"/>
                  
                  {/* Scanning line - animated */}
                  <rect x="10" y="18" width="28" height="1" fill="#22c55e" className="opacity-0 group-hover:opacity-100 group-hover:animate-pulse">
                    <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0s"/>
                  </rect>
                </svg>
                
                {/* Active scanning indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              </div>
              
              {/* Text */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  Scannerizza
                </div>
                <div className="text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-300 mt-1">
                  Inizia la tua prima analisi
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Sezione informativa aggiuntiva */}
        <div className="mt-16">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-gray-50 via-white to-green-50/30">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/3 via-transparent to-orange-400/3"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-100/10 to-transparent rounded-full blur-2xl"></div>
            
            <CardContent className="relative p-8 lg:p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="text-4xl mb-6">🔬</div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  Analisi scientifica <span className="text-green-600">gratuita</span>
                </h3>
                
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  I nostri algoritmi di AI combinati con ricerca peer-reviewed analizzano ogni ingrediente per garantire 
                  <br className="hidden sm:block" />
                  la migliore alimentazione per il tuo amico a quattro zampe.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="flex flex-col items-center p-4 bg-white/60 rounded-xl border border-gray-100/50 hover:shadow-md transition-all duration-300">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="font-semibold text-gray-800 text-sm">Risultati istantanei</div>
                    <div className="text-xs text-gray-600 mt-1">Analisi in tempo reale</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white/60 rounded-xl border border-gray-100/50 hover:shadow-md transition-all duration-300">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="font-semibold text-gray-800 text-sm">Precisione scientifica</div>
                    <div className="text-xs text-gray-600 mt-1">Basato su studi certificati</div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white/60 rounded-xl border border-gray-100/50 hover:shadow-md transition-all duration-300">
                    <div className="text-2xl mb-2">🆓</div>
                    <div className="font-semibold text-gray-800 text-sm">Sempre gratuito</div>
                    <div className="text-xs text-gray-600 mt-1">Nessun costo nascosto</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        @keyframes gradient-conic {
          0% {
            background: conic-gradient(from 0deg, #22c55e, #fb923c, #22c55e);
          }
          100% {
            background: conic-gradient(from 360deg, #22c55e, #fb923c, #22c55e);
          }
        }

        .bg-gradient-conic {
          background: conic-gradient(from 0deg, #22c55e, #fb923c, #22c55e);
        }

        @keyframes gradient-shift {
          0% {
            background: linear-gradient(45deg, #22c55e, #fb923c, #22c55e);
          }
          25% {
            background: linear-gradient(45deg, #fb923c, #22c55e, #fb923c);
          }
          50% {
            background: linear-gradient(45deg, #22c55e, #fb923c, #22c55e);
          }
          75% {
            background: linear-gradient(45deg, #fb923c, #22c55e, #fb923c);
          }
          100% {
            background: linear-gradient(45deg, #22c55e, #fb923c, #22c55e);
          }
        }

        .animate-gradient-shift {
          animation: gradient-shift 3s ease-in-out infinite;
        }

        @keyframes border-pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-border-pulse {
          animation: border-pulse 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default ProductExamples;