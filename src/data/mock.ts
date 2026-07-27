import { Operator, Station, Train, Trip, TripStop, Disruption } from '../types';
import { addMinutes, subMinutes } from 'date-fns';

const now = new Date();

// ============================================================
// OPERATORS
// ============================================================
export const operators: Operator[] = [
  { id: 'op_kai', name: 'KAI', serviceType: 'Intercity', logo: '/logos/kai.png' },
  { id: 'op_kci', name: 'KAI Commuter', serviceType: 'Commuter Line', logo: '/logos/kci.png' },
  { id: 'op_mrtj', name: 'MRT Jakarta', serviceType: 'MRT', logo: '/logos/mrtj.png' },
  { id: 'op_lrtj', name: 'LRT Jakarta', serviceType: 'LRT', logo: '/logos/lrtj.png' },
  { id: 'op_lrtjb', name: 'LRT Jabodebek', serviceType: 'LRT', logo: '/logos/lrtjb.png' },
  { id: 'op_railink', name: 'Railink', serviceType: 'Airport Train', logo: '/logos/railink.png' },
  { id: 'op_kcic', name: 'KCIC (Whoosh)', serviceType: 'High Speed', logo: '/logos/whoosh.png' },
  { id: 'op_kail', name: 'KAI Logistik', serviceType: 'Cargo', logo: '/logos/kail.png' },
];

// ============================================================
// STATIONS (25+ real Java island stations with accurate coordinates)
// ============================================================
export const stations: Station[] = [
  // Jakarta
  { id: 'st_gmr', code: 'GMR', name: 'Gambir', city: 'Jakarta Pusat', province: 'DKI Jakarta', lat: -6.1766, lng: 106.8306, type: 'MAIN' },
  { id: 'st_pse', code: 'PSE', name: 'Pasar Senen', city: 'Jakarta Pusat', province: 'DKI Jakarta', lat: -6.1747, lng: 106.8444, type: 'MAIN' },
  { id: 'st_jakk', code: 'JAKK', name: 'Jakarta Kota', city: 'Jakarta Barat', province: 'DKI Jakarta', lat: -6.1375, lng: 106.8145, type: 'COMMUTER' },
  { id: 'st_mri', code: 'MRI', name: 'Manggarai', city: 'Jakarta Selatan', province: 'DKI Jakarta', lat: -6.2097, lng: 106.8506, type: 'MAIN' },
  { id: 'st_jng', code: 'JNG', name: 'Jatinegara', city: 'Jakarta Timur', province: 'DKI Jakarta', lat: -6.2150, lng: 106.8703, type: 'MAIN' },
  // Jabodetabek
  { id: 'st_boo', code: 'BOO', name: 'Bogor', city: 'Bogor', province: 'Jawa Barat', lat: -6.5956, lng: 106.7900, type: 'COMMUTER' },
  { id: 'st_bks', code: 'BKS', name: 'Bekasi', city: 'Bekasi', province: 'Jawa Barat', lat: -6.2365, lng: 106.9993, type: 'COMMUTER' },
  { id: 'st_dpk', code: 'DPK', name: 'Depok', city: 'Depok', province: 'Jawa Barat', lat: -6.4054, lng: 106.8177, type: 'COMMUTER' },
  { id: 'st_tng', code: 'TNG', name: 'Tangerang', city: 'Tangerang', province: 'Banten', lat: -6.1766, lng: 106.6297, type: 'COMMUTER' },
  // Jawa Barat
  { id: 'st_bdo', code: 'BD', name: 'Bandung', city: 'Bandung', province: 'Jawa Barat', lat: -6.9128, lng: 107.6019, type: 'MAIN' },
  { id: 'st_cn', code: 'CN', name: 'Cirebon', city: 'Cirebon', province: 'Jawa Barat', lat: -6.7063, lng: 108.5570, type: 'MAIN' },
  // Jawa Tengah
  { id: 'st_smt', code: 'SMT', name: 'Semarang Tawang', city: 'Semarang', province: 'Jawa Tengah', lat: -6.9643, lng: 110.4279, type: 'MAIN' },
  { id: 'st_smc', code: 'SMC', name: 'Semarang Poncol', city: 'Semarang', province: 'Jawa Tengah', lat: -6.9717, lng: 110.4097, type: 'MAIN' },
  { id: 'st_pwt', code: 'PWT', name: 'Purwokerto', city: 'Purwokerto', province: 'Jawa Tengah', lat: -7.4217, lng: 109.2288, type: 'MAIN' },
  { id: 'st_tgl', code: 'TG', name: 'Tegal', city: 'Tegal', province: 'Jawa Tengah', lat: -6.8697, lng: 109.1434, type: 'MAIN' },
  { id: 'st_pk', code: 'PK', name: 'Pekalongan', city: 'Pekalongan', province: 'Jawa Tengah', lat: -6.8889, lng: 109.6753, type: 'MAIN' },
  // Yogyakarta & Solo
  { id: 'st_yk', code: 'YK', name: 'Yogyakarta (Tugu)', city: 'Yogyakarta', province: 'DI Yogyakarta', lat: -7.7889, lng: 110.3617, type: 'MAIN' },
  { id: 'st_slo', code: 'SLO', name: 'Solo Balapan', city: 'Surakarta', province: 'Jawa Tengah', lat: -7.5678, lng: 110.8206, type: 'MAIN' },
  // Jawa Timur
  { id: 'st_mn', code: 'MN', name: 'Madiun', city: 'Madiun', province: 'Jawa Timur', lat: -7.6187, lng: 111.5240, type: 'MAIN' },
  { id: 'st_kd', code: 'KD', name: 'Kediri', city: 'Kediri', province: 'Jawa Timur', lat: -7.8189, lng: 112.0124, type: 'MAIN' },
  { id: 'st_sgu', code: 'SGU', name: 'Surabaya Gubeng', city: 'Surabaya', province: 'Jawa Timur', lat: -7.2656, lng: 112.7517, type: 'MAIN' },
  { id: 'st_sbi', code: 'SBI', name: 'Surabaya Pasar Turi', city: 'Surabaya', province: 'Jawa Timur', lat: -7.2484, lng: 112.7310, type: 'MAIN' },
  { id: 'st_ml', code: 'ML', name: 'Malang', city: 'Malang', province: 'Jawa Timur', lat: -7.9778, lng: 112.6369, type: 'MAIN' },
  // Whoosh
  { id: 'st_hlm', code: 'HLM', name: 'Halim', city: 'Jakarta Timur', province: 'DKI Jakarta', lat: -6.2483, lng: 106.8833, type: 'HIGH_SPEED' },
  { id: 'st_kra', code: 'KRA', name: 'Karawang', city: 'Karawang', province: 'Jawa Barat', lat: -6.3059, lng: 107.2972, type: 'HIGH_SPEED' },
  { id: 'st_pdl', code: 'PDL', name: 'Padalarang', city: 'Bandung Barat', province: 'Jawa Barat', lat: -6.8414, lng: 107.4717, type: 'HIGH_SPEED' },
  { id: 'st_tgl_whoosh', code: 'TGLS', name: 'Tegalluar', city: 'Bandung', province: 'Jawa Barat', lat: -6.9653, lng: 107.6906, type: 'HIGH_SPEED' },
  // MRT
  { id: 'st_lbb', code: 'LBB', name: 'Lebak Bulus Grab', city: 'Jakarta Selatan', province: 'DKI Jakarta', lat: -6.2894, lng: 106.7746, type: 'MRT' },
  { id: 'st_bhi', code: 'BHI', name: 'Bundaran HI', city: 'Jakarta Pusat', province: 'DKI Jakarta', lat: -6.1919, lng: 106.8230, type: 'MRT' },
  { id: 'st_da', code: 'DA', name: 'Dukuh Atas BNI', city: 'Jakarta Pusat', province: 'DKI Jakarta', lat: -6.2006, lng: 106.8228, type: 'MRT' },
];

// ============================================================
// TRAINS
// ============================================================
export const trains: Train[] = [
  { id: 'tr_aba', number: 'KA 1', name: 'Argo Bromo Anggrek', operatorId: 'op_kai', serviceType: 'Intercity', class: 'Eksekutif' },
  { id: 'tr_ap', number: 'KA 35', name: 'Argo Parahyangan', operatorId: 'op_kai', serviceType: 'Intercity', class: 'Eksekutif' },
  { id: 'tr_al', number: 'KA 13', name: 'Argo Lawu', operatorId: 'op_kai', serviceType: 'Intercity', class: 'Eksekutif' },
  { id: 'tr_aw', number: 'KA 7', name: 'Argo Wilis', operatorId: 'op_kai', serviceType: 'Intercity', class: 'Eksekutif' },
  { id: 'tr_tks', number: 'KA 57', name: 'Taksaka', operatorId: 'op_kai', serviceType: 'Intercity', class: 'Eksekutif' },
  { id: 'tr_gjy', number: 'KA 51', name: 'Gajayana', operatorId: 'op_kai', serviceType: 'Intercity', class: 'Eksekutif' },
  { id: 'tr_mtm', number: 'KA 128', name: 'Matarmaja', operatorId: 'op_kai', serviceType: 'Intercity', class: 'Ekonomi' },
  { id: 'tr_ldy', number: 'KA 207', name: 'Lodaya', operatorId: 'op_kai', serviceType: 'Intercity', class: 'Eksekutif' },
  { id: 'tr_cl_bgr', number: 'KA 1623', name: 'Commuter Line Bogor', operatorId: 'op_kci', serviceType: 'Commuter', class: 'Ekonomi' },
  { id: 'tr_cl_bks', number: 'KA 1741', name: 'Commuter Line Bekasi', operatorId: 'op_kci', serviceType: 'Commuter', class: 'Ekonomi' },
  { id: 'tr_mrt1', number: 'MRT 01', name: 'MRT Lebak Bulus-Bundaran HI', operatorId: 'op_mrtj', serviceType: 'MRT', class: 'Reguler' },
  { id: 'tr_lrt_jb', number: 'LRT 01', name: 'LRT Jabodebek Cawang-Cibubur', operatorId: 'op_lrtjb', serviceType: 'LRT', class: 'Reguler' },
  { id: 'tr_whoosh1', number: 'G701', name: 'Whoosh', operatorId: 'op_kcic', serviceType: 'High Speed', class: 'Premium Economy' },
  { id: 'tr_whoosh2', number: 'G703', name: 'Whoosh', operatorId: 'op_kcic', serviceType: 'High Speed', class: 'First Class' },
  { id: 'tr_bandara', number: 'BIM 1', name: 'Kereta Bandara Soekarno-Hatta', operatorId: 'op_railink', serviceType: 'Airport Train', class: 'Premium' },
  { id: 'tr_as', number: 'KA 3', name: 'Argo Semeru', operatorId: 'op_kai', serviceType: 'Intercity', class: 'Eksekutif' },
];

// ============================================================
// HELPER: interpolate lat/lng between two points based on progress
// ============================================================
function interpolate(lat1: number, lng1: number, lat2: number, lng2: number, progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  return {
    lat: lat1 + (lat2 - lat1) * p,
    lng: lng1 + (lng2 - lng1) * p,
  };
}

// ============================================================
// TRIPS (12+ with various statuses)
// ============================================================
export const trips: Trip[] = [
  // 1. Argo Bromo Anggrek — IN_TRANSIT Jakarta→Surabaya (departed 3h ago, arriving in ~4.5h)
  {
    id: 'trip_aba_1',
    trainId: 'tr_aba',
    originId: 'st_gmr',
    destinationId: 'st_sgu',
    scheduledDeparture: subMinutes(now, 180).toISOString(),
    actualDeparture: subMinutes(now, 175).toISOString(),
    scheduledArrival: addMinutes(now, 270).toISOString(),
    estimatedArrival: addMinutes(now, 285).toISOString(),
    currentStatus: 'IN_TRANSIT',
    delayMinutes: 10,
    ...interpolate(-6.1766, 106.8306, -7.2656, 112.7517, 0.38),
    currentSpeed: 95,
    heading: 110,
    positionSource: 'ESTIMATED',
    lastUpdated: now.toISOString(),
    stops: [
      { id: 'ts_aba_1', tripId: 'trip_aba_1', stationId: 'st_gmr', scheduledArrival: subMinutes(now, 200).toISOString(), scheduledDeparture: subMinutes(now, 180).toISOString(), actualDeparture: subMinutes(now, 175).toISOString(), platform: '3', status: 'ARRIVED', delayMinutes: 0 },
      { id: 'ts_aba_2', tripId: 'trip_aba_1', stationId: 'st_cn', scheduledArrival: subMinutes(now, 30).toISOString(), scheduledDeparture: subMinutes(now, 25).toISOString(), actualArrival: subMinutes(now, 20).toISOString(), actualDeparture: subMinutes(now, 15).toISOString(), platform: '2', status: 'ARRIVED', delayMinutes: 10 },
      { id: 'ts_aba_3', tripId: 'trip_aba_1', stationId: 'st_smt', scheduledArrival: addMinutes(now, 60).toISOString(), scheduledDeparture: addMinutes(now, 65).toISOString(), estimatedArrival: addMinutes(now, 70).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 10 },
      { id: 'ts_aba_4', tripId: 'trip_aba_1', stationId: 'st_sgu', scheduledArrival: addMinutes(now, 270).toISOString(), scheduledDeparture: addMinutes(now, 270).toISOString(), estimatedArrival: addMinutes(now, 285).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 15 },
    ],
  },
  // 2. Argo Parahyangan — IN_TRANSIT Jakarta→Bandung (departed 40min ago)
  {
    id: 'trip_ap_1',
    trainId: 'tr_ap',
    originId: 'st_gmr',
    destinationId: 'st_bdo',
    scheduledDeparture: subMinutes(now, 45).toISOString(),
    actualDeparture: subMinutes(now, 45).toISOString(),
    scheduledArrival: addMinutes(now, 100).toISOString(),
    estimatedArrival: addMinutes(now, 100).toISOString(),
    currentStatus: 'IN_TRANSIT',
    delayMinutes: 0,
    ...interpolate(-6.1766, 106.8306, -6.9128, 107.6019, 0.31),
    currentSpeed: 85,
    heading: 130,
    positionSource: 'ESTIMATED',
    lastUpdated: now.toISOString(),
    stops: [
      { id: 'ts_ap_1', tripId: 'trip_ap_1', stationId: 'st_gmr', scheduledArrival: subMinutes(now, 60).toISOString(), scheduledDeparture: subMinutes(now, 45).toISOString(), actualDeparture: subMinutes(now, 45).toISOString(), platform: '2', status: 'ARRIVED', delayMinutes: 0 },
      { id: 'ts_ap_2', tripId: 'trip_ap_1', stationId: 'st_bdo', scheduledArrival: addMinutes(now, 100).toISOString(), scheduledDeparture: addMinutes(now, 110).toISOString(), estimatedArrival: addMinutes(now, 100).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 0 },
    ],
  },
  // 3. Whoosh G701 — IN_TRANSIT Halim→Tegalluar (departed 15min ago, very fast)
  {
    id: 'trip_whoosh_1',
    trainId: 'tr_whoosh1',
    originId: 'st_hlm',
    destinationId: 'st_tgl_whoosh',
    scheduledDeparture: subMinutes(now, 15).toISOString(),
    actualDeparture: subMinutes(now, 15).toISOString(),
    scheduledArrival: addMinutes(now, 20).toISOString(),
    estimatedArrival: addMinutes(now, 20).toISOString(),
    currentStatus: 'IN_TRANSIT',
    delayMinutes: 0,
    ...interpolate(-6.2483, 106.8833, -6.9653, 107.6906, 0.43),
    currentSpeed: 305,
    heading: 120,
    positionSource: 'LIVE',
    lastUpdated: now.toISOString(),
    stops: [
      { id: 'ts_w_1', tripId: 'trip_whoosh_1', stationId: 'st_hlm', scheduledArrival: subMinutes(now, 30).toISOString(), scheduledDeparture: subMinutes(now, 15).toISOString(), actualDeparture: subMinutes(now, 15).toISOString(), platform: '1', status: 'ARRIVED', delayMinutes: 0 },
      { id: 'ts_w_2', tripId: 'trip_whoosh_1', stationId: 'st_kra', scheduledArrival: subMinutes(now, 3).toISOString(), scheduledDeparture: subMinutes(now, 1).toISOString(), actualArrival: subMinutes(now, 3).toISOString(), actualDeparture: subMinutes(now, 1).toISOString(), platform: '1', status: 'ARRIVED', delayMinutes: 0 },
      { id: 'ts_w_3', tripId: 'trip_whoosh_1', stationId: 'st_pdl', scheduledArrival: addMinutes(now, 10).toISOString(), scheduledDeparture: addMinutes(now, 12).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 0 },
      { id: 'ts_w_4', tripId: 'trip_whoosh_1', stationId: 'st_tgl_whoosh', scheduledArrival: addMinutes(now, 20).toISOString(), scheduledDeparture: addMinutes(now, 20).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 0 },
    ],
  },
  // 4. Commuter Line Bogor — BOARDING at Jakarta Kota
  {
    id: 'trip_cl_bgr_1',
    trainId: 'tr_cl_bgr',
    originId: 'st_jakk',
    destinationId: 'st_boo',
    scheduledDeparture: addMinutes(now, 5).toISOString(),
    scheduledArrival: addMinutes(now, 65).toISOString(),
    currentStatus: 'BOARDING',
    delayMinutes: 0,
    currentLat: -6.1375,
    currentLng: 106.8145,
    positionSource: 'SCHEDULED',
    lastUpdated: now.toISOString(),
    stops: [
      { id: 'ts_cl_1', tripId: 'trip_cl_bgr_1', stationId: 'st_jakk', scheduledArrival: subMinutes(now, 5).toISOString(), scheduledDeparture: addMinutes(now, 5).toISOString(), platform: '10', status: 'BOARDING', delayMinutes: 0 },
      { id: 'ts_cl_2', tripId: 'trip_cl_bgr_1', stationId: 'st_mri', scheduledArrival: addMinutes(now, 20).toISOString(), scheduledDeparture: addMinutes(now, 22).toISOString(), platform: '4', status: 'SCHEDULED', delayMinutes: 0 },
      { id: 'ts_cl_3', tripId: 'trip_cl_bgr_1', stationId: 'st_dpk', scheduledArrival: addMinutes(now, 40).toISOString(), scheduledDeparture: addMinutes(now, 42).toISOString(), platform: '2', status: 'SCHEDULED', delayMinutes: 0 },
      { id: 'ts_cl_4', tripId: 'trip_cl_bgr_1', stationId: 'st_boo', scheduledArrival: addMinutes(now, 65).toISOString(), scheduledDeparture: addMinutes(now, 65).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 0 },
    ],
  },
  // 5. Taksaka — SCHEDULED (departs in 30min)
  {
    id: 'trip_tks_1',
    trainId: 'tr_tks',
    originId: 'st_gmr',
    destinationId: 'st_yk',
    scheduledDeparture: addMinutes(now, 30).toISOString(),
    scheduledArrival: addMinutes(now, 490).toISOString(),
    currentStatus: 'SCHEDULED',
    delayMinutes: 0,
    positionSource: 'SCHEDULED',
    lastUpdated: now.toISOString(),
    stops: [
      { id: 'ts_tks_1', tripId: 'trip_tks_1', stationId: 'st_gmr', scheduledArrival: addMinutes(now, 15).toISOString(), scheduledDeparture: addMinutes(now, 30).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 0 },
      { id: 'ts_tks_2', tripId: 'trip_tks_1', stationId: 'st_cn', scheduledArrival: addMinutes(now, 190).toISOString(), scheduledDeparture: addMinutes(now, 195).toISOString(), platform: '2', status: 'SCHEDULED', delayMinutes: 0 },
      { id: 'ts_tks_3', tripId: 'trip_tks_1', stationId: 'st_yk', scheduledArrival: addMinutes(now, 490).toISOString(), scheduledDeparture: addMinutes(now, 490).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 0 },
    ],
  },
  // 6. Gajayana — DELAYED Jakarta→Malang
  {
    id: 'trip_gjy_1',
    trainId: 'tr_gjy',
    originId: 'st_gmr',
    destinationId: 'st_ml',
    scheduledDeparture: subMinutes(now, 120).toISOString(),
    actualDeparture: subMinutes(now, 95).toISOString(),
    scheduledArrival: addMinutes(now, 420).toISOString(),
    estimatedArrival: addMinutes(now, 450).toISOString(),
    currentStatus: 'DELAYED',
    delayMinutes: 25,
    ...interpolate(-6.1766, 106.8306, -7.9778, 112.6369, 0.22),
    currentSpeed: 70,
    heading: 105,
    positionSource: 'ESTIMATED',
    lastUpdated: subMinutes(now, 5).toISOString(),
    stops: [
      { id: 'ts_gjy_1', tripId: 'trip_gjy_1', stationId: 'st_gmr', scheduledArrival: subMinutes(now, 140).toISOString(), scheduledDeparture: subMinutes(now, 120).toISOString(), actualDeparture: subMinutes(now, 95).toISOString(), platform: '4', status: 'ARRIVED', delayMinutes: 25 },
      { id: 'ts_gjy_2', tripId: 'trip_gjy_1', stationId: 'st_cn', scheduledArrival: addMinutes(now, 40).toISOString(), scheduledDeparture: addMinutes(now, 45).toISOString(), estimatedArrival: addMinutes(now, 65).toISOString(), platform: '2', status: 'DELAYED', delayMinutes: 25 },
      { id: 'ts_gjy_3', tripId: 'trip_gjy_1', stationId: 'st_smt', scheduledArrival: addMinutes(now, 210).toISOString(), scheduledDeparture: addMinutes(now, 215).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 25 },
      { id: 'ts_gjy_4', tripId: 'trip_gjy_1', stationId: 'st_ml', scheduledArrival: addMinutes(now, 420).toISOString(), scheduledDeparture: addMinutes(now, 420).toISOString(), estimatedArrival: addMinutes(now, 450).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 30 },
    ],
  },
  // 7. Argo Lawu — ARRIVED at Solo Balapan
  {
    id: 'trip_al_1',
    trainId: 'tr_al',
    originId: 'st_gmr',
    destinationId: 'st_slo',
    scheduledDeparture: subMinutes(now, 480).toISOString(),
    actualDeparture: subMinutes(now, 480).toISOString(),
    scheduledArrival: subMinutes(now, 15).toISOString(),
    actualArrival: subMinutes(now, 10).toISOString(),
    currentStatus: 'ARRIVED',
    delayMinutes: 0,
    currentLat: -7.5678,
    currentLng: 110.8206,
    positionSource: 'SCHEDULED',
    lastUpdated: subMinutes(now, 10).toISOString(),
    stops: [
      { id: 'ts_al_1', tripId: 'trip_al_1', stationId: 'st_gmr', scheduledArrival: subMinutes(now, 500).toISOString(), scheduledDeparture: subMinutes(now, 480).toISOString(), actualDeparture: subMinutes(now, 480).toISOString(), platform: '1', status: 'ARRIVED', delayMinutes: 0 },
      { id: 'ts_al_2', tripId: 'trip_al_1', stationId: 'st_slo', scheduledArrival: subMinutes(now, 15).toISOString(), scheduledDeparture: subMinutes(now, 15).toISOString(), actualArrival: subMinutes(now, 10).toISOString(), platform: '2', status: 'ARRIVED', delayMinutes: 0 },
    ],
  },
  // 8. Matarmaja — CANCELLED
  {
    id: 'trip_mtm_1',
    trainId: 'tr_mtm',
    originId: 'st_pse',
    destinationId: 'st_slo',
    scheduledDeparture: addMinutes(now, 60).toISOString(),
    scheduledArrival: addMinutes(now, 540).toISOString(),
    currentStatus: 'CANCELLED',
    delayMinutes: 0,
    positionSource: 'OFFLINE',
    lastUpdated: subMinutes(now, 30).toISOString(),
    stops: [
      { id: 'ts_mtm_1', tripId: 'trip_mtm_1', stationId: 'st_pse', scheduledArrival: addMinutes(now, 45).toISOString(), scheduledDeparture: addMinutes(now, 60).toISOString(), platform: '3', status: 'CANCELLED', delayMinutes: 0 },
      { id: 'ts_mtm_2', tripId: 'trip_mtm_1', stationId: 'st_cn', scheduledArrival: addMinutes(now, 240).toISOString(), scheduledDeparture: addMinutes(now, 245).toISOString(), status: 'CANCELLED', delayMinutes: 0 },
      { id: 'ts_mtm_3', tripId: 'trip_mtm_1', stationId: 'st_slo', scheduledArrival: addMinutes(now, 540).toISOString(), scheduledDeparture: addMinutes(now, 540).toISOString(), status: 'CANCELLED', delayMinutes: 0 },
    ],
  },
  // 9. MRT — IN_TRANSIT Lebak Bulus → Bundaran HI
  {
    id: 'trip_mrt_1',
    trainId: 'tr_mrt1',
    originId: 'st_lbb',
    destinationId: 'st_bhi',
    scheduledDeparture: subMinutes(now, 10).toISOString(),
    actualDeparture: subMinutes(now, 10).toISOString(),
    scheduledArrival: addMinutes(now, 15).toISOString(),
    estimatedArrival: addMinutes(now, 15).toISOString(),
    currentStatus: 'IN_TRANSIT',
    delayMinutes: 0,
    ...interpolate(-6.2894, 106.7746, -6.1919, 106.8230, 0.4),
    currentSpeed: 40,
    heading: 0,
    positionSource: 'LIVE',
    lastUpdated: now.toISOString(),
    stops: [
      { id: 'ts_mrt_1', tripId: 'trip_mrt_1', stationId: 'st_lbb', scheduledArrival: subMinutes(now, 15).toISOString(), scheduledDeparture: subMinutes(now, 10).toISOString(), actualDeparture: subMinutes(now, 10).toISOString(), platform: '1', status: 'ARRIVED', delayMinutes: 0 },
      { id: 'ts_mrt_2', tripId: 'trip_mrt_1', stationId: 'st_da', scheduledArrival: addMinutes(now, 5).toISOString(), scheduledDeparture: addMinutes(now, 7).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 0 },
      { id: 'ts_mrt_3', tripId: 'trip_mrt_1', stationId: 'st_bhi', scheduledArrival: addMinutes(now, 15).toISOString(), scheduledDeparture: addMinutes(now, 15).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 0 },
    ],
  },
  // 10. Argo Wilis — IN_TRANSIT Surabaya→Bandung
  {
    id: 'trip_aw_1',
    trainId: 'tr_aw',
    originId: 'st_sbi',
    destinationId: 'st_bdo',
    scheduledDeparture: subMinutes(now, 240).toISOString(),
    actualDeparture: subMinutes(now, 240).toISOString(),
    scheduledArrival: addMinutes(now, 240).toISOString(),
    estimatedArrival: addMinutes(now, 245).toISOString(),
    currentStatus: 'IN_TRANSIT',
    delayMinutes: 5,
    ...interpolate(-7.2484, 112.7310, -6.9128, 107.6019, 0.5),
    currentSpeed: 90,
    heading: 280,
    positionSource: 'ESTIMATED',
    lastUpdated: subMinutes(now, 2).toISOString(),
    stops: [
      { id: 'ts_aw_1', tripId: 'trip_aw_1', stationId: 'st_sbi', scheduledArrival: subMinutes(now, 260).toISOString(), scheduledDeparture: subMinutes(now, 240).toISOString(), actualDeparture: subMinutes(now, 240).toISOString(), platform: '3', status: 'ARRIVED', delayMinutes: 0 },
      { id: 'ts_aw_2', tripId: 'trip_aw_1', stationId: 'st_mn', scheduledArrival: subMinutes(now, 120).toISOString(), scheduledDeparture: subMinutes(now, 115).toISOString(), actualArrival: subMinutes(now, 118).toISOString(), actualDeparture: subMinutes(now, 113).toISOString(), platform: '2', status: 'ARRIVED', delayMinutes: 2 },
      { id: 'ts_aw_3', tripId: 'trip_aw_1', stationId: 'st_yk', scheduledArrival: subMinutes(now, 15).toISOString(), scheduledDeparture: subMinutes(now, 10).toISOString(), actualArrival: subMinutes(now, 10).toISOString(), actualDeparture: subMinutes(now, 5).toISOString(), platform: '1', status: 'ARRIVED', delayMinutes: 5 },
      { id: 'ts_aw_4', tripId: 'trip_aw_1', stationId: 'st_bdo', scheduledArrival: addMinutes(now, 240).toISOString(), scheduledDeparture: addMinutes(now, 240).toISOString(), estimatedArrival: addMinutes(now, 245).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 5 },
    ],
  },
  // 11. Lodaya — BOARDING
  {
    id: 'trip_ldy_1',
    trainId: 'tr_ldy',
    originId: 'st_bdo',
    destinationId: 'st_yk',
    scheduledDeparture: addMinutes(now, 10).toISOString(),
    scheduledArrival: addMinutes(now, 380).toISOString(),
    currentStatus: 'BOARDING',
    delayMinutes: 0,
    currentLat: -6.9128,
    currentLng: 107.6019,
    positionSource: 'SCHEDULED',
    lastUpdated: now.toISOString(),
    stops: [
      { id: 'ts_ldy_1', tripId: 'trip_ldy_1', stationId: 'st_bdo', scheduledArrival: subMinutes(now, 5).toISOString(), scheduledDeparture: addMinutes(now, 10).toISOString(), platform: '3', status: 'BOARDING', delayMinutes: 0 },
      { id: 'ts_ldy_2', tripId: 'trip_ldy_1', stationId: 'st_yk', scheduledArrival: addMinutes(now, 380).toISOString(), scheduledDeparture: addMinutes(now, 380).toISOString(), platform: '2', status: 'SCHEDULED', delayMinutes: 0 },
    ],
  },
  // 12. Commuter Line Bekasi — IN_TRANSIT Jakarta Kota → Bekasi
  {
    id: 'trip_cl_bks_1',
    trainId: 'tr_cl_bks',
    originId: 'st_jakk',
    destinationId: 'st_bks',
    scheduledDeparture: subMinutes(now, 20).toISOString(),
    actualDeparture: subMinutes(now, 18).toISOString(),
    scheduledArrival: addMinutes(now, 25).toISOString(),
    estimatedArrival: addMinutes(now, 27).toISOString(),
    currentStatus: 'IN_TRANSIT',
    delayMinutes: 2,
    ...interpolate(-6.1375, 106.8145, -6.2365, 106.9993, 0.44),
    currentSpeed: 45,
    heading: 90,
    positionSource: 'ESTIMATED',
    lastUpdated: now.toISOString(),
    stops: [
      { id: 'ts_clb_1', tripId: 'trip_cl_bks_1', stationId: 'st_jakk', scheduledArrival: subMinutes(now, 30).toISOString(), scheduledDeparture: subMinutes(now, 20).toISOString(), actualDeparture: subMinutes(now, 18).toISOString(), platform: '12', status: 'ARRIVED', delayMinutes: 2 },
      { id: 'ts_clb_2', tripId: 'trip_cl_bks_1', stationId: 'st_jng', scheduledArrival: subMinutes(now, 5).toISOString(), scheduledDeparture: subMinutes(now, 3).toISOString(), actualArrival: subMinutes(now, 3).toISOString(), actualDeparture: subMinutes(now, 1).toISOString(), platform: '3', status: 'ARRIVED', delayMinutes: 2 },
      { id: 'ts_clb_3', tripId: 'trip_cl_bks_1', stationId: 'st_bks', scheduledArrival: addMinutes(now, 25).toISOString(), scheduledDeparture: addMinutes(now, 25).toISOString(), estimatedArrival: addMinutes(now, 27).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 2 },
    ],
  },
  // 13. Argo Semeru — IN_TRANSIT Surabaya Gubeng → Gambir
  {
    id: 'trip_as_1',
    trainId: 'tr_as',
    originId: 'st_sgu',
    destinationId: 'st_gmr',
    scheduledDeparture: subMinutes(now, 300).toISOString(),
    actualDeparture: subMinutes(now, 300).toISOString(),
    scheduledArrival: addMinutes(now, 150).toISOString(),
    estimatedArrival: addMinutes(now, 150).toISOString(),
    currentStatus: 'IN_TRANSIT',
    delayMinutes: 0,
    ...interpolate(-7.2656, 112.7517, -6.1766, 106.8306, 0.67),
    currentSpeed: 100,
    heading: 290,
    positionSource: 'ESTIMATED',
    lastUpdated: now.toISOString(),
    stops: [
      { id: 'ts_as_1', tripId: 'trip_as_1', stationId: 'st_sgu', scheduledArrival: subMinutes(now, 320).toISOString(), scheduledDeparture: subMinutes(now, 300).toISOString(), actualDeparture: subMinutes(now, 300).toISOString(), platform: '2', status: 'ARRIVED', delayMinutes: 0 },
      { id: 'ts_as_2', tripId: 'trip_as_1', stationId: 'st_smt', scheduledArrival: subMinutes(now, 100).toISOString(), scheduledDeparture: subMinutes(now, 95).toISOString(), actualArrival: subMinutes(now, 100).toISOString(), actualDeparture: subMinutes(now, 95).toISOString(), platform: '3', status: 'ARRIVED', delayMinutes: 0 },
      { id: 'ts_as_3', tripId: 'trip_as_1', stationId: 'st_cn', scheduledArrival: addMinutes(now, 30).toISOString(), scheduledDeparture: addMinutes(now, 35).toISOString(), estimatedArrival: addMinutes(now, 30).toISOString(), platform: '1', status: 'SCHEDULED', delayMinutes: 0 },
      { id: 'ts_as_4', tripId: 'trip_as_1', stationId: 'st_gmr', scheduledArrival: addMinutes(now, 150).toISOString(), scheduledDeparture: addMinutes(now, 150).toISOString(), estimatedArrival: addMinutes(now, 150).toISOString(), platform: '3', status: 'SCHEDULED', delayMinutes: 0 },
    ],
  },
  // 14. Whoosh G703 — SCHEDULED
  {
    id: 'trip_whoosh_2',
    trainId: 'tr_whoosh2',
    originId: 'st_tgl_whoosh',
    destinationId: 'st_hlm',
    scheduledDeparture: addMinutes(now, 45).toISOString(),
    scheduledArrival: addMinutes(now, 80).toISOString(),
    currentStatus: 'SCHEDULED',
    delayMinutes: 0,
    positionSource: 'SCHEDULED',
    lastUpdated: now.toISOString(),
  },
];

// ============================================================
// DISRUPTIONS
// ============================================================
export const disruptions: Disruption[] = [
  {
    id: 'dis_1',
    title: 'Gangguan Persinyalan Manggarai',
    type: 'SIGNAL',
    severity: 'HIGH',
    location: 'Stasiun Manggarai, Jakarta Selatan',
    status: 'ACTIVE',
    description: 'Terjadi gangguan persinyalan di Stasiun Manggarai yang menyebabkan antrean kereta Commuter Line dan keterlambatan pada beberapa perjalanan antarkota yang melewati jalur selatan.',
    startTime: subMinutes(now, 90).toISOString(),
    createdAt: subMinutes(now, 90).toISOString(),
  },
  {
    id: 'dis_2',
    title: 'Cuaca Buruk Wilayah Cirebon-Tegal',
    type: 'WEATHER',
    severity: 'MEDIUM',
    location: 'Jalur Utara: Cirebon — Tegal',
    status: 'ACTIVE',
    description: 'Hujan lebat disertai angin kencang di wilayah Cirebon hingga Tegal menyebabkan pembatasan kecepatan maksimum kereta menjadi 60 km/jam.',
    startTime: subMinutes(now, 45).toISOString(),
    endTime: addMinutes(now, 120).toISOString(),
    createdAt: subMinutes(now, 45).toISOString(),
  },
  {
    id: 'dis_3',
    title: 'Perawatan Rel Segmen Purwokerto-Kroya',
    type: 'TRACK',
    severity: 'LOW',
    location: 'Purwokerto — Kroya',
    status: 'ACTIVE',
    description: 'Perawatan berkala rel kereta api di segmen Purwokerto-Kroya. Kereta yang melewati jalur ini mengalami pengalihan ke jalur tunggal.',
    startTime: subMinutes(now, 300).toISOString(),
    endTime: addMinutes(now, 180).toISOString(),
    createdAt: subMinutes(now, 300).toISOString(),
  },
  {
    id: 'dis_4',
    title: 'Gangguan Rangkaian KA Matarmaja',
    type: 'TRAIN',
    severity: 'CRITICAL',
    location: 'Depo Pasar Senen',
    status: 'ACTIVE',
    description: 'KA Matarmaja (KA 128) Pasar Senen-Solo Balapan mengalami gangguan teknis pada rangkaian dan dibatalkan untuk hari ini. Penumpang diarahkan ke KA Argo Lawu atau Gajayana.',
    startTime: subMinutes(now, 120).toISOString(),
    createdAt: subMinutes(now, 120).toISOString(),
  },
  {
    id: 'dis_5',
    title: 'Perubahan Peron Stasiun Gambir',
    type: 'OTHER',
    severity: 'INFO',
    location: 'Stasiun Gambir, Jakarta',
    status: 'ACTIVE',
    description: 'Terjadi perubahan peron untuk KA Taksaka dari Peron 1 menjadi Peron 3 dikarenakan pekerjaan perawatan di area peron 1.',
    startTime: subMinutes(now, 180).toISOString(),
    endTime: addMinutes(now, 360).toISOString(),
    createdAt: subMinutes(now, 180).toISOString(),
  },
  {
    id: 'dis_6',
    title: 'Keterlambatan Gajayana Akibat Antrean',
    type: 'SIGNAL',
    severity: 'MEDIUM',
    location: 'Segmen Jakarta — Cirebon',
    status: 'ACTIVE',
    description: 'KA Gajayana mengalami keterlambatan 25 menit akibat antrean di jalur keluar Stasiun Gambir yang disebabkan oleh gangguan persinyalan Manggarai.',
    startTime: subMinutes(now, 95).toISOString(),
    createdAt: subMinutes(now, 95).toISOString(),
  },
  {
    id: 'dis_7',
    title: 'Gangguan Listrik Aliran Atas Bekasi',
    type: 'SIGNAL',
    severity: 'HIGH',
    location: 'Stasiun Bekasi',
    status: 'RESOLVED',
    description: 'Gangguan pada listrik aliran atas (LAA) di Stasiun Bekasi telah diperbaiki. Layanan Commuter Line Bekasi kembali normal.',
    startTime: subMinutes(now, 240).toISOString(),
    endTime: subMinutes(now, 60).toISOString(),
    createdAt: subMinutes(now, 240).toISOString(),
  },
];
