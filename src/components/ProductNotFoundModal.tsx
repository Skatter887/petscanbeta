import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

interface ProductNotFoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewSearch: () => void;
  onAddProduct: () => void;
}

const ProductNotFoundModal = ({ 
  isOpen, 
  onClose, 
  onNewSearch, 
  onAddProduct 
}: ProductNotFoundModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900">
            Prodotto non trovato
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          <div className="text-6xl">🔍</div>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            Il prodotto cercato non è presente nel nostro database. 
            <br />
            <span className="font-semibold text-gray-800">
              Aiutaci a migliorare PetScan.
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={onNewSearch}
              className="flex-1 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Search className="w-5 h-5 mr-2" />
              Effettua un'altra ricerca
            </Button>
            
            <Button
              onClick={onAddProduct}
              className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Inserisci il prodotto mancante
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductNotFoundModal; 