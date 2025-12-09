import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { getMockDashboardData } from '@/lib/mock-data';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'My Dashboard | TioraS',
  description: 'Manage your designs and view your order history.',
};

export default function DashboardPage() {
    const { savedDesigns, orderHistory } = getMockDashboardData();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Shipped':
        return 'default';
      case 'Delivered':
        return 'outline';
      case 'Pending':
      default:
        return 'destructive';
    }
  };


  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="font-headline text-4xl font-bold tracking-tighter">
              My Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
                Welcome back! Here are your designs and recent orders.
            </p>
          </header>
          
          <Tabs defaultValue="designs">
            <TabsList>
              <TabsTrigger value="designs">Saved Designs</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
            </TabsList>
            <TabsContent value="designs">
              <Card>
                <CardHeader>
                  <CardTitle>My Saved Designs</CardTitle>
                  <CardDescription>A gallery of your AI-generated creations.</CardDescription>
                </CardHeader>
                <CardContent>
                   {savedDesigns.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {savedDesigns.map((design) => (
                            <Card key={design.id} className="group relative">
                                <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
                                <Image src={design.imageUrl} alt={design.name} fill className="object-cover"/>
                                </div>
                                <div className="p-4">
                                <h3 className="font-semibold truncate">{design.name}</h3>
                                <p className="text-sm text-muted-foreground">{design.product}</p>
                                </div>
                            </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">You haven&apos;t saved any designs yet.</p>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="orders">
              <Card>
                 <CardHeader>
                  <CardTitle>My Order History</CardTitle>
                  <CardDescription>A list of all your past orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    {orderHistory.length > 0 ? (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Order #</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderHistory.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>
                                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                         <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}
