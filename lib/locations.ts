import wilayasDataEn from '@/i18n/dictionnaries/wilayas-dairas-commune_en.json';
import wilayasDataAr from '@/i18n/dictionnaries/wilayas-dairas-commune_ar.json';

export type LocationData = {
  code: string;
  name: string;
  dairas: {
    [dairaName: string]: string[];
  };
};

export type WilayaOption = {
  code: string;
  name: string;
  display: string; // "01 - Adrar"
};

export type DairaOption = {
  name: string;
  communes: string[];
};

/**
 * Get location data based on locale
 */
export function getLocationData(locale: string): LocationData[] {
  if (locale === 'ar') {
    return wilayasDataAr as unknown as LocationData[];
  }
  return wilayasDataEn as unknown as LocationData[];
}

/**
 * Get wilayas sorted by code
 */
export function getWilayas(locale: string): WilayaOption[] {
  const data = getLocationData(locale);
  return data
    .sort((a, b) => a.code.localeCompare(b.code))
    .map((wilaya) => ({
      code: wilaya.code,
      name: wilaya.name,
      display: `${wilaya.code} - ${wilaya.name}`,
    }));
}

/**
 * Get dairas for a specific wilaya
 */
export function getDairas(locale: string, wilayaCode: string): DairaOption[] {
  const data = getLocationData(locale);
  const wilaya = data.find((w) => w.code === wilayaCode);
  
  if (!wilaya) {
    return [];
  }

  return Object.entries(wilaya.dairas).map(([dairaName, communes]) => ({
    name: dairaName,
    communes,
  }));
}

/**
 * Get communes for a specific wilaya and daira
 */
export function getCommunes(
  locale: string,
  wilayaCode: string,
  dairaName: string
): string[] {
  const dairas = getDairas(locale, wilayaCode);
  const daira = dairas.find((d) => d.name === dairaName);
  
  if (!daira) {
    return [];
  }

  return daira.communes.sort();
}

/**
 * Find wilaya by code or name
 */
export function findWilaya(
  locale: string,
  searchValue: string
): LocationData | undefined {
  const data = getLocationData(locale);
  return data.find(
    (w) => w.code === searchValue || w.name === searchValue
  );
}

