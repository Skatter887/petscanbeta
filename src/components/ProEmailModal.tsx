
import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ProEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProEmailModal = ({ isOpen, onClose }: ProEmailModalProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email richiesta",
        description: "Inserisci il tuo indirizzo email per continuare",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Email non valida",
        description: "Inserisci un indirizzo email valido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Sending Pro prospect email for:', email);

    try {
      // Create FormData for FormSubmit
      const formData = new FormData();
      
      // FormSubmit configuration
      formData.append('_subject', 'Prospect PRO');
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');
      
      // Email content
      const message = `Un utente ha lasciato il proprio contatto per PetScan Pro: ${email}`;
      formData.append('Messaggio', message);
      formData.append('Email_Prospect', email);
      formData.append('Data', new Date().toLocaleString('it-IT'));

      console.log('Sending to FormSubmit...');
      
      const response = await fetch('https://formsubmit.co/alessandro.miu@gmail.com', {
        method: 'POST',
        body: formData,
      });

      console.log('FormSubmit response status:', response.status);
      
      if (response.ok) {
        console.log('Pro prospect email sent successfully');
        setIsSuccess(true);
        setEmail('');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending prospect email:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setEmail('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
                Resta aggiornato su PetScan Pro
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center text-gray-600 mb-4">
                Ti avviseremo quando le nuove funzionalità saranno disponibili
              </div>
              
              <div>
                <Input
                  type="email"
                  placeholder="Il tuo indirizzo email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Annulla
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Invio...' : 'Invia'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Grazie!
            </h3>
            <p className="text-gray-600 mb-6">
              Ti aggiorneremo appena PetScan Pro sarà disponibile.
            </p>
            
            <Button
              onClick={handleClose}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Perfetto
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProEmailModal;
