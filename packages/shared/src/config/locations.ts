export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isMain?: boolean;
}

export const locations: Location[] = [
  {
    id: "arequipa-main",
    name: "RenovaBit - Sede Principal",
    address: "Av. Goyeneche 1602, Miraflores, Arequipa - 04004",
    coordinates: {
      lat: -16.3921345,
      lng: -71.5174131,
    },
    isMain: true,
  },
];

export const getMainLocation = (): Location => {
  const mainLocation = locations.find((location) => location.isMain);
  if (!mainLocation) {
    throw new Error("No main location found");
  }
  return mainLocation;
};

export const getAllLocations = (): Location[] => {
  return locations;
};
