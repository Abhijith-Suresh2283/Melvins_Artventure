import React, { useCallback, useMemo, useState } from "react";
import Cropper from "react-easy-crop";

// --- helper: create cropped image file ---
async function getCroppedImg(imageSrc, croppedAreaPixels, fileName = "cropped.jpg") {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  const blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9);
  });

  return new File([blob], fileName, { type: "image/jpeg" });
}

export default function ImageCropModal({
  open,
  file,
  aspect = 1, // square by default
  title = "Crop Image",
  onCancel,
  onDone,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    if (!previewUrl || !croppedAreaPixels) return;
    const croppedFile = await getCroppedImg(previewUrl, croppedAreaPixels, file?.name || "cropped.jpg");
    onDone?.(croppedFile);
  };

  if (!open || !file) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold">{title}</h3>
          <button onClick={onCancel} className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200">
            ✕
          </button>
        </div>

        <div className="relative w-full h-[60vh] bg-black">
          <Cropper
            image={previewUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="contain"
          />
        </div>

        <div className="p-5 flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500">ZOOM</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={onCancel}
            className="px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleDone}
            className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800"
          >
            Crop & Use
          </button>
        </div>
      </div>
    </div>
  );
}
