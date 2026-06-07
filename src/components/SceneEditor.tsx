import { useState, useEffect } from 'react';
import { X, Check, LogOut, BookOpen, Home, Moon, Sun, Zap, Settings } from 'lucide-react';
import { Scene, Device, DeviceState } from '../types';

const availableIcons = [
  { key: 'Home', label: '居家', Icon: Home },
  { key: 'LogOut', label: '离家', Icon: LogOut },
  { key: 'Moon', label: '睡眠', Icon: Moon },
  { key: 'Sun', label: '明亮', Icon: Sun },
  { key: 'BookOpen', label: '阅读', Icon: BookOpen },
  { key: 'Zap', label: '影院', Icon: Zap },
  { key: 'Settings', label: '自定义', Icon: Settings },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, icon: string, deviceStates: DeviceState[]) => void;
  editScene?: Scene | null;
  devices: Device[];
  captureCurrentState: (ids: string[]) => DeviceState[];
}

export default function SceneEditor({
  open,
  onClose,
  onSave,
  editScene,
  devices,
  captureCurrentState,
}: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Home');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const isPreset = editScene?.isPreset;
  const isEditingPreset = isPreset && editScene?.actions;

  useEffect(() => {
    if (editScene) {
      setName(editScene.name);
      setIcon(editScene.icon);
      if (editScene.deviceStates) {
        setSelectedDevices(editScene.deviceStates.map((s) => s.id));
      } else {
        setSelectedDevices([]);
      }
    } else {
      setName('');
      setIcon('Home');
      setSelectedDevices([]);
    }
  }, [editScene, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    if (!isEditingPreset && selectedDevices.length === 0) return;
    const states = editScene?.deviceStates
      ? editScene.deviceStates
      : captureCurrentState(selectedDevices);
    onSave(name.trim(), icon, states);
    onClose();
  };

  const toggleDevice = (id: string) => {
    setSelectedDevices((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedDevices(devices.filter((d) => d.online).map((d) => d.id));
  };

  const clearAll = () => {
    setSelectedDevices([]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100">
            {editScene ? '编辑场景' : '新建场景'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div>
            <label className="block text-sm text-slate-300 mb-2">场景名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入场景名称"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">选择图标</label>
            <div className="grid grid-cols-7 gap-2">
              {availableIcons.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setIcon(key)}
                  title={label}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                    icon === key
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {!isEditingPreset && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-300">选择设备</label>
                <div className="flex gap-2">
                  <button
                    onClick={selectAll}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    全选
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs text-slate-400 hover:text-slate-300"
                  >
                    清空
                  </button>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mb-2">
                {!editScene && '将使用当前设备状态保存为场景配置'}
                {editScene && '编辑后需重新保存设备状态'}
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {devices.map((device) => (
                  <label
                    key={device.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      !device.online ? 'opacity-50' : 'hover:bg-slate-700'
                    } ${
                      selectedDevices.includes(device.id)
                        ? 'bg-blue-500/10'
                        : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDevices.includes(device.id)}
                      onChange={() => toggleDevice(device.id)}
                      disabled={!device.online}
                      className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-200">{device.name}</span>
                    <span className="text-xs text-slate-500 ml-auto">
                      {device.online ? (device.on ? '开启' : '关闭') : '离线'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {isEditingPreset && (
            <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-600">
              <p className="text-sm text-slate-400">
                预设场景使用动态设备匹配规则，设备选择不可编辑。
                您可以修改场景名称和图标。
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || (!isEditingPreset && selectedDevices.length === 0)}
            className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
