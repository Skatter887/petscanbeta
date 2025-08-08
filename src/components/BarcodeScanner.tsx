import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onManualEntry: (input: string) => void;
  isLoading?: boolean;
  resetTrigger?: number;
  onScannerStateChange?: (isActive: boolean) => void;
  onClose?: () => void; // Nuova prop per chiudere lo scanner
}

const BarcodeScanner = ({ onScan, onManualEntry, isLoading, resetTrigger, onScannerStateChange, onClose }: BarcodeScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [showPermissionError, setShowPermissionError] = useState(false);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<any>(null);

  // Inizializza il code reader
  useEffect(() => {
    if (!codeReader.current) {
      try {
        codeReader.current = new BrowserMultiFormatReader();
      } catch (error) {
        console.error('Error initializing BrowserMultiFormatReader:', error);
        setError('Browser non supportato per la scansione di barcode');
      }
    }
  }, []);

  // Avvia immediatamente la scansione quando il componente è montato
  useEffect(() => {
    startScanning();
    
    return () => {
      stopScanning();
    };
  }, []);

  // Notifica lo stato dello scanner
  useEffect(() => {
    onScannerStateChange?.(true);
  }, [onScannerStateChange]);

  const startScanning = async () => {
    if (!codeReader.current) {
      setError('Scanner non inizializzato');
      return;
    }

    setError(null);
    setShowPermissionError(false);

    try {
      // Configurazione ottimizzata per fotocamera posteriore su mobile
      const videoConstraints: MediaTrackConstraints = {
        width: { ideal: 1920, min: 1280 },
        height: { ideal: 1080, min: 720 },
        frameRate: { ideal: 30, min: 15 }
      };

      // Su mobile, forza l'uso della fotocamera posteriore
      if (isMobile) {
        videoConstraints.facingMode = 'environment';
      } else {
        videoConstraints.facingMode = 'user';
      }

      // Avvia immediatamente la videocamera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Avvia la scansione del barcode
      controlsRef.current = await codeReader.current.decodeFromConstraints(
        {
          video: videoConstraints
        },
        videoRef.current!,
        (result, error) => {
          if (result) {
            const scannedText = result.getText();
            console.log('Barcode scanned:', scannedText);
            
            // Feedback vibrazione su mobile
            if (isMobile && navigator.vibrate) {
              navigator.vibrate(200);
            }
            
            // Chiusura immediata dello scanner
            stopScanning();
            
            // Passaggio immediato del valore EAN alla funzione handleScan
            onScan(scannedText);
            
            // Toast di conferma
            toast({
              title: "Barcode scansionato!",
              description: `Codice: ${scannedText}`,
            });

            // Chiudi lo scanner dopo la scansione
            if (onClose) {
              setTimeout(() => onClose(), 100);
            }
          }
          
          if (error && !(error instanceof NotFoundException)) {
            console.warn('Scanning error:', error);
          }
        }
      );
    } catch (error: any) {
      console.error('Start scanning error:', error);
      
      let errorMessage = 'Errore nell\'avvio della scansione';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Accesso alla fotocamera negato. Abilita i permessi nelle impostazioni per utilizzare lo scanner.';
        setShowPermissionError(true);
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Nessuna fotocamera trovata sul dispositivo.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Fotocamera già in uso da un\'altra applicazione.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Configurazione fotocamera non supportata. Riprova.';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Accesso alla fotocamera negato per motivi di sicurezza.';
        setShowPermissionError(true);
      } else if (error.name === 'ConstraintError') {
        errorMessage = 'Accesso alla fotocamera negato. Abilita i permessi nelle impostazioni per utilizzare lo scanner.';
        setShowPermissionError(true);
      } else if (error.message) {
        errorMessage += ': ' + error.message;
      }
      
      setError(errorMessage);
    }
  };

  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    
    // Ferma la videocamera
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleClose = () => {
    stopScanning();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-50 bg-black' : 'w-full max-w-full box-border'}`}>
      {/* Camera Preview - Fullscreen su mobile */}
      <div className={`relative ${isMobile ? 'w-full h-full' : 'w-full max-w-full box-border'}`}>
        <video
          ref={videoRef}
          className={`${isMobile ? 'w-full h-full object-cover' : 'w-full h-64 md:h-96'} bg-black`}
          playsInline
          muted
          autoPlay
          style={{
            objectFit: 'cover',
            paddingTop: isMobile ? 'env(safe-area-inset-top)' : '0',
            paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : '0',
            paddingLeft: isMobile ? 'env(safe-area-inset-left)' : '0',
            paddingRight: isMobile ? 'env(safe-area-inset-right)' : '0',
          }}
        />
        
        {/* Overlay scuro con area di scansione trasparente */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none z-20">
          {/* Area di scansione trasparente centrata */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-72 h-48 md:w-96 md:h-64">
              {/* Area trasparente per la scansione */}
              <div className="absolute inset-0 bg-transparent border-3 border-white rounded-lg shadow-lg" 
                   style={{ borderWidth: '3px' }} />
              
              {/* Corner indicators più visibili e grandi */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-white rounded-br" />
              
              {/* Indicatore di scansione animato */}
              <div className="absolute inset-0 border-2 border-green-400 rounded-lg opacity-75 animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Pulsanti di controllo */}
        <div className={`absolute ${isMobile ? 'top-4 right-4' : 'top-2 right-2'} z-30 flex gap-2`} 
             style={{ 
               top: isMobile ? 'calc(1rem + env(safe-area-inset-top))' : '0.5rem'
             }}>
          <Button
            onClick={() => {
              stopScanning();
              setTimeout(() => startScanning(), 500);
            }}
            variant="secondary"
            size="sm"
            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <Camera className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleClose}
            variant="destructive"
            size="sm"
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Istruzioni */}
        <div className={`absolute ${isMobile ? 'bottom-4 left-4 right-4' : 'bottom-1 left-2 right-2'} text-center z-30`}
             style={{ 
               bottom: isMobile ? 'calc(1rem + env(safe-area-inset-bottom))' : '0.25rem'
             }}>
          <p className="text-sm text-white bg-black/50 rounded px-3 py-2">
            {isMobile ? 'Inquadra il barcode e mantieni fermo il dispositivo' : 'Inquadra il barcode nel riquadro'}
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className={`${isMobile ? 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-white rounded-lg p-4 max-w-sm w-full mx-4' : 'flex flex-col space-y-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg w-full max-w-full box-border'}`}>
          <div className={`flex items-center space-x-2 ${isMobile ? 'mb-3' : ''}`}>
            <AlertCircle className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-destructive`} />
            <p className={`${isMobile ? 'text-sm' : 'text-xs'} text-destructive flex-1`}>{error}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setError(null);
                setShowPermissionError(false);
                startScanning();
              }}
              size="sm"
              className="text-xs bg-destructive text-white hover:bg-destructive/90"
            >
              Riprova
            </Button>
            <Button
              onClick={() => setShowPermissionError(false)}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Chiudi
            </Button>
          </div>
        </div>
      )}

      {/* Popup per errore permessi fotocamera */}
      {showPermissionError && (
        <div className={`${isMobile ? 'absolute inset-0' : 'fixed inset-0'} bg-black/90 flex items-center justify-center z-50 p-4`}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h3 className="text-xl font-bold text-gray-900">Permesso Negato</h3>
            </div>
            <p className="text-gray-700 mb-6 text-base leading-relaxed">
              Accesso alla fotocamera negato. Abilita i permessi nelle impostazioni per utilizzare lo scanner.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowPermissionError(false)}
                variant="outline"
                className="flex-1 h-12 text-base font-medium"
              >
                Chiudi
              </Button>
              <Button
                onClick={() => {
                  setShowPermissionError(false);
                  setError(null);
                  startScanning();
                }}
                className="flex-1 h-12 text-base font-medium"
                style={{ backgroundColor: '#F5953B' }}
              >
                Riprova
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;