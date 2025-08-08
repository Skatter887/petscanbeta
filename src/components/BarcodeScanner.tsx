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
        label.includes('posteriore')
      );
    });

    if (rearCameraCandidates.length > 0) {
      const score = (label: string) => {
        const l = label.toLowerCase();
        if (l.includes('ultra')) return 10;
        if (l.includes('wide')) return 9;
        if (l.includes('main')) return 8;
        if (l.includes('primary')) return 7;
        if (l.includes('back')) return 6;
        if (l.includes('rear')) return 5;
        if (l.includes('environment')) return 4;
        if (l.includes('posteriore')) return 3;
        return 0;
      };
      rearCameraCandidates.sort((a, b) => score(b.label) - score(a.label));
      return rearCameraCandidates[0];
    }

    if (videoDevices.length > 1) return videoDevices[1];
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
      // best effort per autofocus continuo
      (common as any).focusMode = 'continuous';

      if (isMobile) {
        const isiOS = isIOS();
        const safari = isSafari();

        // 1) environment exact
        if (!cameraFound) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { ...common, facingMode: { exact: 'environment' } }
            });
            cameraFound = true;
            const track = stream.getVideoTracks()[0];
            selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
          } catch {}
        }

        // 2) enumerate e scegli posteriore
        if (!cameraFound) {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((d) => d.kind === 'videoinput');
            const rear = await getBestRearCamera(videoDevices);
            if (rear) {
              stream = await navigator.mediaDevices.getUserMedia({
                video: { ...common, deviceId: { exact: rear.deviceId } }
              });
              cameraFound = true;
              selectedDeviceIdRef.current = rear.deviceId;
            }
          } catch {}
        }

        // 3) environment non-exact
        if (!cameraFound) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { ...common, facingMode: 'environment' }
            });
            cameraFound = true;
            const track = stream.getVideoTracks()[0];
            selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
          } catch {}
        }

        // 4) iOS specific
        if (!cameraFound && isiOS) {
          try {
            const iosConstraints: MediaTrackConstraints = {
              ...common,
              facingMode: 'environment'
            };
            if (safari) {
              (iosConstraints as any).deviceId = undefined;
              (iosConstraints as any).facingMode = 'environment';
            }
            stream = await navigator.mediaDevices.getUserMedia({ video: iosConstraints });
            cameraFound = true;
            const track = stream.getVideoTracks()[0];
            selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
          } catch {}
        }

        // 5) fallback minimo iOS Safari
        if (!cameraFound && isiOS && safari) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: 'environment',
                width: { ideal: 1280, min: 640 },
                height: { ideal: 720, min: 480 }
              }
            });
            cameraFound = true;
            const track = stream.getVideoTracks()[0];
            selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
          } catch {}
        }

        // fallback finale: frontale
        if (!cameraFound) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { ...common, facingMode: 'user' }
          });
          const track = stream.getVideoTracks()[0];
          selectedDeviceIdRef.current = track?.getSettings()?.deviceId;
        }
      } else {
        // desktop → frontale
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
        } catch {}
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
              stopScanning();
              onScan(text);
            } else if (err && !(err instanceof NotFoundException)) {
              console.warn('Scanning error:', err);
            }
          }
        );
      }
    } catch (e: any) {
      if (e?.name === 'NotAllowedError' || String(e?.message).includes('permission')) {
        setShowPermissionError(true);
      } else if (e?.name === 'NotFoundError') {
        setError('Fotocamera non trovata. Assicurati che il dispositivo abbia una fotocamera.');
      } else if (e?.name === 'NotReadableError') {
        setError("Fotocamera non accessibile. Potrebbe essere utilizzata da un'altra applicazione.");
      } else {
        setError(`Errore nell'accesso alla fotocamera: ${e?.message || e}`);
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
        overflow: isMobile ? 'hidden' : 'visible'
      }}
    >
      <div
        className={`relative ${isMobile ? 'w-full h-full' : 'w-full max-w-full box-border'}`}
        style={{
          width: isMobile ? '100vw' : '100%',
          height: isMobile ? 'calc(100vh - 80px - env(safe-area-inset-bottom))' : 'auto',
          overflow: isMobile ? 'hidden' : 'visible'
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
            height: isMobile ? 'calc(100vh - 80px - env(safe-area-inset-bottom))' : 'auto'
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