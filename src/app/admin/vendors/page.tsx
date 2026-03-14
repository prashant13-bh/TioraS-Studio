import { getAdminFirestore } from '@/lib/firebase-admin';
import { verifySession } from '@/app/actions/auth-actions';
import { redirect } from 'next/navigation';
import { VendorProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Timestamp } from 'firebase-admin/firestore';
import { format } from 'date-fns';
import { User, Store, Mail, Phone, Factory, AlertCircle } from 'lucide-react';
import VendorStatusActions from './vendor-status-actions'; // We'll create a client component for buttons

export const dynamic = 'force-dynamic';

export default async function AdminVendorsPage() {
  const session = await verifySession();
  
  if (!session || !session.isAdmin) {
    redirect('/login');
  }

  const db = getAdminFirestore();
  let vendors: VendorProfile[] = [];

  try {
    const vendorsSnapshot = await db.collection('vendors').orderBy('createdAt', 'desc').get();
    vendors = vendorsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: (data.createdAt as Timestamp)?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: (data.updatedAt as Timestamp)?.toDate?.()?.toISOString() || data.updatedAt,
      } as VendorProfile;
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
  }

  const getStatusVariant = (status: string) => {
      switch (status) {
          case 'Active': return 'default';
          case 'Suspended': return 'destructive';
          case 'Pending': return 'secondary';
          default: return 'outline';
      }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Vendor Management</h1>
        <p className="text-muted-foreground mt-1">Review seller applications and manage active vendors.</p>
      </div>

      {vendors.length === 0 ? (
          <Card className="flex flex-col items-center justify-center h-64 border-dashed">
            <Store className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No vendor applications yet</p>
          </Card>
      ) : (
        <Card>
            <CardHeader>
               <CardTitle>All Vendors</CardTitle>
               <CardDescription>A complete list of print shops and tailors on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Store Name</TableHead>
                     <TableHead>Contact</TableHead>
                     <TableHead>Capabilities</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Joined</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                    {vendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                            <TableCell>
                                <div className="font-medium">{vendor.storeName}</div>
                                <div className="text-xs text-muted-foreground">@{vendor.storeSlug}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {vendor.contactEmail}</div>
                                    <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {vendor.contactPhone}</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-1 flex-wrap max-w-[150px]">
                                    {vendor.capabilities.dtfPrinting && <Badge variant="outline" className="text-[10px]">DTF</Badge>}
                                    {vendor.capabilities.embroidery && <Badge variant="outline" className="text-[10px]">Embroidery</Badge>}
                                    {vendor.capabilities.cutAndSew && <Badge variant="outline" className="text-[10px]">Cut/Sew</Badge>}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(vendor.status)}>{vendor.status}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {format(new Date(vendor.createdAt), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                                <VendorStatusActions vendorId={vendor.id} currentStatus={vendor.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                 </TableBody>
               </Table>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
