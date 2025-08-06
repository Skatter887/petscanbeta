import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, ScanLine, Search, X, AlertCircle, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onManualEntry: (input: string) => void;
  isLoading?: boolean;
  resetTrigger?: number;
  onScannerStateChange?: (isActive: boolean) => void;
}

const BarcodeScanner = ({ onScan, onManualEntry, isLoading, resetTrigger, onScannerStateChange }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [inputMode, setInputMode] = useState<'scanner' | 'manual'>('scanner');
  const [error, setError] = useState<string | null>(null);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const scanningRef = useRef<boolean>(false);
  const controlsRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Inizializza il code reader una sola volta
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

  // Avvia automaticamente la scansione quando il componente è montato in modalità scanner
  useEffect(() => {
    if (inputMode === 'scanner' && !isScanning) {
      // Avvia immediatamente la scansione
      const timer = setTimeout(() => {
        startScanning();
      }, 200);
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      if (isScanning) stopScanning();
    };
  }, [inputMode]);

  // Reset del campo di input
  useEffect(() => {
    if (resetTrigger) {
      setManualInput('');
    }
  }, [resetTrigger]);

  // Notifica lo stato dello scanner
  useEffect(() => {
    onScannerStateChange?.(isScanning);
  }, [isScanning, onScannerStateChange]);

  const startScanning = async () => {
    if (!codeReader.current) {
      setError('Scanner non inizializzato');
      return;
    }

    setIsScanning(true);
    setError(null);
    setShowTimeoutMessage(false);
    scanningRef.current = true;

    // Timeout per il messaggio di aiuto
    timeoutRef.current = setTimeout(() => {
      if (scanningRef.current) {
        setShowTimeoutMessage(true);
      }
    }, 5000);

    try {
      // Configurazione più semplice e compatibile per la videocamera
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isMobile ? 'environment' : 'user'
        }
      };

      controlsRef.current = await codeReader.current.decodeFromConstraints(
        constraints,
        videoRef.current!,
        (result, error) => {
          if (result && scanningRef.current) {
            const scannedText = result.getText();
            console.log('Barcode scanned:', scannedText);
            
            // Feedback vibrazione su mobile
            if (isMobile && navigator.vibrate) {
              navigator.vibrate(200);
            }
            
            stopScanning();
            onScan(scannedText);
            
            toast({
              title: "Barcode scansionato!",
              description: `Codice: ${scannedText}`,
            });
          }
          
          if (error && !(error instanceof NotFoundException)) {
            console.warn('Scanning error:', error);
          }
        }
      );
    } catch (error: any) {
      console.error('Start scanning error:', error);
      
      // Gestione errori più specifica
      let errorMessage = 'Errore nell\'avvio della scansione';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permesso fotocamera negato. Abilita l\'accesso alla fotocamera.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Nessuna fotocamera trovata sul dispositivo.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Fotocamera già in uso da un\'altra applicazione.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Configurazione fotocamera non supportata. Riprova.';
      } else if (error.message) {
        errorMessage += ': ' + error.message;
      }
      
      setError(errorMessage);
      setIsScanning(false);
      scanningRef.current = false;
    }
  };

  const stopScanning = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    
    scanningRef.current = false;
    setIsScanning(false);
    setShowTimeoutMessage(false);
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onManualEntry(manualInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualSubmit();
    }
  };

  const switchToManual = () => {
    stopScanning();
    setInputMode('manual');
  };

  const switchToScanner = () => {
    setInputMode('scanner');
  };

  return (
    <div className="w-full flex flex-col gap-2 rounded-xl bg-transparent p-0 relative shadow-none box-border max-w-full overflow-hidden">
      {/* Scanner Mode */}
      {inputMode === 'scanner' && (
        <div className="flex flex-col gap-1 w-full max-w-full box-border">
          {/* Camera Preview - SEMPRE visibile quando in modalità scanner */}
          <div className="relative w-full max-w-full box-border">
            <video
              ref={videoRef}
              className="w-full h-64 md:h-96 bg-black rounded-xl object-cover"
              playsInline
              muted
              autoPlay
              style={{
                objectFit: 'cover',
              }}
            />
            
            {/* Overlay con frame rettangolare - SEMPRE visibile quando in modalità scanner */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="relative w-48 h-32 md:w-64 md:h-40">
                {/* Bordo animato verde */}
                <div className="absolute inset-0 border-2 rounded-lg animate-pulse" 
                     style={{ 
                       borderColor: '#1FC77C',
                       boxShadow: '0 0 20px rgba(31, 199, 124, 0.5)',
                       animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                     }} />
                
                {/* Corner indicators */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white rounded-tl" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white rounded-tr" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white rounded-bl" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white rounded-br" />
              </div>
            </div>
            
            {/* Pulsanti di controllo - SEMPRE visibili quando in modalità scanner */}
            <div className="absolute top-2 right-2 z-30 flex gap-2">
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
                onClick={stopScanning}
                variant="destructive"
                size="sm"
                className="rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Messaggio di timeout */}
            {showTimeoutMessage && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-black/80 text-white px-4 py-2 rounded-lg text-center max-w-xs">
                <p className="text-sm">
                  Avvicina meglio il codice a barre o verifica la luce
                </p>
              </div>
            )}
            
            {/* Istruzioni - SEMPRE visibili quando in modalità scanner */}
            <div className="absolute bottom-1 left-2 right-2 text-center z-30">
              <p className="text-xs text-white bg-black/50 rounded px-2 py-1">
                {isMobile ? 'Inquadra il barcode e mantieni fermo il dispositivo' : 'Inquadra il barcode nel riquadro'}
              </p>
            </div>
          </div>

          {/* Error Display - SOLO quando c'è un errore */}
          {error && (
            <div className="flex flex-col space-y-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg w-full max-w-full box-border">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <p className="text-xs text-destructive flex-1">{error}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setError(null);
                    startScanning();
                  }}
                  size="sm"
                  className="text-xs bg-destructive text-white hover:bg-destructive/90"
                >
                  Riprova
                </Button>
                <Button
                  onClick={switchToManual}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  Inserisci manualmente
                </Button>
              </div>
            </div>
          )}

          {/* Switch to manual input - SOLO quando non c'è errore */}
          {!error && (
            <div className="text-center w-full max-w-full box-border">
              <Button
                variant="ghost"
                onClick={switchToManual}
                className="text-xs hover:bg-accent-foreground/10"
                style={{ color: '#1FC77C' }}
                disabled={isLoading}
              >
                Preferisci inserire manualmente?
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Manual Input Mode */}
      {inputMode === 'manual' && (
        <div className="flex flex-col gap-2 w-full max-w-full box-border">
          <div className="flex gap-2 items-center w-full max-w-full box-border">
            <Input
              type="text"
              placeholder="es. 8001154127065 o Almo Nature"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="h-9 md:h-10 text-sm md:text-base focus:ring-2 flex-1"
              style={{ 
                borderColor: '#F5953B'
              }}
            />
            <Button
              onClick={handleManualSubmit}
              disabled={!manualInput.trim() || isLoading}
              className="h-9 md:h-10 text-sm md:text-base font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200 px-3 rounded-xl"
              size="lg"
              style={{
                backgroundColor: '#F5953B',
              }}
            >
              <Search className="w-4 md:w-5 h-4 md:h-5" />
            </Button>
          </div>

          <div className="text-center w-full max-w-full box-border">
            <Button
              variant="ghost"
              onClick={switchToScanner}
              className="text-xs hover:bg-accent-foreground/10"
              style={{ color: '#1FC77C' }}
              disabled={isLoading}
            >
              Preferisci usare la fotocamera?
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;