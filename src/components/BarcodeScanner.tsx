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
  onClose?: () => void;
}

const BarcodeScanner = ({ onScan, onManualEntry, isLoading, resetTrigger, onScannerStateChange, onClose }: BarcodeScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [showPermissionError, setShowPermissionError] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannedRef = useRef(false); // Ref per bloccare letture successive
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<any>(null);

  // Inizializza il code reader con solo EAN_13 e EAN_8
  useEffect(() => {
    if (!codeReader.current) {
      try {
        codeReader.current = new BrowserMultiFormatReader();
        // Configura solo i formati EAN per velocizzare la decodifica
        // Nota: I hints vengono configurati automaticamente dal BrowserMultiFormatReader
        // ma possiamo ottimizzare la configurazione
        console.log('🔍 BarcodeScanner inizializzato con supporto per EAN_13 e EAN_8');
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
    setIsScanning(true);
    scannedRef.current = false; // Reset del flag scanned

    try {
      // Configurazione ottimizzata per fotocamera posteriore su mobile
      let videoConstraints: MediaTrackConstraints = {
        width: { ideal: 1920, min: 1280 },
        height: { ideal: 1080, min: 720 },
        frameRate: { ideal: 30, min: 15 }
      };

      // Abilita focusMode continuous se supportato
      if (isMobile) {
        try {
          // Prova ad aggiungere focusMode continuous usando un approccio compatibile
          (videoConstraints as any).focusMode = 'continuous';
        } catch (error) {
          console.log('FocusMode continuous non supportato');
        }
      }

      let stream: MediaStream;
      let cameraType = 'unknown';

      // Su mobile, FORZA l'uso della fotocamera posteriore
      if (isMobile) {
        console.log('Mobile device detected, forcing rear camera...');
        
        // Prova prima con environment (fotocamera posteriore) - FORZA
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              ...videoConstraints,
              facingMode: { exact: 'environment' }
            }
          });
          cameraType = 'environment (rear)';
          console.log('✅ Successfully using environment camera (rear)');
        } catch (envError) {
          console.log('❌ Environment camera failed, trying alternative approach...');
          
          // Seconda prova: lista tutte le fotocamere e scegli quella posteriore
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            console.log('Available video devices:', videoDevices);
            
            // Cerca una fotocamera che potrebbe essere posteriore
            const rearCamera = videoDevices.find(device => 
              device.label.toLowerCase().includes('back') || 
              device.label.toLowerCase().includes('rear') || 
              device.label.toLowerCase().includes('environment') ||
              device.label.toLowerCase().includes('posteriore')
            );
            
            if (rearCamera) {
              console.log('Found rear camera:', rearCamera.label);
              stream = await navigator.mediaDevices.getUserMedia({
                video: {
                  ...videoConstraints,
                  deviceId: { exact: rearCamera.deviceId }
                }
              });
              cameraType = 'rear (by deviceId)';
              console.log('✅ Successfully using rear camera by deviceId');
            } else {
              // Se non trova una fotocamera posteriore specifica, prova con environment senza exact
              try {
                stream = await navigator.mediaDevices.getUserMedia({
                  video: {
                    ...videoConstraints,
                    facingMode: 'environment'
                  }
                });
                cameraType = 'environment (non-exact)';
                console.log('✅ Successfully using environment camera (non-exact)');
              } catch (envNonExactError) {
                console.log('❌ All rear camera attempts failed, using front camera as fallback');
                stream = await navigator.mediaDevices.getUserMedia({
                  video: {
                    ...videoConstraints,
                    facingMode: 'user'
                  }
                });
                cameraType = 'user (front) - fallback';
                console.log('⚠️ Using front camera as fallback');
              }
            }
          } catch (enumError) {
            console.log('❌ Device enumeration failed, using front camera');
            stream = await navigator.mediaDevices.getUserMedia({
              video: {
                ...videoConstraints,
                facingMode: 'user'
              }
            });
            cameraType = 'user (front) - enum failed';
            console.log('⚠️ Using front camera due to enumeration failure');
          }
        }
      } else {
        // Desktop: usa user camera
        console.log('Desktop device detected, using user camera...');
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            ...videoConstraints,
            facingMode: 'user'
          }
        });
        cameraType = 'user (desktop)';
        console.log('✅ Successfully using user camera (desktop)');
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Assicurati che il video inizi a riprodursi immediatamente
        try {
          await videoRef.current.play();
          console.log(`🎥 Video started playing with ${cameraType} camera`);
        } catch (playError) {
          console.warn('Video play failed:', playError);
        }
      }

      // Avvia immediatamente la scansione del barcode
      if (videoRef.current) {
        console.log('🔍 Starting barcode scanning...');
        controlsRef.current = await codeReader.current.decodeFromConstraints(
          {
            video: videoConstraints
          },
          videoRef.current,
          (result, error) => {
            // Blocca letture successive se già scansionato
            if (scannedRef.current) {
              return;
            }

            if (result) {
              const scannedText = result.getText();
              console.log('✅ Barcode scanned:', scannedText);
              
              // Imposta il flag per bloccare letture successive
              scannedRef.current = true;
              
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
      }
    } catch (error: any) {
      console.error('❌ Start scanning error:', error);
      
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
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    scannedRef.current = false; // Reset del flag scanned
    
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch (error) {
        console.warn('Error stopping scanner:', error);
      }
      controlsRef.current = null;
    }
    
    // Ferma immediatamente la videocamera
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
      });
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
    <div className={`${isMobile ? 'scanner-fullscreen' : 'w-full max-w-full box-border'}`} style={{
      position: isMobile ? 'fixed' : 'relative',
      top: isMobile ? 0 : 'auto',
      left: isMobile ? 0 : 'auto',
      right: isMobile ? 0 : 'auto',
      bottom: isMobile ? 'calc(80px + env(safe-area-inset-bottom))' : 'auto', // Spazio per header + safe area
      width: isMobile ? '100vw' : '100%',
      height: isMobile ? 'calc(100vh - 80px - env(safe-area-inset-bottom))' : 'auto', // Altezza meno header e safe area
      zIndex: isMobile ? 9999 : 'auto',
      backgroundColor: isMobile ? 'black' : 'transparent',
      margin: isMobile ? 0 : 'auto',
      padding: isMobile ? 0 : 'auto',
      border: isMobile ? 'none' : 'auto',
      borderRadius: isMobile ? 0 : 'auto',
      overflow: isMobile ? 'hidden' : 'visible'
    }}>
      {/* Camera Preview - Fullscreen su mobile */}
      <div className={`relative ${isMobile ? 'w-full h-full' : 'w-full max-w-full box-border'}`} style={{
        width: isMobile ? '100vw' : '100%',
        height: isMobile ? 'calc(100vh - 80px - env(safe-area-inset-bottom))' : 'auto',
        margin: isMobile ? 0 : 'auto',
        padding: isMobile ? 0 : 'auto',
        border: isMobile ? 'none' : 'auto',
        borderRadius: isMobile ? 0 : 'auto',
        overflow: isMobile ? 'hidden' : 'visible'
      }}>
        <video
          ref={videoRef}
          className={`${isMobile ? 'w-full h-full object-cover' : 'w-full h-64 md:h-96'} bg-black`}
          playsInline
          muted
          autoPlay
          style={{
            objectFit: 'cover',
            width: isMobile ? '100vw' : '100%',
            height: isMobile ? 'calc(100vh - 80px - env(safe-area-inset-bottom))' : 'auto',
            margin: isMobile ? 0 : 'auto',
            padding: isMobile ? 0 : 'auto',
            border: isMobile ? 'none' : 'auto',
            borderRadius: isMobile ? 0 : 'auto',
            paddingTop: isMobile ? 'env(safe-area-inset-top)' : '0',
            paddingBottom: isMobile ? '0' : '0', // Rimuovi padding bottom per l'header
            paddingLeft: isMobile ? 'env(safe-area-inset-left)' : '0',
            paddingRight: isMobile ? 'env(safe-area-inset-right)' : '0',
          }}
        />
        
        {/* Frame di scansione senza overlay scuro - solo il frame bianco */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Area di scansione centrata */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-72 h-48 md:w-96 md:h-64">
              {/* Area trasparente per la scansione con bordo bianco */}
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
               bottom: isMobile ? '1rem' : '0.25rem' // Posizione fissa dal basso
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
            <p className={`${isMobile ? 'text-sm' : 'w-4 h-4'} text-destructive flex-1`}>{error}</p>
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