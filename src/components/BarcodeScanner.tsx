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
    
    // SUPER AGGRESSIVO: Prima cerca dispositivi che NON sono frontali
    const nonFrontCameras = videoDevices.filter((device) => {
      const label = device.label.toLowerCase();
      return !label.includes('front') && 
             !label.includes('user') && 
             !label.includes('selfie') && 
             !label.includes('facetime');
    });

    if (nonFrontCameras.length > 0) {
      // Se ci sono camera non-frontali, cerca quella posteriore
      const rearCameraCandidates = nonFrontCameras.filter((device) => {
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
          if (l.includes('ultra wide')) return 20;
          if (l.includes('main camera')) return 19;
          if (l.includes('primary camera')) return 18;
          if (l.includes('wide angle')) return 17;
          if (l.includes('ultra')) return 16;
          if (l.includes('wide')) return 15;
          if (l.includes('main')) return 14;
          if (l.includes('primary')) return 13;
          if (l.includes('back')) return 12;
          if (l.includes('rear')) return 11;
          if (l.includes('environment')) return 10;
          if (l.includes('posteriore')) return 9;
          if (l.includes('camera 2')) return 8;
          if (l.includes('camera 1')) return 7;
          if (l.includes('camera 3')) return 6;
          if (l.includes('telephoto')) return 5;
          return 3; // Qualsiasi altro dispositivo non-frontale
        };
        
        // Ordina per punteggio e restituisci la migliore
        rearCameraCandidates.sort((a, b) => score(b.label) - score(a.label));
        console.log('✅ Found rear camera candidates:', rearCameraCandidates.map(d => ({ label: d.label, score: score(d.label) })));
        return rearCameraCandidates[0];
      } else {
        // Se non trova candidati specifici ma ci sono camera non-frontali, usa la prima
        console.log('⚠️ Using first non-front camera');
        return nonFrontCameras[0];
      }
    }

    // Ultima risorsa: prova con il dispositivo che NON è il primo (spesso il primo è frontale)
    if (videoDevices.length > 1) {
      console.log('⚠️ Using last device (avoiding first which is usually front)');
      return videoDevices[videoDevices.length - 1];
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

      const isiOS = isIOS();
      const safari = isSafari();
      
      console.log(`🔍 DEBUGGING DEVICE DETECTION:`);
      console.log(`   isMobile hook: ${isMobile}`);
      console.log(`   isIOS(): ${isiOS}`);
      console.log(`   isSafari(): ${safari}`);
      console.log(`   userAgent: ${navigator.userAgent}`);
      
      // FORZA LA LOGICA PER iOS anche se isMobile è false
      if (isMobile || isiOS) {
        console.log(`📱 ENTRANDO NELLA LOGICA MOBILE/iOS`);
        console.log(`📱 Device: iOS=${isiOS}, Safari=${safari}`);

        // STRATEGIA SEMPLIFICATA: Prima prova con enumerazione dispositivi
        console.log('🔄 STRATEGIA DIRETTA: Enumera e forza dispositivo posteriore');
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        console.log('📋 Dispositivi disponibili:', videoDevices.map((d, i) => ({ 
          index: i, 
          label: d.label, 
          deviceId: d.deviceId.substring(0, 10) + '...' 
        })));

        // TENTATIVO 1: Cerca fotocamera con nome che indica posteriore
        if (!cameraFound && videoDevices.length > 0) {
          // Su iPhone, spesso la fotocamera posteriore è l'ultima o quella con indice 1
          let rearCamera = null;
          
          // Prima cerca per nome
          for (const device of videoDevices) {
            const label = device.label.toLowerCase();
            if (label.includes('back') || 
                label.includes('rear') || 
                label.includes('environment') || 
                label.includes('main') ||
                label.includes('wide') ||
                label.includes('ultra') ||
                (label.includes('camera') && !label.includes('front') && !label.includes('face'))) {
              rearCamera = device;
              break;
            }
          }
          
          // Se non trova per nome, usa strategia posizionale
          if (!rearCamera && videoDevices.length > 1) {
            // Su iPhone, spesso la fotocamera posteriore è quella con indice > 0
            rearCamera = videoDevices[videoDevices.length - 1]; // Ultima camera
          }

          if (rearCamera) {
            try {
              console.log(`🎯 Tentativo fotocamera: ${rearCamera.label}`);
              stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                  deviceId: { exact: rearCamera.deviceId }
                }
              });
              
              const track = stream.getVideoTracks()[0];
              const settings = track.getSettings();
              console.log('✅ Fotocamera attivata:', settings);
              
              // Verifica se è effettivamente posteriore
              if (settings.facingMode === 'environment' || !settings.facingMode) {
                cameraFound = true;
                selectedDeviceIdRef.current = rearCamera.deviceId;
                console.log('✅ SUCCESSO: Fotocamera posteriore confermata');
              } else {
                console.log('⚠️ Fotocamera frontale rilevata, provo altro dispositivo...');
                stream.getTracks().forEach(t => t.stop());
              }
            } catch (error) {
              console.log('❌ Errore tentativo fotocamera specifica:', error);
            }
          }
        }

        // TENTATIVO 2: Se il primo fallisce, prova SISTEMATICAMENTE ogni dispositivo
        if (!cameraFound && videoDevices.length > 1) {
          console.log('🔍 DEBUGGING: Testo TUTTI i dispositivi disponibili...');
          
          for (let i = 0; i < videoDevices.length; i++) {
            try {
              console.log(`🔄 TEST DISPOSITIVO ${i}/${videoDevices.length - 1}:`);
              console.log(`   Nome: ${videoDevices[i].label}`);
              console.log(`   DeviceId: ${videoDevices[i].deviceId.substring(0, 20)}...`);
              
              const testStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: videoDevices[i].deviceId } }
              });
              
              const track = testStream.getVideoTracks()[0];
              const settings = track.getSettings();
              
              console.log(`📋 SETTINGS DISPOSITIVO ${i}:`, {
                facingMode: settings.facingMode,
                width: settings.width,
                height: settings.height,
                deviceId: settings.deviceId?.substring(0, 20) + '...'
              });
              
              // Logica più permissiva: accetta qualsiasi cosa che NON sia esplicitamente 'user'
              if (settings.facingMode !== 'user') {
                stream = testStream;
                cameraFound = true;
                selectedDeviceIdRef.current = videoDevices[i].deviceId;
                console.log(`🎯 SUCCESSO: Dispositivo ${i} SELEZIONATO (facingMode: ${settings.facingMode || 'undefined'})`);
                break;
              } else {
                console.log(`❌ Dispositivo ${i} RIFIUTATO (è frontale: facingMode=${settings.facingMode})`);
                testStream.getTracks().forEach(t => t.stop());
              }
            } catch (error) {
              console.log(`❌ ERRORE Dispositivo ${i}:`, error);
            }
          }
          
          // Se ancora non trova, prova con strategia inversa (prendi qualsiasi NON-primo)
          if (!cameraFound && videoDevices.length > 1) {
            console.log('⚠️ Strategia di emergenza: uso ultimo dispositivo disponibile');
            try {
              const lastDevice = videoDevices[videoDevices.length - 1];
              stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: lastDevice.deviceId } }
              });
              cameraFound = true;
              selectedDeviceIdRef.current = lastDevice.deviceId;
              console.log(`🆘 EMERGENZA: Usando ultimo dispositivo: ${lastDevice.label}`);
            } catch (error) {
              console.log('❌ Anche strategia di emergenza fallita:', error);
            }
          }
        }

        // TENTATIVO 3: Fallback con constraints classici
        if (!cameraFound) {
          try {
            console.log('🔄 Fallback: facingMode environment');
            stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: { exact: 'environment' } }
            });
            cameraFound = true;
            const track = stream.getVideoTracks()[0];
            selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
            console.log('✅ Successo con facingMode environment');
          } catch (error) {
            console.log('❌ Fallback environment failed:', error);
          }
        }

        // SE ANCORA NON TROVA, ERRORE
        if (!cameraFound) {
          throw new Error('Fotocamera posteriore non disponibile su questo dispositivo');
        }
      } else {
        // Desktop/Non-mobile → frontale
        console.log('💻 DESKTOP: Usando fotocamera frontale');
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 }
          }
        });
        const track = stream.getVideoTracks()[0];
        selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
        cameraFound = true;
        console.log('✅ Desktop camera attivata');
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
              console.log('🔄 Stopping scanner and calling onScan with:', text);
              
              // Ferma immediatamente tutto
              try {
                controlsRef.current?.stop?.();
                controlsRef.current = null;
              } catch (e) {
                console.warn('Error stopping controls:', e);
              }
              
              // Ferma la camera
              const vid = videoRef.current;
              if (vid && vid.srcObject) {
                console.log('📹 Stopping camera stream');
                (vid.srcObject as MediaStream).getTracks().forEach((t) => {
                  console.log('🛑 Stopping track:', t.kind, t.label);
                  t.stop();
                });
                vid.srcObject = null;
              }
              
              setIsScanning(false);
              onScannerStateChange?.(false);
              
              // Chiama la callback con il barcode
              console.log('📞 Calling onScan callback');
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
    console.log('🛑 stopScanning called');
    setIsScanning(false);
    scannedRef.current = false;

    try {
    if (controlsRef.current) {
        console.log('🛑 Stopping ZXing controls');
        controlsRef.current.stop?.();
      }
    } catch (e) {
      console.warn('Error stopping ZXing controls:', e);
    }
      controlsRef.current = null;

    const vid = videoRef.current;
    if (vid && vid.srcObject) {
      console.log('🛑 Stopping video tracks');
      (vid.srcObject as MediaStream).getTracks().forEach((t) => {
        console.log('🛑 Stopping track:', t.kind, t.readyState);
        t.stop();
      });
      vid.srcObject = null;
      console.log('✅ Video source cleared');
    }
    
    // Notifica che lo scanner non è più attivo
    onScannerStateChange?.(false);
    console.log('🔔 Scanner state changed to false');
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
          <Button onClick={handleClose} variant="destructive" size="sm" className="rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Istruzioni */}
        <div
          className={`absolute ${isMobile ? 'bottom-20 left-4 right-4' : 'bottom-1 left-2 right-2'} text-center z-30`}
          style={{ bottom: isMobile ? 'calc(120px + env(safe-area-inset-bottom))' : '0.25rem' }}
        >
          <p className="text-sm text-white bg-black/70 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/20">
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