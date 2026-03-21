import { useState } from 'react';
import { X } from 'lucide-react';

interface Tier {
  id: string;
  shape: 'circle' | 'circle_platform' | 'square' | 'square_platform' | 'hexagon';
  width: number;
  height: number;
}

interface Decoration {
  id: string;
  iconId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  tiers: Tier[];
  decorations: Decoration[];
  isSaving?: boolean;
}

export function SaveProjectModal({
  isOpen,
  onClose,
  onSave,
  tiers,
  decorations,
  isSaving = false,
}: SaveProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    if (tiers.length === 0) {
      setError('Cannot save an empty cake design');
      return;
    }

    try {
      setError('');
      await onSave(projectName);
      setProjectName('');
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      setProjectName('');
      setError('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSaving) {
      handleSave();
    } else if (e.key === 'Escape' && !isSaving) {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Save Project</h2>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-semibold text-slate-700 mb-2">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Wedding Cake Design"
              disabled={isSaving}
              autoFocus
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Project Info */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Tiers:</span>
              <span className="font-semibold text-slate-900">{tiers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Decorations:</span>
              <span className="font-semibold text-slate-900">{decorations.length}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !projectName.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
