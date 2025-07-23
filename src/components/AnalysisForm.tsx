
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Search, Heart, Upload, X, FileText, CheckCircle, Sparkles, PawPrint, Shield, Star } from 'lucide-react';
import { sendAnalysisRequest, AnalysisFormData } from '@/utils/emailService';
import { useToast } from '@/hooks/use-toast';

const AnalysisForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    productName: '',
    petType: '',
    petAge: '',
    petWeight: '',
    allergies: '',
    healthConditions: '',
    email: '',
    whatsapp: ''
  });

  // Check if coming back from successful submission
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submitted') === 'true') {
      setIsSubmitted(true);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Form submission started...');
      
      const analysisData: AnalysisFormData = {
        ...formData,
        files
      };

      const success = await sendAnalysisRequest(analysisData);

      if (success) {
        console.log('Form submitted successfully');
        setIsSubmitted(true);
        
        toast({
          title: "✅ Richiesta inviata con successo!",
          description: "Riceverai l'analisi via email entro 24-48 ore.",
        });
        
        // Reset form
        setFormData({
          productName: '',
          petType: '',
          petAge: '',
          petWeight: '',
          allergies: '',
          healthConditions: '',
          email: '',
          whatsapp: ''
        });
        setFiles([]);
      } else {
        throw new Error('Errore durante l\'invio del form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "❌ Errore durante l'invio",
        description: "Si è verificato un problema. Riprova più tardi o contattaci direttamente a alessandro.miu@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
      return isValidType && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      toast({
        title: "Alcuni file non sono stati caricati",
        description: "Accettiamo solo file PDF, JPG, PNG fino a 10MB ciascuno.",
        variant: "destructive",
      });
    }

    setFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      productName: '',
      petType: '',
      petAge: '',
      petWeight: '',
      allergies: '',
      healthConditions: '',
      email: '',
      whatsapp: ''
    });
    setFiles([]);
  };

  // Success state
  if (isSubmitted) {
    return (
      <section id="analisi-form" className="py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-br from-orange-50/40 via-amber-50/30 to-green-50/40 overflow-hidden relative">
        {/* Floating pet-themed decorations */}
        <div className="absolute top-10 left-10 opacity-10">
          <PawPrint className="w-20 h-20 text-orange-400 animate-pulse" />
        </div>
        <div className="absolute top-32 right-20 opacity-10">
          <Heart className="w-16 h-16 text-pink-400 animate-pulse delay-1000" />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-10">
          <PawPrint className="w-24 h-24 text-green-400 animate-pulse delay-2000" />
        </div>
        
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl shadow-orange-100/50 border border-orange-100/50">
              {/* Success decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full mb-6 shadow-lg relative">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                    <PawPrint className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                    🎉 Richiesta inviata con successo!
                  </span>
                </h2>
                
                <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  La tua richiesta di analisi è stata inviata con successo! 🐾
                  Riceverai l'analisi personalizzata del cibo del tuo amico peloso 
                  <span className="font-semibold text-orange-700"> entro 24-48 ore</span> all'indirizzo email fornito.
                </p>
                
                <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-6 mb-8 border border-orange-100/50">
                  <div className="flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Cosa succede ora? 🐕🐱</h3>
                  </div>
                  <ul className="text-gray-700 space-y-3 text-left max-w-md mx-auto">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>🔍 Analizzeremo il prodotto indicato</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>💚 Valuteremo la compatibilità con il tuo pet</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>📧 Ti invieremo un report dettagliato via email</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>✨ Include consigli personalizzati e alternative</span>
                    </li>
                  </ul>
                </div>
                
                <Button
                  onClick={resetForm}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Analizza un altro prodotto 🐾
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="analisi-form" className="py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-br from-orange-50/40 via-amber-50/30 to-green-50/40 overflow-hidden relative">
      {/* Enhanced background decorative elements with pet theme */}
      <div className="absolute top-20 right-10 opacity-10">
        <PawPrint className="w-32 h-32 text-orange-300 animate-pulse" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10">
        <Heart className="w-40 h-40 text-pink-300 animate-pulse delay-1000" />
      </div>
      <div className="absolute top-1/2 left-1/4 opacity-5">
        <PawPrint className="w-24 h-24 text-green-300 animate-pulse delay-2000" />
      </div>
      <div className="absolute top-40 left-20 opacity-8">
        <Star className="w-16 h-16 text-yellow-300 animate-pulse delay-3000" />
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl mb-6 shadow-lg relative">
            <Search className="w-8 h-8 text-orange-600" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
              <PawPrint className="w-2 h-2 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Analisi{' '}
            <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              gratuita
            </span>{' '}
            per il tuo 🐾
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Compila il form qui sotto e riceverai l'analisi personalizzata del cibo del tuo amico peloso{' '}
            <span className="font-semibold text-orange-700">entro 24 ore</span>. 
            <br />
            <span className="text-sm text-gray-500 mt-2 block">🎯 Servizio completamente gratuito durante la fase beta</span>
          </p>
        </div>

        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl shadow-orange-100/50 border border-orange-100/50">
          {/* Enhanced form decorative corner elements */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-30"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full opacity-30"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Info Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-orange-100">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center relative">
                  <span className="text-orange-600 font-bold text-sm">1</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🍽️</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Informazioni sul prodotto 🥫</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="productName" className="block text-sm font-semibold text-gray-700 flex items-center">
                    🏷️ Nome del prodotto *
                  </label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="es. Royal Canin Adult, Hill's Science Diet..."
                    className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="petType" className="block text-sm font-semibold text-gray-700 flex items-center">
                    🐾 Tipo di animale *
                  </label>
                  <select
                    id="petType"
                    name="petType"
                    value={formData.petType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-md"
                    required
                  >
                    <option value="">Seleziona il tuo amico...</option>
                    <option value="cane">🐕 Cane</option>
                    <option value="gatto">🐱 Gatto</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pet Details Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-green-100">
                <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center relative">
                  <span className="text-green-600 font-bold text-sm">2</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                    <PawPrint className="w-2 h-2 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Dettagli del tuo amico peloso 🐕🐱</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="petAge" className="block text-sm font-semibold text-gray-700 flex items-center">
                    🎂 Età dell'animale
                  </label>
                  <input
                    type="text"
                    id="petAge"
                    name="petAge"
                    value={formData.petAge}
                    onChange={handleChange}
                    placeholder="es. 3 anni, 8 mesi..."
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-md"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="petWeight" className="block text-sm font-semibold text-gray-700 flex items-center">
                    ⚖️ Peso (kg)
                  </label>
                  <input
                    type="text"
                    id="petWeight"
                    name="petWeight"
                    value={formData.petWeight}
                    onChange={handleChange}
                    placeholder="es. 15 kg, 4.5 kg..."
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Health Info Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-red-100">
                <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-red-50 rounded-lg flex items-center justify-center relative">
                  <span className="text-red-600 font-bold text-sm">3</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full flex items-center justify-center">
                    <Shield className="w-2 h-2 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Salute e benessere 💊❤️</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="allergies" className="block text-sm font-semibold text-gray-700 flex items-center">
                    🚫 Allergie o intolleranze
                  </label>
                  <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="es. pollo, cereali, latticini... (lascia vuoto se nessuna)"
                    className="w-full px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-md"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="healthConditions" className="block text-sm font-semibold text-gray-700 flex items-center">
                    🏥 Condizioni di salute particolari
                  </label>
                  <textarea
                    id="healthConditions"
                    name="healthConditions"
                    value={formData.healthConditions}
                    onChange={handleChange}
                    placeholder="es. problemi renali, sovrappeso, digestione sensibile..."
                    rows={3}
                    className="w-full px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-purple-100">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center relative">
                  <span className="text-purple-600 font-bold text-sm">4</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full flex items-center justify-center">
                    <FileText className="w-2 h-2 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Documenti veterinari 📋 (opzionale)</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4 flex items-center">
                    📎 Carica documenti veterinari, note mediche o libretti sanitari per un'analisi più precisa
                  </p>
                  
                  <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-all duration-300 bg-gradient-to-br from-purple-50/50 to-white/50 hover:from-purple-50/70 hover:to-purple-50/40 hover:shadow-lg">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer block">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl mb-4 relative">
                        <Upload className="w-6 h-6 text-purple-600" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center">
                          <PawPrint className="w-2 h-2 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium mb-1">📂 Clicca per caricare i file o trascina qui</p>
                      <p className="text-sm text-gray-500">Massimo 5 file, 10MB ciascuno (PDF, JPG, PNG)</p>
                    </label>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-white rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate max-w-48">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-blue-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center relative">
                  <span className="text-blue-600 font-bold text-sm">5</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full flex items-center justify-center">
                    <Mail className="w-2 h-2 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Come contattarti 📧📱</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-100/50">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-700 font-medium">
                      📬 Riceverai il risultato via email. Se preferisci, puoi anche riceverlo su WhatsApp! 💬
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 flex items-center">
                      📧 Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tuaemail@esempio.com"
                      className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-md"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 flex items-center">
                      💬 WhatsApp (opzionale)
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="es. +39 123 456 7890"
                      className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-2xl p-6 border border-green-100/50">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="privacy"
                  className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  required
                />
                <label htmlFor="privacy" className="text-sm text-gray-700 leading-relaxed">
                  🔒 Accetto che i miei dati vengano utilizzati esclusivamente per fornire l'analisi richiesta. 
                  I dati non saranno condivisi con terze parti e potranno essere cancellati in qualsiasi momento. 
                  Il servizio è completamente <span className="font-semibold text-orange-700">gratuito</span> durante la fase beta.
                  <span className="block mt-2 text-xs text-gray-500">🐾 I tuoi dati sono al sicuro con noi!</span>
                </label>
              </div>
            </div>

            {/* Enhanced Submit Section */}
            <div className="text-center pt-6 space-y-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-12 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 w-full sm:w-auto transform hover:scale-105 disabled:hover:scale-100 relative overflow-hidden"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Invio in corso... 🚀
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Analizza il cibo del mio pet 🐾
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Button>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>🎯 Riceverai l'analisi dettagliata via email entro 24 ore</span>
              </div>
              
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mt-4">
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>Sicuro al 100%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-pink-500" />
                  <span>Fatto con amore</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>Servizio gratuito</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AnalysisForm;
