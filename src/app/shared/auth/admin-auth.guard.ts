import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { from, map } from 'rxjs';

// Admin emails are not secrets but act as a simple allow-list for admin access.
const ADMIN_EMAILS = ['ianfoster27@gmail.com', 'julianshaw2000@gmail.com'];

export const adminAuthGuard: CanActivateFn = (): boolean | UrlTree | ReturnType<typeof from> => {
  const auth = inject(SupabaseAuthService);
  const router = inject(Router);

  return from(auth.getSession()).pipe(
    map((session) => {
      const email = session?.user?.email?.toLowerCase() ?? '';
      const isAdmin = ADMIN_EMAILS.includes(email);

      if (isAdmin) {
        return true;
      }

      // If not authenticated or not admin, send to admin login.
      return router.createUrlTree(['/admin/login']);
    })
  );
};


