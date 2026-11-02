import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Zap, Upload, AlertCircle, CheckCircle, Sliders, Play, Pause, ChevronRight, Sparkles, Video, Eye } from 'lucide-react';
import { Language, DetectedPothole, RoadScanResult } from '../types';
import { t } from '../translations';
import { PotholeMultiFrameTracker } from '../utils/potholeTracker';
import { BENCHMARK_SCENARIOS } from '../data/indianRoadsData';

interface ScannerViewProps {
  onScanComplete: (result: RoadScanResult) => void;
  lang: Language;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onScanComplete, lang }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'benchmarks'>('camera');
  
  // Camera State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [hasTorchSupport, setHasTorchSupport] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Continuous Dashcam Mode
  const [autoIntervalScan, setAutoIntervalScan] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Detections & Tracking State
  const [currentDetections, setCurrentDetections] = useState<DetectedPothole[]>([]);
  const [uniquePotholeCount, setUniquePotholeCount] = useState<number>(0);
  const [framesProcessed, setFramesProcessed] = useState<number>(0);
  const [lastScanResult, setLastScanResult] = useState<RoadScanResult | null>(null);

  // Calibration Settings
  const [showCalibration, setShowCalibration] = useState<boolean>(false);
  const [referenceScale, setReferenceScale] = useState<'lane_3_5m' | 'tyre_22cm'>('lane_3_5m');

  // Media Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasOverlayRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalTimerRef = useRef<any>(null);
  const trackerRef = useRef<PotholeMultiFrameTracker>(new PotholeMultiFrameTracker());

  // Upload State
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera
  const startCamera = async () => {
    setCameraError(null);
    trackerRef.current.reset();
    setUniquePotholeCount(0);
    setFramesProcessed(0);

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsCameraActive(true);

      // Check torch support
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? (track.getCapabilities() as any) : {};
      if (capabilities.torch) {
        setHasTorchSupport(true);
      } else {
        setHasTorchSupport(false);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          lang === 'hi'
            ? 'कैमरा अनुमति अस्वीकृत कर दी गई है। कृपया ब्राउज़र सेटिंग्स में कैमरा एक्सेस सक्षम करें।'
            : 'Camera permission denied. Please allow camera access in your browser site permissions.'
        );
      } else {
        setCameraError(
          lang === 'hi'
            ? 'डिवाइस कैमरा प्रारंभ करने में असमर्थ। कृपया सुनिश्चित करें कि कोई अन्य ऐप कैमरे का उपयोग नहीं कर रहा है।'
            : 'Unable to start camera. Please verify your camera device is connected and not in use by another application.'
        );
      }
    }
  };

  const stopCamera = () => {
    if (intervalTimerRef.current) {
      clearInterval(intervalTimerRef.current);
      intervalTimerRef.current = null;
    }
    setAutoIntervalScan(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
    setIsTorchOn(false);
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        await (track as any).applyConstraints({
          advanced: [{ torch: !isTorchOn }]
        });
        setIsTorchOn(!isTorchOn);
      } catch (e) {
        console.warn('Torch control failed:', e);
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    }
  }, [facingMode]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Continuous auto-interval scanning
  useEffect(() => {
    if (autoIntervalScan && isCameraActive) {
      intervalTimerRef.current = setInterval(() => {
        if (!isAnalyzing) {
          captureAndAnalyzeCurrentFrame();
        }
      }, 2500);
    } else {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
        intervalTimerRef.current = null;
      }
    }

    return () => {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
    };
  }, [autoIntervalScan, isCameraActive, isAnalyzing]);

  // Capture current video frame and run detection
  const captureAndAnalyzeCurrentFrame = async () => {
    if (!videoRef.current || isAnalyzing) return;

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    setIsAnalyzing(true);
    setFramesProcessed(prev => prev + 1);

    try {
      // Draw to offscreen canvas to get base64
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = video.videoWidth;
      offscreenCanvas.height = video.videoHeight;
      const ctx = offscreenCanvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
      const dataUrl = offscreenCanvas.toDataURL('image/jpeg', 0.82);

      await runDetectionInference(dataUrl);
    } catch (err) {
      console.error('Frame capture & analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run backend computer vision inference
  const runDetectionInference = async (imageBase64: string) => {
    try {
      const response = await fetch('/api/detect-potholes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          frameIndex: framesProcessed + 1,
          cameraCalibration: { referenceScale }
        })
      });

      if (!response.ok) {
        throw new Error(`Inference endpoint returned HTTP ${response.status}`);
      }

      const data = await response.json();

      // Normalize detected potholes
      const rawPotholes: DetectedPothole[] = (data.potholes || []).map((p: any, idx: number) => ({
        id: p.id || `pothole_${idx + 1}`,
        box2d: p.box2d || { ymin: 300, xmin: 300, ymax: 600, xmax: 600 },
        confidence: p.confidence || 0.88,
        severity: p.severity?.toLowerCase() || 'high',
        approxDimensions: p.approxDimensions || {
          lengthCm: 60,
          widthCm: 50,
          depthCm: 10,
          areaSqMeters: 0.3
        },
        shape: p.shape || 'irregular',
        waterFilled: p.waterFilled || false,
        commuterHazard: p.commuterHazard || 'Risk to two-wheelers'
      }));

      // Update multi-frame deduplication tracker
      const trackerResult = trackerRef.current.update(rawPotholes, framesProcessed + 1);
      
      setCurrentDetections(trackerResult.annotatedDetections);
      setUniquePotholeCount(trackerResult.uniqueTotalCount);

      const result: RoadScanResult = {
        scanId: data.scanId || `scan_${Date.now()}`,
        timestamp: data.timestamp || new Date().toISOString(),
        imageUrl: imageBase64,
        potholes: trackerResult.allUniquePotholes.length > 0 ? trackerResult.allUniquePotholes : rawPotholes,
        totalUniquePotholes: trackerResult.uniqueTotalCount,
        overallCondition: data.roadCondition || (trackerResult.uniqueTotalCount > 2 ? 'Dangerous' : 'Poor'),
        pciScore: data.pciScore || 45,
        repairPriority: data.repairPriority || 'High (3-7 days)',
        commuterSafetyRisk: data.commuterSafetyRisk || 'High',
        primaryRecommendation: data.primaryRecommendation || 'Immediate rectangular saw-cutting and bitumen overlay.',
        detectionMode: data.detectionMode || 'live_ai',
        calibrationNote: data.calibrationNote,
        surfaceType: 'Bituminous Asphalt (IRC Standard)'
      };

      setLastScanResult(result);
      drawBoundingBoxes(trackerResult.annotatedDetections);
    } catch (err: any) {
      console.error('Detection error:', err);
    }
  };

  // Draw bounding boxes on canvas overlay
  const drawBoundingBoxes = (potholes: DetectedPothole[]) => {
    const canvas = canvasOverlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of potholes) {
      // Map normalized 0-1000 coordinates to canvas pixels
      const x = (p.box2d.xmin / 1000) * canvas.width;
      const y = (p.box2d.ymin / 1000) * canvas.height;
      const w = ((p.box2d.xmax - p.box2d.xmin) / 1000) * canvas.width;
      const h = ((p.box2d.ymax - p.box2d.ymin) / 1000) * canvas.height;

      // Color based on severity
      let strokeColor = '#EF4444'; // Red for critical/high
      let fillColor = 'rgba(239, 68, 68, 0.18)';
      if (p.severity === 'medium') {
        strokeColor = '#F59E0B'; // Amber
        fillColor = 'rgba(245, 158, 11, 0.18)';
      } else if (p.severity === 'low') {
        strokeColor = '#EAB308'; // Yellow
        fillColor = 'rgba(234, 179, 8, 0.18)';
      }

      // Draw bounding box
      ctx.lineWidth = 3;
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = fillColor;

      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);

      // Corner markers (tech HUD style)
      const cornerLen = 10;
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FFFFFF';
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(x, y + cornerLen);
      ctx.lineTo(x, y);
      ctx.lineTo(x + cornerLen, y);
      ctx.stroke();

      // Label background & text
      const labelText = `${p.id} • ${Math.round(p.confidence * 100)}% • ${p.severity.toUpperCase()}`;
      ctx.font = 'bold 12px sans-serif';
      const textWidth = ctx.measureText(labelText).width;

      ctx.fillStyle = strokeColor;
      ctx.fillRect(x, Math.max(0, y - 22), textWidth + 12, 22);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(labelText, x + 6, Math.max(15, y - 6));
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setUploadedVideoUrl(url);
      setUploadedImageUrl(null);
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setUploadedImageUrl(base64);
        setUploadedVideoUrl(null);
        trackerRef.current.reset();
        await runDetectionInference(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load a Benchmark Scenario
  const handleSelectBenchmarkScenario = (sc: typeof BENCHMARK_SCENARIOS[0]) => {
    trackerRef.current.reset();

    const mappedPotholes: DetectedPothole[] = sc.simulatedPotholes.map((p, idx) => ({
      id: `P-${idx + 1}`,
      box2d: { ymin: p.ymin, xmin: p.xmin, ymax: p.ymax, xmax: p.xmax },
      confidence: p.confidence,
      severity: p.severity,
      approxDimensions: {
        lengthCm: p.approxLengthCm,
        widthCm: p.approxWidthCm,
        depthCm: p.approxDepthCm,
        areaSqMeters: Number(((p.approxLengthCm * p.approxWidthCm) / 10000).toFixed(2))
      },
      shape: 'irregular',
      waterFilled: p.waterFilled,
      commuterHazard: p.commuterHazard
    }));

    const result: RoadScanResult = {
      scanId: `benchmark_${sc.id}`,
      timestamp: new Date().toISOString(),
      potholes: mappedPotholes,
      totalUniquePotholes: mappedPotholes.length,
      overallCondition: sc.overallCondition,
      pciScore: sc.pciScore,
      repairPriority: sc.repairPriority,
      commuterSafetyRisk: sc.commuterSafetyRisk,
      primaryRecommendation: sc.description,
      detectionMode: 'benchmark_sample',
      surfaceType: 'High-Density Bituminous Asphalt'
    };

    setLastScanResult(result);
    setCurrentDetections(mappedPotholes);
    setUniquePotholeCount(mappedPotholes.length);
    onScanComplete(result);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>{t('scannerTitle', lang)}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
              Live CV
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('scannerSubtitle', lang)}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('camera');
              if (!isCameraActive) startCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('tabLiveCamera', lang)}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-blue-500" />
            <span>{t('tabUpload', lang)}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('benchmarks');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'benchmarks'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('tabBenchmarks', lang)}</span>
          </button>
        </div>
      </div>

      {/* Main Scanner Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Viewport / Media Feed (2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Tab 1: Live Camera Feed */}
            {activeTab === 'camera' && (
              <>
                {isCameraActive ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="w-full h-full object-cover"
                      onLoadedMetadata={() => {
                        if (canvasOverlayRef.current && videoRef.current) {
                          canvasOverlayRef.current.width = videoRef.current.videoWidth || 640;
                          canvasOverlayRef.current.height = videoRef.current.videoHeight || 360;
                        }
                      }}
                    />
                    {/* Bounding Box Canvas Overlay */}
                    <canvas
                      ref={canvasOverlayRef}
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    />

                    {/* HUD Overlay Details */}
                    <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
                      <div className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-slate-700 text-white text-xs font-mono flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                        <span className="font-bold">REC • LIVE ROAD SCAN</span>
                      </div>

                      {autoIntervalScan && (
                        <div className="px-2 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
                          Dashcam Mode (2.5s)
                        </div>
                      )}
                    </div>

                    {/* Analysis Activity Spinner */}
                    {isAnalyzing && (
                      <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-md bg-amber-500/90 text-slate-950 text-xs font-bold flex items-center space-x-1.5 shadow-lg animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>CV Analyzing...</span>
                      </div>
                    )}

                    {/* Bottom HUD Bar */}
                    <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white text-xs">
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Unique Defects</span>
                          <span className="font-extrabold text-amber-400 text-sm">{uniquePotholeCount}</span>
                        </div>
                        <div className="hidden sm:block">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Frames Tracked</span>
                          <span className="font-mono">{framesProcessed}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Tracker</span>
                          <span className="text-emerald-400 font-mono">IoU+Centroid Deduplicated</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {hasTorchSupport && (
                          <button
                            onClick={toggleTorch}
                            className={`p-2 rounded-lg border transition ${
                              isTorchOn
                                ? 'bg-amber-400 text-slate-950 border-amber-300'
                                : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                            }`}
                            title="Toggle Torch"
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={switchCamera}
                          className="p-2 rounded-lg bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 transition"
                          title="Switch Front/Back Camera"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">
                        {lang === 'hi' ? 'कैमरा वर्तमान में निष्क्रिय है' : 'Camera is Currently Inactive'}
                      </h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        {lang === 'hi'
                          ? 'सड़क गड्ढों की रीयल-टाइम पहचान करने हेतु मोबाइल का बैक कैमरा सक्रिय करें।'
                          : 'Activate device camera to start road scanning with real-time bounding box annotations.'}
                      </p>
                    </div>
                    <button
                      onClick={startCamera}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer shadow-lg shadow-emerald-950 inline-flex items-center space-x-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{t('btnStartCamera', lang)}</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Tab 2: Upload Photo / Video */}
            {activeTab === 'upload' && (
              <div className="w-full h-full flex flex-col justify-center items-center p-4">
                {uploadedImageUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={uploadedImageUrl}
                      alt="Uploaded road inspection"
                      className="w-full h-full object-contain"
                    />
                    <canvas
                      ref={canvasOverlayRef}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    />
                  </div>
                ) : uploadedVideoUrl ? (
                  <div className="relative w-full h-full">
                    <video
                      src={uploadedVideoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition w-full max-w-md bg-slate-900/50"
                  >
                    <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                    <h4 className="font-bold text-white text-sm mb-1">{t('dropzoneTitle', lang)}</h4>
                    <p className="text-xs text-slate-400 mb-4">{t('dropzoneSubtitle', lang)}</p>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition"
                    >
                      {t('btnBrowseFiles', lang)}
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Tab 3: Benchmark Scenarios */}
            {activeTab === 'benchmarks' && (
              <div className="w-full h-full p-4 overflow-y-auto max-h-[400px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BENCHMARK_SCENARIOS.map((sc) => (
                    <div
                      key={sc.id}
                      onClick={() => handleSelectBenchmarkScenario(sc)}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/80 cursor-pointer transition text-left space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-400">{sc.location}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                          {sc.simulatedPotholes.length} Potholes
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-xs line-clamp-1 group-hover:text-amber-300">
                        {lang === 'hi' ? sc.titleHi : sc.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {lang === 'hi' ? sc.descriptionHi : sc.description}
                      </p>
                      <button className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1">
                        <span>Load & Analyze</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Camera Permission / Error Alert */}
          {cameraError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{cameraError}</p>
                <p className="text-slate-400 mt-1">
                  Tip: If using Chrome/Safari on mobile, tap the URL bar icon to allow Camera permissions.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {activeTab === 'camera' && isCameraActive && (
              <>
                <button
                  onClick={captureAndAnalyzeCurrentFrame}
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950 flex items-center space-x-2 transition disabled:opacity-50 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t('btnSnapAnalyze', lang)}</span>
                </button>

                <button
                  onClick={() => setAutoIntervalScan(!autoIntervalScan)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition flex items-center space-x-2 cursor-pointer ${
                    autoIntervalScan
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {autoIntervalScan ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{t('autoScanInterval', lang)}</span>
                </button>

                <button
                  onClick={stopCamera}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
                >
                  {t('btnStopCamera', lang)}
                </button>
              </>
            )}

            {activeTab === 'upload' && (uploadedImageUrl || uploadedVideoUrl) && (
              <button
                onClick={() => {
                  setUploadedImageUrl(null);
                  setUploadedVideoUrl(null);
                  setCurrentDetections([]);
                  setUniquePotholeCount(0);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 hover:bg-slate-700"
              >
                Clear & Upload Another
              </button>
            )}

            <button
              onClick={() => setShowCalibration(!showCalibration)}
              className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 ml-auto flex items-center space-x-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'hi' ? 'अंशांकन व पैमाना' : 'Calibration & Scale'}</span>
            </button>
          </div>

          {/* Optical Calibration Reference Drawer */}
          {showCalibration && (
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Sliders className="w-4 h-4 text-amber-500" />
                  <span>{t('calibrationTitle', lang)}</span>
                </span>
                <span className="text-[11px] text-slate-400">IRC:SP:100 Calibration</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {t('calibrationDesc', lang)}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => setReferenceScale('lane_3_5m')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                    referenceScale === 'lane_3_5m'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Standard Indian Highway Lane (3.50m)
                </button>
                <button
                  onClick={() => setReferenceScale('tyre_22cm')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                    referenceScale === 'tyre_22cm'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Car/Truck Tyre Track (0.22m)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Detections & Inspection Summary (1 col) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full min-h-[380px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {lang === 'hi' ? 'पहचाने गए गड्ढों की सूची' : 'Detected Defect Roster'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold text-xs">
                  {currentDetections.length} {lang === 'hi' ? 'सक्रिय' : 'Active'}
                </span>
              </div>

              {currentDetections.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Eye className="w-8 h-8 mx-auto text-slate-500" />
                  <p className="text-xs font-medium">
                    {lang === 'hi' ? 'कोई गड्ढा नहीं दिखा या स्कैन प्रारंभ नहीं हुआ' : 'No potholes detected yet'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'hi' ? 'कैमरा चलाएं या ऊपर से टेस्ट परिदृश्य चुनें।' : 'Activate camera or load a benchmark scenario.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {currentDetections.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{p.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.severity === 'critical'
                              ? 'bg-red-500 text-white'
                              : p.severity === 'high'
                              ? 'bg-orange-500 text-white'
                              : 'bg-amber-500 text-slate-950'
                          }`}
                        >
                          {p.severity}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <div>
                          Est. Size: {p.approxDimensions.lengthCm}×{p.approxDimensions.widthCm} cm
                        </div>
                        <div>
                          Depth: ~{p.approxDimensions.depthCm} cm
                        </div>
                      </div>

                      {p.commuterHazard && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-amber-500/5 p-1.5 rounded border border-amber-500/20">
                          ⚠️ {p.commuterHazard}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Proceed Button */}
            {lastScanResult && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onScanComplete(lastScanResult)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <span>{t('btnProceedToCost', lang)}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
