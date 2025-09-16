"use client";

import { getMainLocation } from "@renovabit/shared/src/config/locations";
import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";
import { RenovaBitPin } from "./renovabit-pin";

const mainLocation = getMainLocation();

export default function MapRenovaBit() {
  const { resolvedTheme } = useTheme();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/10 rounded-2xl">
        <p className="text-sm text-muted-foreground">Mapa no disponible</p>
      </div>
    );
  }

  const mapColorScheme = resolvedTheme === "dark" ? "DARK" : "LIGHT";

  return (
    <APIProvider apiKey={apiKey}>
      <GoogleMap
        defaultCenter={mainLocation.coordinates}
        defaultZoom={16}
        mapId="8335aededd74f006504e2f6e"
        gestureHandling="cooperative"
        disableDefaultUI={true}
        colorScheme={mapColorScheme}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "1rem",
        }}
      >
        <AdvancedMarker position={mainLocation.coordinates}>
          <RenovaBitPin size={48} />
        </AdvancedMarker>
      </GoogleMap>
    </APIProvider>
  );
}
