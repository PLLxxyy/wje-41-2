import { useState, useEffect, useCallback } from 'react';
import { Device, Room, Environment, HourlyEnergy, Scene, DeviceState } from '../types';
import {
  generateDevices,
  generateEnvironment,
  generateHourlyEnergy,
  generateDeviceEnergy,
  generatePresetScenes,
} from '../utils/mockData';

export function useSmartHome(refreshInterval = 5000) {
  const [devices, setDevices] = useState<Device[]>(() => generateDevices());
  const [currentRoom, setCurrentRoom] = useState<Room>('living');
  const [env, setEnv] = useState<Environment>(() => generateEnvironment());
  const [hourlyEnergy, setHourlyEnergy] = useState<HourlyEnergy[]>(() => generateHourlyEnergy());
  const [deviceEnergy, setDeviceEnergy] = useState<{ name: string; value: number }[]>([]);
  const [feedback, setFeedback] = useState<{ id: string; msg: string } | null>(null);
  const [scenes, setScenes] = useState<Scene[]>(() => generatePresetScenes());
  const [sceneLoading, setSceneLoading] = useState<string | null>(null);

  const roomDevices = devices.filter((d) => d.room === currentRoom);

  useEffect(() => {
    setDeviceEnergy(generateDeviceEnergy(devices));
  }, [devices]);

  const toggleDevice = useCallback((id: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const updated = { ...d, on: !d.on };
        setFeedback({ id, msg: `${updated.name} 已${updated.on ? '开启' : '关闭'}` });
        setTimeout(() => setFeedback((f) => (f?.id === id ? null : f)), 1500);
        return updated;
      })
    );
  }, []);

  const setBrightness = useCallback((id: string, val: number) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, brightness: val } : d)));
  }, []);

  const setTemperature = useCallback((id: string, val: number) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, temperature: val } : d)));
  }, []);

  const setACMode = useCallback((id: string, mode: Device['acMode']) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, acMode: mode } : d)));
  }, []);

  const executeScene = useCallback((sceneId: string) => {
    setSceneLoading(sceneId);
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;

    setDevices((prev) => {
      const updated = prev.map((d) => {
        const state = scene.deviceStates.find((s) => s.id === d.id);
        if (!state) return d;
        return { ...d, ...state };
      });
      return updated;
    });

    setFeedback({ id: sceneId, msg: `${scene.name} 已执行` });
    setTimeout(() => {
      setSceneLoading(null);
      setFeedback((f) => (f?.id === sceneId ? null : f));
    }, 1000);
  }, [scenes]);

  const addScene = useCallback((name: string, icon: string, deviceStates: DeviceState[]) => {
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      name,
      icon,
      deviceStates,
    };
    setScenes((prev) => [...prev, newScene]);
    setFeedback({ id: newScene.id, msg: `场景 ${name} 已保存` });
    setTimeout(() => setFeedback(null), 1500);
  }, []);

  const updateScene = useCallback((id: string, updates: Partial<Scene>) => {
    setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    setFeedback({ id, msg: `场景已更新` });
    setTimeout(() => setFeedback(null), 1500);
  }, []);

  const deleteScene = useCallback((id: string) => {
    const scene = scenes.find((s) => s.id === id);
    setScenes((prev) => prev.filter((s) => s.id !== id));
    if (scene) {
      setFeedback({ id, msg: `场景 ${scene.name} 已删除` });
      setTimeout(() => setFeedback(null), 1500);
    }
  }, [scenes]);

  const captureCurrentState = useCallback((deviceIds: string[]): DeviceState[] => {
    return devices
      .filter((d) => deviceIds.includes(d.id))
      .map((d) => ({
        id: d.id,
        on: d.on,
        brightness: d.brightness,
        temperature: d.temperature,
        acMode: d.acMode,
      }));
  }, [devices]);

  const refresh = useCallback(() => {
    setEnv(generateEnvironment());
    setHourlyEnergy(generateHourlyEnergy());
    setDeviceEnergy(generateDeviceEnergy(devices));
    // Randomly toggle one device offline/online
    if (Math.random() < 0.1) {
      setDevices((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        return prev.map((d, i) => (i === idx ? { ...d, online: !d.online } : d));
      });
    }
  }, [devices]);

  useEffect(() => {
    const timer = setInterval(refresh, refreshInterval);
    return () => clearInterval(timer);
  }, [refresh, refreshInterval]);

  return {
    devices,
    roomDevices,
    currentRoom,
    setCurrentRoom,
    env,
    hourlyEnergy,
    deviceEnergy,
    toggleDevice,
    setBrightness,
    setTemperature,
    setACMode,
    feedback,
    scenes,
    sceneLoading,
    executeScene,
    addScene,
    updateScene,
    deleteScene,
    captureCurrentState,
  };
}
