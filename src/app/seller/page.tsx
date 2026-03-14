import { getAdminFirestore } from '@/lib/firebase-admin';
import { verifySession } from '@/app/actions/auth-actions';
import { VendorProfile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { IndianRupee, Package, TrendingUp, Scissors } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SellerDashboardPage() {
  const session = await verifySession();
  if (!session) return null; // handled by layout

  const db = getAdminFirestore();
  let vendorData: VendorProfile | null = null;
  let recentOrdersCount = 0;
  let syogRequestsCount = 0;

  try {
     const doc = await db.collection('vendors').doc(session.uid).get();
     if (doc.exists) {
         vendorData = doc.data() as VendorProfile;
     }

     // In a real app, you'd fetch actual order docs assigned to this vendorId.
     // For now, we simulate assigned orders based on metrics or just mock them zeroed.
     // This sets the stage for Kanban implementation.
  } catch (err) {
      console.error("Failed to load seller dashboard", err);
  }

  if (!vendorData) return <div>Vendor profile not found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome back, {vendorData.storeName}</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your Hyperlocal orders today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lifetime Sales</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">₹{(vendorData.metrics?.totalSales || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Print Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{recentOrdersCount}</div>
            <p className="text-xs text-muted-foreground">Pending fulfillment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending SYOG</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{syogRequestsCount}</div>
            <p className="text-xs text-muted-foreground">Garments en-route</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seller Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{vendorData.metrics?.rating || 'New'}</div>
            <p className="text-xs text-muted-foreground">Based on {vendorData.metrics?.reviewCount || 0} reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
              <CardHeader>
                  <CardTitle>Recent Action Items</CardTitle>
                  <CardDescription>You have no pending orders requiring immediate attention.</CardDescription>
              </CardHeader>
              <CardContent className="h-48 flex items-center justify-center text-muted-foreground border-dashed border-2 m-4 rounded-lg">
                  Order queue is clear
              </CardContent>
          </Card>
          <Card className="col-span-1">
              <CardHeader>
                  <CardTitle>Hardware Status</CardTitle>
                  <CardDescription>Your registered capability matrix matching engine.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {vendorData.capabilities.dtfPrinting && (
                          <div className="flex items-center justify-between">
                              <span className="font-medium">DTF Printers</span>
                              <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-xs">ONLINE</span>
                          </div>
                      )}
                      {vendorData.capabilities.embroidery && (
                          <div className="flex items-center justify-between">
                              <span className="font-medium">Embroidery Machines</span>
                              <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-xs">ONLINE</span>
                          </div>
                      )}
                      {vendorData.capabilities.cutAndSew && (
                          <div className="flex items-center justify-between">
                              <span className="font-medium">Cut & Sew / SYOG</span>
                              <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-xs">ONLINE</span>
                          </div>
                      )}
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
