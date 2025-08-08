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

const BarcodeScanner = ({
  onScan,
  onManualEntry,
  isLoading,
  resetTrigger,
  onScannerStateChange,
  onClose
}: BarcodeScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [showPermissionError, setShowPermissionError] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const isMobile = useIsMobile();
  const { toast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<any>(null);
  const scannedRef = useRef(false);
  const selectedDeviceIdRef = useRef<string | undefined>(undefined);

  const isIOS = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const getBestRearCamera = async (videoDevices: MediaDeviceInfo[]) => {
    console.log('🔍 Searching for best rear camera...');
    console.log('Available devices:', videoDevices.map(d => ({ label: d.label, deviceId: d.deviceId })));
    
    // Criteri di priorità per fotocamera posteriore
    const rearCameraCandidates = videoDevices.filter((device) => {
      const label = device.label.toLowerCase();
      return (
        label.includes('ultra') ||
        label.includes('wide') ||
        label.includes('main') ||
        label.includes('primary') ||
        label.includes('back') ||
        label.includes('rear') ||
        label.includes('environment') ||
        label.includes('posteriore') ||
        label.includes('camera 2') ||
        label.includes('camera 1') ||
        label.includes('camera 3') ||
        label.includes('telephoto') ||
        label.includes('ultra wide') ||
        label.includes('wide angle') ||
        label.includes('main camera') ||
        label.includes('primary camera')
      );
    });

    if (rearCameraCandidates.length > 0) {
      // Sistema di punteggio per trovare la migliore fotocamera posteriore
      const score = (label: string) => {
        const l = label.toLowerCase();
        if (l.includes('ultra wide')) return 15;
        if (l.includes('ultra')) return 14;
        if (l.includes('wide angle')) return 13;
        if (l.includes('wide')) return 12;
        if (l.includes('main camera')) return 11;
        if (l.includes('primary camera')) return 10;
        if (l.includes('main')) return 9;
        if (l.includes('primary')) return 8;
        if (l.includes('back')) return 7;
        if (l.includes('rear')) return 6;
        if (l.includes('environment')) return 5;
        if (l.includes('posteriore')) return 4;
        if (l.includes('camera 2')) return 3;
        if (l.includes('camera 1')) return 2;
        if (l.includes('telephoto')) return 1;
        return 0;
      };
      
      // Ordina per punteggio e restituisci la migliore
      rearCameraCandidates.sort((a, b) => score(b.label) - score(a.label));
      console.log('✅ Found rear camera candidates:', rearCameraCandidates.map(d => ({ label: d.label, score: score(d.label) })));
      return rearCameraCandidates[0];
    }

    // Se non trova candidati specifici, prova con il secondo dispositivo
    if (videoDevices.length > 1) {
      console.log('⚠️ No specific rear camera found, using second device');
      return videoDevices[1];
    }
    
    return null;
  };

  useEffect(() => {
    if (!codeReader.current) {
      try {
        codeReader.current = new BrowserMultiFormatReader();
      } catch (err) {
        setError('Browser non supportato per la scansione di barcode');
      }
    }
  }, []);

  useEffect(() => {
    startScanning();
    return () => stopScanning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onScannerStateChange?.(true);
  }, [onScannerStateChange]);

  const startScanning = async () => {
    if (isScanning) return;

    setIsScanning(true);
    setError(null);
    setShowPermissionError(false);
    scannedRef.current = false;
    selectedDeviceIdRef.current = undefined;

    onScannerStateChange?.(true);

    try {
      let stream: MediaStream;
      let cameraFound = false;

      const common: MediaTrackConstraints = {
        width: { ideal: 1920, min: 1280 },
        height: { ideal: 1080, min: 720 },
        frameRate: { ideal: 30, min: 15 }
      };
      
      // Abilita autofocus continuo
      (common as any).focusMode = 'continuous';

      if (isMobile) {
        const isiOS = isIOS();
        const safari = isSafari();
        
        console.log(`📱 Device: iOS=${isiOS}, Safari=${safari}`);

        // STRATEGIA 1: Environment exact (più aggressivo per iOS)
        if (!cameraFound) {
          try {
            console.log('🔄 Tentativo 1: Environment exact (rear camera)');
            stream = await navigator.mediaDevices.getUserMedia({
              video: { 
                facingMode: { exact: 'environment' },
                width: { ideal: 1920, min: 1280 },
                height: { ideal: 1080, min: 720 },
                frameRate: { ideal: 30, min: 15 }
              }
            });
            cameraFound = true;
            const track = stream.getVideoTracks()[0];
            selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
            console.log('✅ Successfully using environment camera (exact)');
          } catch (error) {
            console.log('❌ Environment exact failed:', error);
          }
        }

        // STRATEGIA 2: Enumera dispositivi e forza fotocamera posteriore
        if (!cameraFound) {
          try {
            console.log('🔄 Tentativo 2: Enumerating devices for rear camera');
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((d) => d.kind === 'videoinput');
            console.log('Available devices:', videoDevices.map(d => ({ label: d.label, deviceId: d.deviceId })));
            
            const rear = await getBestRearCamera(videoDevices);
            if (rear) {
              console.log('Found rear camera:', rear.label);
              stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                  deviceId: { exact: rear.deviceId },
                  width: { ideal: 1920, min: 1280 },
                  height: { ideal: 1080, min: 720 },
                  frameRate: { ideal: 30, min: 15 }
                }
              });
              cameraFound = true;
              selectedDeviceIdRef.current = rear.deviceId;
              console.log('✅ Successfully using rear camera by deviceId');
            }
          } catch (error) {
            console.log('❌ Device enumeration failed:', error);
          }
        }

        // STRATEGIA 3: Environment senza exact (fallback)
        if (!cameraFound) {
          try {
            console.log('🔄 Tentativo 3: Environment non-exact');
            stream = await navigator.mediaDevices.getUserMedia({
              video: { 
                facingMode: 'environment',
                width: { ideal: 1920, min: 1280 },
                height: { ideal: 1080, min: 720 },
                frameRate: { ideal: 30, min: 15 }
              }
            });
            cameraFound = true;
            const track = stream.getVideoTracks()[0];
            selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
            console.log('✅ Successfully using environment camera (non-exact)');
          } catch (error) {
            console.log('❌ Environment non-exact failed:', error);
          }
        }

        // STRATEGIA 4: iOS specific - constraints molto specifici
        if (!cameraFound && isiOS) {
          try {
            console.log('🔄 Tentativo 4: iOS-specific constraints');
            const iosConstraints: MediaTrackConstraints = {
              facingMode: 'environment',
              width: { ideal: 1920, min: 1280 },
              height: { ideal: 1080, min: 720 },
              frameRate: { ideal: 30, min: 15 }
            };
            
            if (safari) {
              console.log('Using Safari-specific constraints');
              (iosConstraints as any).deviceId = undefined;
            }
            
            stream = await navigator.mediaDevices.getUserMedia({ video: iosConstraints });
            cameraFound = true;
            const track = stream.getVideoTracks()[0];
            selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
            console.log('✅ Successfully using iOS-specific camera');
          } catch (error) {
            console.log('❌ iOS-specific constraints failed:', error);
          }
        }

        // STRATEGIA 5: iOS Safari minimal constraints
        if (!cameraFound && isiOS && safari) {
          try {
            console.log('🔄 Tentativo 5: iOS Safari minimal constraints');
            stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: 'environment',
                width: { ideal: 1280, min: 640 },
                height: { ideal: 720, min: 480 },
                frameRate: { ideal: 30, min: 15 }
              }
            });
            cameraFound = true;
            const track = stream.getVideoTracks()[0];
            selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
            console.log('✅ Successfully using iOS Safari minimal camera');
          } catch (error) {
            console.log('❌ iOS Safari minimal constraints failed:', error);
          }
        }

        // STRATEGIA 6: Prova con il secondo dispositivo (spesso la fotocamera posteriore)
        if (!cameraFound) {
          try {
            console.log('🔄 Tentativo 6: Using second device (likely rear camera)');
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((d) => d.kind === 'videoinput');
            
            if (videoDevices.length > 1) {
              const secondDevice = videoDevices[1]; // Il secondo dispositivo è spesso la fotocamera posteriore
              stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                  deviceId: { exact: secondDevice.deviceId },
                  width: { ideal: 1920, min: 1280 },
                  height: { ideal: 1080, min: 720 },
                  frameRate: { ideal: 30, min: 15 }
                }
              });
              cameraFound = true;
              selectedDeviceIdRef.current = secondDevice.deviceId;
              console.log('✅ Successfully using second device as rear camera');
            }
          } catch (error) {
            console.log('❌ Second device failed:', error);
          }
        }

        // STRATEGIA 7: Ultimo tentativo - prova con constraints molto specifici per iOS
        if (!cameraFound && isiOS) {
          try {
            console.log('🔄 Tentativo 7: iOS final attempt with specific constraints');
            stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: { exact: 'environment' },
                width: { ideal: 1920, min: 1280 },
                height: { ideal: 1080, min: 720 },
                frameRate: { ideal: 30, min: 15 },
                aspectRatio: { ideal: 16/9 }
              }
            });
            cameraFound = true;
            const track = stream.getVideoTracks()[0];
            selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
            console.log('✅ Successfully using iOS final attempt');
          } catch (error) {
            console.log('❌ iOS final attempt failed:', error);
          }
        }

        // SE NON TROVA LA FOTOCAMERA POSTERIORE, LANCIA UN ERRORE
        if (!cameraFound) {
          throw new Error('Fotocamera posteriore non disponibile. Impossibile utilizzare la fotocamera frontale.');
        }
      } else {
        // Desktop → frontale
        stream = await navigator.mediaDevices.getUserMedia({
          video: { ...common, facingMode: 'user' }
        });
        const track = stream.getVideoTracks()[0];
        selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
      }

      // Aggancia lo stream al <video>
      if (videoRef.current) {
        videoRef.current.srcObject = stream!;
        videoRef.current.setAttribute('playsinline', 'true'); // iOS
        try {
          await videoRef.current.play();
          console.log('🎥 Video started playing');
        } catch (error) {
          console.warn('Video play failed:', error);
        }
      }

      // Avvia ZXing SENZA cambiare fotocamera: usa il deviceId selezionato
      if (videoRef.current && codeReader.current) {
        controlsRef.current = await codeReader.current.decodeFromVideoDevice(
          selectedDeviceIdRef.current, // forza quella già scelta/attiva
          videoRef.current,
          (result, err) => {
            if (scannedRef.current) return;

            if (result) {
              scannedRef.current = true;
              if (navigator.vibrate) navigator.vibrate(200);
              const text = result.getText();
              console.log('✅ Barcode scanned:', text);
              stopScanning();
              onScan(text);
            } else if (err && !(err instanceof NotFoundException)) {
              console.warn('Scanning error:', err);
            }
          }
        );
      }
    } catch (e: any) {
      console.error('Error starting scanner:', e);
      
      if (e?.name === 'NotAllowedError' || String(e?.message).includes('permission')) {
        setShowPermissionError(true);
      } else if (e?.name === 'NotFoundError') {
        setError('Fotocamera posteriore non trovata. Assicurati che il dispositivo abbia una fotocamera posteriore.');
      } else if (e?.name === 'NotReadableError') {
        setError("Fotocamera posteriore non accessibile. Potrebbe essere utilizzata da un'altra applicazione.");
      } else if (e?.message?.includes('posteriore')) {
        setError('Fotocamera posteriore non disponibile. Impossibile utilizzare la fotocamera frontale.');
      } else {
        setError(`Errore nell'accesso alla fotocamera posteriore: ${e?.message || e}`);
      }
      setIsScanning(false);
      onScannerStateChange?.(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    scannedRef.current = false;

    try {
      controlsRef.current?.stop?.();
    } catch {}
    controlsRef.current = null;

    const vid = videoRef.current;
    if (vid && vid.srcObject) {
      (vid.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      vid.srcObject = null;
    }
  };

  const handleClose = () => {
    stopScanning();
    onClose?.();
  };

  return (
    <div
      className={`${isMobile ? 'scanner-fullscreen' : 'w-full max-w-full box-border'}`}
      style={{
        position: isMobile ? 'fixed' : 'relative',
        top: isMobile ? 0 : 'auto',
        left: isMobile ? 0 : 'auto',
        right: isMobile ? 0 : 'auto',
        bottom: isMobile ? 'calc(80px + env(safe-area-inset-bottom))' : 'auto',
        width: isMobile ? '100vw' : '100%',
        height: isMobile ? 'calc(100vh - 80px - env(safe-area-inset-bottom))' : 'auto',
        zIndex: isMobile ? 9999 : 'auto',
        backgroundColor: isMobile ? 'black' : 'transparent',
        overflow: isMobile ? 'hidden' : 'visible',
        margin: 0,
        padding: 0,
        border: 'none',
        borderRadius: 0
      }}
    >
      <div
        className={`relative ${isMobile ? 'w-full h-full' : 'w-full max-w-full box-border'}`}
        style={{
          width: isMobile ? '100vw' : '100%',
          height: isMobile ? 'calc(100vh - 80px - env(safe-area-inset-bottom))' : 'auto',
          overflow: isMobile ? 'hidden' : 'visible',
          margin: 0,
          padding: 0,
          border: 'none',
          borderRadius: 0,
          backgroundColor: 'black'
        }}
      >
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
            margin: 0,
            padding: 0,
            border: 'none',
            borderRadius: 0,
            backgroundColor: 'black'
          }}
        />

        {/* Frame di scansione */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-72 h-48 md:w-96 md:h-64">
              <div
                className="absolute inset-0 bg-transparent border-3 border-white rounded-lg shadow-lg"
                style={{ borderWidth: '3px' }}
              />
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-white rounded-br" />
              <div className="absolute inset-0 border-2 border-green-400 rounded-lg opacity-75 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Controlli */}
        <div
          className={`absolute ${isMobile ? 'top-4 right-4' : 'top-2 right-2'} z-30 flex gap-2`}
          style={{ top: isMobile ? 'calc(1rem + env(safe-area-inset-top))' : '0.5rem' }}
        >
          <Button
            onClick={() => {
              stopScanning();
              setTimeout(() => startScanning(), 400);
            }}
            variant="secondary"
            size="sm"
            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <Camera className="w-4 h-4" />
          </Button>
          <Button onClick={handleClose} variant="destructive" size="sm" className="rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Istruzioni */}
        <div
          className={`absolute ${isMobile ? 'bottom-4 left-4 right-4' : 'bottom-1 left-2 right-2'} text-center z-30`}
          style={{ bottom: isMobile ? '1rem' : '0.25rem' }}
        >
          <p className="text-sm text-white bg-black/50 rounded px-3 py-2">
            {isMobile ? 'Inquadra il barcode e mantieni fermo il dispositivo' : 'Inquadra il barcode nel riquadro'}
          </p>
        </div>
      </div>

      {/* Errori */}
      {error && (
        <div
          className={`${
            isMobile
              ? 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-white rounded-lg p-4 max-w-sm w-full mx-4'
              : 'flex flex-col space-y-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg w-full max-w-full box-border'
          }`}
        >
          <div className={`flex items-center space-x-2 ${isMobile ? 'mb-3' : ''}`}>
            <AlertCircle className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-destructive`} />
            <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-destructive flex-1`}>{error}</p>
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
            <Button onClick={() => setShowPermissionError(false)} size="sm" variant="outline" className="text-xs">
              Chiudi
            </Button>
          </div>
        </div>
      )}

      {/* Popup permessi */}
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
              <Button onClick={() => setShowPermissionError(false)} variant="outline" className="flex-1 h-12 text-base font-medium">
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