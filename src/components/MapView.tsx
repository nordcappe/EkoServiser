"use client";

import { useEffect, useRef } from "react";

interface MapPoint {
  lat: number;
  lng: number;
  label: string;
  type: "objava" | "majstor";
  id?: string;
}

interface MapProps {
  points?: MapPoint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export function MapView({ points = [], center = [44.4, 20.5], zoom = 7, height = "420px" }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet (client-only)
    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix default marker icons
      const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
      const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
      const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

      const defaultIcon = L.icon({ iconUrl, iconRetinaUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] });

      const objavaIcon = L.divIcon({
        html: '<div style="background:#2d9b5a;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 6px rgba(0,0,0,.3)">📌</div>',
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const majstorIcon = L.divIcon({
        html: '<div style="background:#7c3aed;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 6px rgba(0,0,0,.3)">🔧</div>',
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.Marker.prototype.options.icon = defaultIcon;

      const map = L.map(mapRef.current!).setView(center, zoom);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      points.forEach((p) => {
        const icon = p.type === "majstor" ? majstorIcon : objavaIcon;
        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
        marker.bindPopup(`<strong>${p.label}</strong>`);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height }} className="w-full rounded-2xl overflow-hidden" />
    </>
  );
}
