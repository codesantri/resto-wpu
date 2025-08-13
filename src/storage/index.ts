'use server';

import { environment } from "@/config/environment";
import { createClient } from "@/lib/supabase/server";

export default async function Storage() {
  const upload = async (bucket: string,path: string,file: File, prevPath?: string) => {
    const supabase = await createClient();
    const newPath = `${path}/${Date.now()}-${file.name}`;

    // Hapus file lama jika prevPath ada
    if (prevPath) {
      const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove([prevPath]);
      if (removeError) {
        return {
          status: "error",
          errors: {
            _form: [removeError.message],
          },
        };
      }
    }

    // Upload file baru
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(newPath, file);
    if (uploadError) {
      return {
        status: "error",
        errors: {
          _form: [uploadError.message],
        },
      };
    }

    return {
      status: "success",
      data: {
        url: `${environment.SUPABASE_URL}/storage/v1/object/public/${bucket}/${newPath}`,
        path: newPath,
      },
    };
  };

  const remove = async (bucket: string, path: string) => {
    const supabase = await createClient();

    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      return {
        status: "error",
        errors: {
          _form: [error.message],
        },
      };
    }

    return {
      status: "success",
    };
  };

  return { upload, remove };
}
