
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { getAllUsers } from '@/app/actions/admin-actions';
import type { UserProfile } from '@/lib/types';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
  
export const metadata = {
    title: 'Users | TioraS Admin',
    description: 'Manage all registered users.',
};

export default async function AdminUsersPage() {
    const users: UserProfile[] = await getAllUsers();
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>A list of all registered users on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden sm:table-cell">Sign-up Date</TableHead>
                  <TableHead className="hidden md:table-cell">Provider</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className='hidden h-9 w-9 sm:flex'>
                          <AvatarImage src={user.photoURL || ''} alt={user.displayName || user.email || 'User'} />
                          <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">{user.displayName || 'Unnamed User'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {user.createdAt ? format(new Date(user.createdAt), 'MM/dd/yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {user.providerId && <Badge variant="outline">{user.providerId}</Badge>}
                    </TableCell>
                    <TableCell>
                      {/* Placeholder for future actions */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }
