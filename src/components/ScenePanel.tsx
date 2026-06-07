import { useState } from 'react';
import { Plus, LayoutGrid } from 'lucide-react';
import { Scene, Device, DeviceState } from '../types';
import SceneCard from './SceneCard';
import SceneEditor from './SceneEditor';

interface Props {
  scenes: Scene[];
  loadingId: string | null;
  devices: Device[];
  onExecute: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (name: string, icon: string, states: DeviceState[]) => void;
  onUpdate: (id: string, updates: Partial<Scene>) => void;
  captureCurrentState: (ids: string[]) => DeviceState[];
}

export default function ScenePanel({
  scenes,
  loadingId,
  devices,
  onExecute,
  onDelete,
  onAdd,
  onUpdate,
  captureCurrentState,
}: Props) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);

  const handleEdit = (scene: Scene) => {
    setEditingScene(scene);
    setEditorOpen(true);
  };

  const handleAddNew = () => {
    setEditingScene(null);
    setEditorOpen(true);
  };

  const handleSave = (name: string, icon: string, states: DeviceState[]) => {
    if (editingScene) {
      onUpdate(editingScene.id, { name, icon, deviceStates: states });
    } else {
      onAdd(name, icon, states);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-semibold text-slate-100">场景模式</h2>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建场景
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            loading={loadingId === scene.id}
            onExecute={onExecute}
            onEdit={handleEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <SceneEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        editScene={editingScene}
        devices={devices}
        captureCurrentState={captureCurrentState}
      />
    </div>
  );
}
