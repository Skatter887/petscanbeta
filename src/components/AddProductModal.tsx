import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { sendProductRequest } from '@/utils/productRequestService';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  eanCode: string;
}

const AddProductModal = ({ isOpen, onClose, eanCode }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    brand: '',
    productName: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Il nome del brand è obbligatorio';
    }
    
    if (!formData.productName.trim()) {
      newErrors.productName = 'Il nome del prodotto è obbligatorio';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await sendProductRequest({
        ean: eanCode,
        brand: formData.brand.trim(),
        productName: formData.productName.trim(),
        email: formData.email.trim() || undefined
      });
      
      if (result.success) {
        setIsSubmitted(true);
        // Chiudi il modal dopo 3 secondi
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
          setFormData({ brand: '', productName: '', email: '' });
          setErrors({});
        }, 3000);
      } else {
        alert(result.message || 'Errore nell\'invio. Riprova.');
      }
    } catch (error) {
      console.error('Error submitting product request:', error);
      alert('Errore nell\'invio. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Rimuovi l'errore quando l'utente inizia a digitare
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-6 py-8">
            <div className="text-6xl">🎉</div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">
                Richiesta inviata con successo!
              </h3>
              <p className="text-gray-600">
                Grazie! La tua richiesta è stata inviata. 
                <br />
                Ti avviseremo non appena l'analisi sarà disponibile.
              </p>
            </div>
            <div className="flex items-center justify-center text-green-500">
              <CheckCircle className="w-8 h-8 mr-2" />
              <span className="font-semibold">Successo</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900">
            Inserisci il prodotto mancante
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Codice EAN (precompilato) */}
            <div className="space-y-2">
              <Label htmlFor="ean" className="text-sm font-medium text-gray-700">
                Codice EAN
              </Label>
              <Input
                id="ean"
                type="text"
                value={eanCode}
                disabled
                className="bg-gray-50 text-gray-600"
              />
            </div>
            
            {/* Nome del brand */}
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-sm font-medium text-gray-700">
                Nome del brand <span className="text-red-500">*</span>
              </Label>
              <Input
                id="brand"
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="Es. Royal Canin, Purina, Almo Nature..."
                className={errors.brand ? 'border-red-500' : ''}
              />
              {errors.brand && (
                <p className="text-sm text-red-500">{errors.brand}</p>
              )}
            </div>
            
            {/* Nome del prodotto */}
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-sm font-medium text-gray-700">
                Nome del prodotto <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="productName"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="Es. Croccantini per gatti adulti..."
                className={errors.productName ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.productName && (
                <p className="text-sm text-red-500">{errors.productName}</p>
              )}
            </div>
            
            {/* Email (opzionale) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email (opzionale)
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Riceverai una notifica quando l'analisi sarà disponibile"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annulla
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Invia richiesta
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal; 