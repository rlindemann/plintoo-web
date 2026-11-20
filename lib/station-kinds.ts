// The kinds the station study maps, with their plain names. Kept apart from stations.ts, which
// reads files, so the browser's map can use them too.
// Plain names for the constraint kinds, in the order the study lists them.
export const CONSTRAINT_KINDS: [string, string][] = [
  ["flood-zone-3", "Flood zone 3"],
  ["flood-zone-2", "Flood zone 2"],
  ["sssi", "Sites of Special Scientific Interest"],
  ["scheduled-monument", "Scheduled monuments"],
  ["park-and-garden", "Registered parks and gardens"],
  ["battlefield", "Registered battlefields"],
  ["listed-building", "Listed buildings"],
  ["ancient-woodland-buffer", "Ancient woodland and 30 m around it"],
  ["habitat-wet", "Priority habitats, wet"],
  ["habitat-dry", "Priority habitats, dry"],
  ["watercourse-buffer", "Rivers and 10 m either side"],
  ["existing-development", "Buildings and 10 m around them"],
  ["road-noise", "Road noise over 50 dB"],
  ["rail-noise", "Rail noise over 50 dB"],
  ["green-belt", "Green Belt"],
  ["national-landscape", "National Landscape"],
  ["steep-slope", "Slopes steeper than 1 in 10"],
];

export const HISTORY_KINDS: Record<string, string> = {
  "conservation-area": "Conservation areas",
  "listed-building": "Listed buildings",
  "scheduled-monument": "Scheduled monuments",
  "park-and-garden": "Registered parks and gardens",
  battlefield: "Registered battlefields",
  "world-heritage-site": "World Heritage Sites",
  "woodland-ancient": "Ancient woodland",
  "woodland-later": "Later woodland",
};

// Kinds shown but not taken out of the free land: policy and design questions, not limits.
export const FLAG_KINDS = ["green-belt", "national-landscape", "steep-slope"];
