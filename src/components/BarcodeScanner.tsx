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
}

const BarcodeScanner = ({ onScan, onManualEntry, isLoading }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [inputMode, setInputMode] = useState<'scanner' | 'manual'>('scanner');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const scanningRef = useRef<boolean>(false);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    // Check browser compatibility
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Il tuo browser non supporta l\'accesso alla fotocamera. Usa un browser moderno come Chrome, Firefox o Safari.');
      return;
    }

    // Initialize the code reader
    try {
      codeReader.current = new BrowserMultiFormatReader();
    } catch (error) {
      console.error('Error initializing BrowserMultiFormatReader:', error);
      setError('Browser non supportato per la scansione di barcode');
      return;
    }
    
    // Get available camera devices
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          setDevices(videoDevices);
          
          // Try to select the back camera for mobile devices
          if (isMobile && videoDevices.length > 1) {
            const backCamera = videoDevices.find(device => 
              device.label.toLowerCase().includes('back') || 
              device.label.toLowerCase().includes('rear') ||
              device.label.toLowerCase().includes('environment')
            );
            if (backCamera) {
              setSelectedDeviceId(backCamera.deviceId);
            }
          } else if (videoDevices.length > 0) {
            setSelectedDeviceId(videoDevices[0].deviceId);
          }
        })
        .catch(error => {
          console.error('Error enumerating devices:', error);
          setError('Impossibile accedere ai dispositivi multimediali');
        });
    } else {
      setError('Il tuo browser non supporta l\'accesso alla fotocamera');
    }

    return () => {
      stopScanning();
    };
  }, [isMobile]);

  useEffect(() => {
    if (inputMode === 'scanner' && !isScanning) {
      startScanning();
    }
    // Ferma la scansione quando si esce dalla modalità scanner
    return () => {
      if (isScanning) stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMode]);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: isMobile ? { ideal: 'environment' } : undefined
        } 
      });
      
      // Immediately stop the test stream
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setError(null);
      return true;
    } catch (error: any) {
      console.error('Camera permission error:', error);
      setHasPermission(false);
      
      if (error.name === 'NotAllowedError') {
        setError('Permesso fotocamera negato. Abilita l\'accesso alla fotocamera nelle impostazioni del browser.');
      } else if (error.name === 'NotFoundError') {
        setError('Nessuna fotocamera trovata sul dispositivo.');
      } else if (error.name === 'NotReadableError') {
        setError('Fotocamera già in uso da un\'altra applicazione.');
      } else {
        setError('Impossibile accedere alla fotocamera: ' + error.message);
      }
      return false;
    }
  };

  const startScanning = async () => {
    // Initialize code reader if not already done
    if (!codeReader.current) {
      try {
        codeReader.current = new BrowserMultiFormatReader();
      } catch (error) {
        console.error('Error initializing code reader:', error);
        setError('Impossibile inizializzare lo scanner. Verifica che il browser supporti la fotocamera.');
        return;
      }
    }

    const hasPermissionResult = await checkCameraPermission();
    if (!hasPermissionResult) return;

    // Set scanning state first to make video element available
    setIsScanning(true);
    setError(null);
    scanningRef.current = true;

    // Wait a short moment for the video element to be rendered
    setTimeout(async () => {
      if (!videoRef.current) {
        setError('Elemento video non disponibile. Riprova.');
        setIsScanning(false);
        scanningRef.current = false;
        return;
      }

      try {
        controlsRef.current = await codeReader.current!.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error) => {
            if (result && scanningRef.current) {
              const scannedText = result.getText();
              console.log('Barcode scanned:', scannedText);
              
              // Vibration feedback for mobile
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
        setError('Errore nell\'avvio della scansione: ' + error.message);
        setIsScanning(false);
        scanningRef.current = false;
      }
    }, 100); // Small delay to ensure video element is rendered
  };

  const stopScanning = () => {
    scanningRef.current = false;
    setIsScanning(false);
    
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch (error) {
        console.warn('Error stopping scanner:', error);
      }
      controlsRef.current = null;
    }
    
    if (codeReader.current) {
      try {
        codeReader.current.reset();
      } catch (error) {
        console.warn('Error resetting code reader:', error);
      }
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onManualEntry(manualInput.trim());
      setManualInput('');
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
    setError(null);
  };

  return (
    <div className="w-full flex flex-col gap-2 rounded-xl bg-transparent p-0 relative shadow-none box-border max-w-full overflow-hidden">
      {/* Scanner Mode - nessun tab, solo camera */}
      {inputMode === 'scanner' && (
        <div className="flex flex-col gap-1 w-full max-w-full box-border">
          {/* Camera Preview - compatta */}
          <div className="relative w-full max-w-full box-border">
            <video
              ref={videoRef}
              className={`w-full h-24 md:h-32 bg-black rounded-xl object-cover ${isScanning ? 'block' : 'hidden'}`}
              playsInline
              muted
              autoPlay
            />
            {isScanning && (
              <>
                <div className="absolute inset-0 border-2 rounded-xl pointer-events-none" style={{ borderColor: '#1FC77C' }}>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-14 md:w-32 md:h-20 border-2 rounded-xl flex items-center justify-center" style={{ borderColor: '#1FC77C' }}>
                      <ScanLine className="w-7 h-7 animate-pulse" style={{ color: '#1FC77C' }} />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={stopScanning}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 z-10 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-1 left-2 right-2 text-center">
                  <p className="text-xs text-white bg-black/50 rounded px-2 py-1">
                    {isMobile ? 'Inquadra il barcode e mantieni fermo il dispositivo' : 'Inquadra il barcode nel riquadro'}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Scanner Controls */}
          {!isScanning && (
            <div className="text-center w-full max-w-full box-border">
              <div className="w-12 md:w-16 h-12 md:h-16 mx-auto bg-accent rounded-full flex items-center justify-center mb-1">
                {isMobile ? (
                  <Smartphone className="w-6 md:w-10 h-6 md:h-10" style={{ color: '#1FC77C' }} />
                ) : (
                  <Camera className="w-6 md:w-10 h-6 md:h-10" style={{ color: '#1FC77C' }} />
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-1 px-2">
                {isMobile 
                  ? 'Tocca per avviare la scansione.'
                  : 'Tocca per avviare la scansione del barcode'
                }
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 p-1 bg-destructive/10 border border-destructive/20 rounded-lg w-full max-w-full box-border">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Mobile Tips */}
          {isMobile && !isScanning && !error && (
            <div className="p-1 bg-accent rounded-lg text-xs w-full max-w-full box-border" style={{ borderColor: '#1FC77C', borderWidth: '1px' }}>
              <strong style={{ color: '#1FC77C' }}>Suggerimenti:</strong> Buona illuminazione • Dispositivo fermo • Metti a fuoco
            </div>
          )}
        </div>
      )}

      {/* Manual Input Mode */}
      {inputMode === 'manual' && (
        <div className="flex flex-col gap-2 w-full max-w-full box-border">
          <div className="text-center mb-1">
            <div className="w-12 md:w-16 h-12 md:h-16 mx-auto bg-accent rounded-full flex items-center justify-center mb-1">
              <Search className="w-6 md:w-10 h-6 md:h-10" style={{ color: '#F5953B' }} />
            </div>
            <p className="text-xs text-muted-foreground px-2">
              Inserisci il barcode o il nome del prodotto
            </p>
          </div>

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