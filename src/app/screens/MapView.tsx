"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapPin {
  label: string;
  lat: number;
  lng: number;
  kind: "accent" | "ai" | "you" | "muted";
  description?: string;
}

interface MapViewProps {
  pins: MapPin[];
}

const pinColors = {
  accent: "#2563eb",
  ai: "#7c3aed",
  you: "#0d9488",
  muted: "#9aa0a6",
};

function createCustomIcon(kind: MapPin["kind"]) {
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        background: ${pinColors[kind]};
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

export function MapView({ pins }: MapViewProps) {
  const [center, setCenter] = useState<[number, number]>([48.8566, 2.3522]);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (pins.length > 0) {
      const firstPin = pins[0];
      setCenter([firstPin.lat, firstPin.lng]);
      setZoom(13);
    }
  }, [pins]);

  const bounds = pins.map(p => [p.lat, p.lng]) as [number, number][];

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      touchZoom={true}
      boxZoom={true}
      keyboard={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />
      {pins.map((pin) => (
        <Marker
          key={pin.label}
          position={[pin.lat, pin.lng]}
          icon={createCustomIcon(pin.kind)}
        >
          <Popup
            offset={[0, -12]}
            className="custom-popup"
          >
            <div style={{ padding: 4, minWidth: 140 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{pin.label}</div>
              {pin.description && (
                <div style={{ fontSize: 12, color: "#5f6368", marginTop: 2 }}>{pin.description}</div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      {bounds.length >= 2 && (
        <Polyline
          positions={bounds}
          pathOptions={{
            color: "#7c3aed",
            weight: 2,
            opacity: 0.6,
            dashArray: "8, 6",
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      )}
    </MapContainer>
  );
}