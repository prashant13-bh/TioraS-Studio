
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Shield, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import type { UserProfile } from '@/lib/types';
import { grantAdminRole, revokeAdminRole } from '@/app/actions/admin-actions';

interface UserActionsProps {
  user: UserProfile;
  currentUserId?: string | null;
}

export function UserActions({ user, currentUserId }: UserActionsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (action: 'grant' | 'revoke') => {
    startTransition(async () => {
      const result = action === 'grant' 
        ? await grantAdminRole(user.id) 
        : await revokeAdminRole(user.id);
        
      if (result.success) {
        toast({
          title: 'Role Updated',
          description: result.message,
        });
      } else {
        toast({
          title: 'Update Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };
  
  // An admin cannot revoke their own role.
  const isSelf = user.id === currentUserId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Role Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.isAdmin ? (
          <DropdownMenuItem
            onClick={() => handleRoleChange('revoke')}
            disabled={isPending || isSelf}
          >
            <UserX className="mr-2 h-4 w-4" />
            Revoke Admin
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => handleRoleChange('grant')}
            disabled={isPending}
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Grant Admin
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
