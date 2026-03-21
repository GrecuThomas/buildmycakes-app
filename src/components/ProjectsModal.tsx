import { useState, useEffect } from 'react';
import { X, Trash2, Copy, Clock } from 'lucide-react';
import { listProjects, deleteProject } from '../server/projects.functions';

interface Project {
  id: string;
  name: string;
  tiers: any[];
  decorations: any[];
  created_at: string;
  updated_at: string;
}

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (project: Project) => Promise<void>;
}

export function ProjectsModal({ isOpen, onClose, onLoad }: ProjectsModalProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Get auth session
      const { supabase } = await import('../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Not authenticated. Please log in first.');
      }

      const result = await (listProjects as any)({
        data: { authToken: session.access_token },
      });
      if (result.success) {
        setProjects(result.projects);
      } else {
        setError(result.error || 'Failed to load projects');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async (project: Project) => {
    try {
      setLoadingProjectId(project.id);
      setError('');
      await onLoad(project);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoadingProjectId(null);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        setDeletingProjectId(projectId);
        
        // Get auth session
        const { supabase } = await import('../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          throw new Error('Not authenticated. Please log in first.');
        }

        const result = await (deleteProject({ data: { projectId, authToken: session.access_token } } as any) as any);
        if (result.success) {
          setProjects(projects.filter((p) => p.id !== projectId));
        } else {
          setError(result.error || 'Failed to delete project');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete project');
      } finally {
        setDeletingProjectId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">My Projects</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-slate-500">Loading projects...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <p className="text-slate-500 mb-2">No projects saved yet</p>
              <p className="text-xs text-slate-400">Create a cake design and click Save to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{project.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span>{project.tiers.length} tier{project.tiers.length !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>{project.decorations.length} decoration{project.decorations.length !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(project.updated_at)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleLoad(project)}
                      disabled={loadingProjectId === project.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Load project"
                    >
                      <Copy size={14} />
                      {loadingProjectId === project.id ? 'Loading...' : 'Load'}
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingProjectId === project.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Delete project"
                    >
                      <Trash2 size={14} />
                      {deletingProjectId === project.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
