import { LogOut, BookOpen, Settings, Pencil, Trash2, Play, Home, Moon, Sun, Zap } from 'lucide-react';
import { Scene } from '../types';

const iconMap: Record<string, React.ElementType> = {
  LogOut,
  BookOpen,
  Settings,
  Pencil,
  Trash2,
  Home,
  Moon,
  Sun,
  Zap,
};

interface Props {
  scene: Scene;
  deviceCount: number;
  loading: boolean;
  onExecute: (id: string) => void;
  onEdit: (scene: Scene) => void;
  onDelete: (id: string) => void;
}

export default function SceneCard({ scene, deviceCount, loading, onExecute, onEdit, onDelete }: Props) {
  const Icon = iconMap[scene.icon] || Settings;

  return (
    <div className="relative p-4 rounded-xl bg-slate-800 border border-slate-700 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-200">{scene.name}</div>
            <div className="text-[10px] text-slate-500">
              {deviceCount} 个设备
            </div>
          </div>
        </div>
        {!scene.isPreset && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(scene)}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(scene.id)}
              className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => onExecute(scene.id)}
        disabled={loading}
        className={`w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
          loading
            ? 'bg-blue-500/50 text-blue-200 cursor-wait'
            : 'bg-blue-600 hover:bg-blue-500 text-white'
        }`}
      >
        <Play className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
        {loading ? '执行中...' : '执行场景'}
      </button>
    </div>
  );
}
