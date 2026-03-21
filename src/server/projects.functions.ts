import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const TierSchema = z.object({
  id: z.string(),
  shape: z.enum(['circle', 'circle_platform', 'square', 'square_platform', 'hexagon']),
  width: z.number(),
  height: z.number(),
});

const DecorationSchema = z.object({
  id: z.string(),
  iconId: z.string(),
  x: z.number(),
  y: z.number(),
  scale: z.number(),
  rotation: z.number(),
});

// Save a new cake project
export const saveProject = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      tiers: z.array(TierSchema),
      decorations: z.array(DecorationSchema),
      authToken: z.string(),
    })
  )
  .handler(async ({ data }) => {
    try {
      const { supabase } = await import('../lib/supabase');
      
      // Verify user with token
      const { data: user, error: userError } = await supabase.auth.getUser(
        data.authToken
      );

      if (userError || !user?.user) {
        throw new Error('Not authenticated');
      }

      // Create authenticated client with token for RLS
      const { createClient } = await import('@supabase/supabase-js');
      const authClient = createClient(
        import.meta.env.VITE_SUPABASE_URL || '',
        import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        {
          global: {
            headers: {
              Authorization: `Bearer ${data.authToken}`,
            },
          },
        }
      );

      const { data: project, error: insertError } = await authClient
        .from('cake_projects')
        .insert({
          user_id: user.user.id,
          name: data.name,
          tiers: data.tiers,
          decorations: data.decorations,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return { success: true, project };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// List all projects for the current user
export const listProjects = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      authToken: z.string(),
    })
  )
  .handler(async ({ data }) => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data: user, error: userError } = await supabase.auth.getUser(
        data.authToken
      );

      if (userError || !user?.user) {
        throw new Error('Not authenticated');
      }

      // Create authenticated client with token for RLS
      const { createClient } = await import('@supabase/supabase-js');
      const authClient = createClient(
        import.meta.env.VITE_SUPABASE_URL || '',
        import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        {
          global: {
            headers: {
              Authorization: `Bearer ${data.authToken}`,
            },
          },
        }
      );

      const { data: projects, error: queryError } = await authClient
        .from('cake_projects')
        .select('*')
        .eq('user_id', user.user.id)
        .order('updated_at', { ascending: false });

      if (queryError) throw queryError;

      return { success: true, projects: projects || [] };
    } catch (error: any) {
      return { success: false, error: error.message, projects: [] };
    }
  });

// Delete a project
export const deleteProject = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      projectId: z.string(),
      authToken: z.string(),
    })
  )
  .handler(async ({ data }) => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data: user, error: userError } = await supabase.auth.getUser(
        data.authToken
      );

      if (userError || !user?.user) {
        throw new Error('Not authenticated');
      }

      // Create authenticated client with token for RLS
      const { createClient } = await import('@supabase/supabase-js');
      const authClient = createClient(
        import.meta.env.VITE_SUPABASE_URL || '',
        import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        {
          global: {
            headers: {
              Authorization: `Bearer ${data.authToken}`,
            },
          },
        }
      );

      const { error: deleteError } = await authClient
        .from('cake_projects')
        .delete()
        .eq('id', data.projectId)
        .eq('user_id', user.user.id);

      if (deleteError) throw deleteError;

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
