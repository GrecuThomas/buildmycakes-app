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

// Get a single project for the current user
export const getProject = createServerFn({ method: 'GET' })
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

      const { data: project, error: queryError } = await authClient
        .from('cake_projects')
        .select('*')
        .eq('id', data.projectId)
        .eq('user_id', user.user.id)
        .single();

      if (queryError || !project) {
        throw new Error('Project not found');
      }

      return { success: true, project };
    } catch (error: any) {
      return { success: false, error: error.message };
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

// Copy a community sketch template to user's projects
export const copyTemplateSketch = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      sketchId: z.string(),
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

      // Fetch the template sketch (no auth needed - it's public)
      const { data: template, error: fetchError } = await supabase
        .from('community_sketches')
        .select('*')
        .eq('id', data.sketchId)
        .single();

      if (fetchError || !template) {
        throw new Error('Template sketch not found');
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

      // Create a new project from the template
      const projectName = `${template.name} (Copy)`;
      const { data: project, error: insertError } = await authClient
        .from('cake_projects')
        .insert({
          user_id: user.user.id,
          name: projectName,
          tiers: template.tiers,
          decorations: template.decorations,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return { success: true, project };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// Publish one of the current user's saved projects as a shared community sketch
export const publishProjectAsTemplate = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      projectId: z.string(),
      slug: z.string().min(1),
      name: z.string().min(1),
      description: z.string().optional(),
      cakeImageUrl: z.string().optional(),
      sketchImageUrl: z.string().optional(),
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

      const { data: project, error: projectError } = await authClient
        .from('cake_projects')
        .select('id, name, tiers, decorations')
        .eq('id', data.projectId)
        .eq('user_id', user.user.id)
        .single();

      if (projectError || !project) {
        throw new Error('Project not found');
      }

      const { data: template, error: insertError } = await authClient
        .from('community_sketches')
        .insert({
          slug: data.slug,
          name: data.name,
          description: data.description ?? null,
          tiers: project.tiers,
          decorations: project.decorations,
          cake_image_url: data.cakeImageUrl ?? null,
          sketch_image_url: data.sketchImageUrl ?? null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return { success: true, template };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
