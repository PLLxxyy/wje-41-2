export type Room = 'living' | 'bedroom' | 'kitchen' | 'study';
export type DeviceType = 'light' | 'ac' | 'camera' | 'curtain' | 'purifier' | 'speaker';
export type ACMode = 'cool' | 'heat' | 'dry' | 'fan';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: Room;
  online: boolean;
  on: boolean;
  brightness?: number;
  temperature?: number;
  acMode?: ACMode;
  power?: number;
}

export interface Environment {
  temperature: number;
  humidity: number;
  aqi: number;
}

export interface HourlyEnergy {
  hour: string;
  kwh: number;
}

export interface DeviceState {
  id: string;
  on: boolean;
  brightness?: number;
  temperature?: number;
  acMode?: ACMode;
}

export interface Scene {
  id: string;
  name: string;
  icon: string;
  deviceStates: DeviceState[];
  isPreset?: boolean;
}
