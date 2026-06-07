import { useSmartHome } from './hooks/useSmartHome';
import RoomTabs from './components/RoomTabs';
import DeviceCard from './components/DeviceCard';
import EnvironmentPanel from './components/EnvironmentPanel';
import EnergyPanel from './components/EnergyPanel';
import FeedbackToast from './components/FeedbackToast';
import ScenePanel from './components/ScenePanel';

function App() {
  const {
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
    getSceneDeviceCount,
  } = useSmartHome(5000);

  return (
    <div className="min-h-screen bg-slate-900">
      <RoomTabs current={currentRoom} onChange={setCurrentRoom} />

      <div className="p-4 max-w-6xl mx-auto space-y-4">
        <ScenePanel
          scenes={scenes}
          loadingId={sceneLoading}
          devices={devices}
          onExecute={executeScene}
          onDelete={deleteScene}
          onAdd={addScene}
          onUpdate={updateScene}
          captureCurrentState={captureCurrentState}
          getSceneDeviceCount={getSceneDeviceCount}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {roomDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onToggle={toggleDevice}
              onBrightness={setBrightness}
              onTemperature={setTemperature}
              onACMode={setACMode}
            />
          ))}
        </div>

        <EnvironmentPanel env={env} />
        <EnergyPanel hourly={hourlyEnergy} deviceEnergy={deviceEnergy} />
      </div>

      <FeedbackToast message={feedback?.msg || null} />
    </div>
  );
}

export default App;
