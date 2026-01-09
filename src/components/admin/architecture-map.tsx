"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function ArchitectureMap() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true, 
      theme: 'dark',
      securityLevel: 'loose',
    });
    mermaid.contentLoaded();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const newScale = delta > 0 ? scale * 1.1 : scale / 1.1;
    setScale(Math.min(Math.max(0.1, newScale), 5));
  };

  const graphDefinition = `
    graph TD
    
    %% Styles
    classDef public fill:#1a1a1a,stroke:#4a4a4a,stroke-width:2px,color:#fff;
    classDef customer fill:#0d2b4a,stroke:#1e5b9e,stroke-width:2px,color:#fff;
    classDef admin fill:#2b1a1a,stroke:#9e1e1e,stroke-width:2px,color:#fff;
    classDef ai fill:#1a2b2b,stroke:#1e9e9e,stroke-width:2px,color:#fff;

    subgraph Public ["🛍️ Public Storefront"]
        direction TB
        Home("🏠 Home / Catalog<br/>[Filter: Vibe/Size/Color]<br/>[Search]<br/>[Sort]<br/>[Vibe Switcher]"):::public
        ProdDetail("👕 Product Details<br/>[Select Size/Color]<br/>[Add to Cart]<br/>[Add to Wishlist]<br/>[Reviews]"):::public
        Cart("🛒 Cart<br/>[Update Qty]<br/>[Remove Item]<br/>[Checkout Btn]<br/>[Apply Coupon]"):::public
        Checkout("💳 Checkout<br/>[Address Form]<br/>[Payment]<br/>[Place Order]<br/>[Order Summary]"):::public
        Auth("🔐 Auth<br/>[Login]<br/>[Register]<br/>[Google Sign-In]<br/>[Forgot Password]"):::public
    end

    subgraph Customer ["👤 Customer Area"]
        direction TB
        Profile("👤 Profile<br/>[Edit Info]<br/>[View Stats]<br/>[Change Password]"):::customer
        Orders("📦 My Orders<br/>[Filter Status]<br/>[Track Order]<br/>[Reorder]"):::customer
        OrderDetail("📄 Order Details<br/>[View Items]<br/>[Download Invoice]<br/>[Return Item]"):::customer
        Wishlist("❤️ Wishlist<br/>[Move to Cart]<br/>[Remove]<br/>[Share]"):::customer
        Addresses("📍 Addresses<br/>[Add New]<br/>[Edit/Delete]<br/>[Set Default]"):::customer
    end

    subgraph AIStudio ["✨ AI Design Studio"]
        direction TB
        Canvas("🎨 Design Canvas<br/>[Text-to-Image]<br/>[Tools: Brush/Eraser]<br/>[Layers]<br/>[Undo/Redo]"):::ai
        Gallery("🖼️ Gallery<br/>[Save Design]<br/>[Share]<br/>[Apply to Product]<br/>[Delete]"):::ai
    end

    subgraph Admin ["🛡️ Admin Dashboard"]
        direction TB
        Dashboard("📊 Dashboard<br/>[Sales Chart]<br/>[Low Stock Alert]<br/>[Recent Orders]<br/>[Export Report]"):::admin
        
        subgraph AdminProducts ["Products & Inventory"]
            ProdList("📋 Product List<br/>[Search/Filter]<br/>[Edit/Delete]<br/>[Export CSV]<br/>[Bulk Actions]"):::admin
            ProdCreate("➕ Add/Edit Product<br/>[Upload Images/Video]<br/>[Set Vibe/SKU]<br/>[Manage Stock]<br/>[Variants]"):::admin
            Inventory("📦 Inventory<br/>[Stock In/Out]<br/>[Barcode Scan]<br/>[Low Stock Filter]<br/>[History]"):::admin
        end

        subgraph AdminSales ["Sales & Users"]
            OrderList("📦 Order List<br/>[Update Status]<br/>[Filter Date/Status]<br/>[Export]"):::admin
            AdminOrderDetail("📄 Order Details<br/>[Print Invoice]<br/>[Customer Info]<br/>[Refund/Cancel]"):::admin
            CustomerList("👥 Customers<br/>[View History]<br/>[Block User]<br/>[Email User]"):::admin
            Invoices("🧾 Invoices<br/>[Generate PDF]<br/>[Filter Date]"):::admin
        end

        subgraph AdminTools ["Tools"]
            Calendar("📅 Calendar<br/>[Add Event]<br/>[View Month/Week]"):::admin
            Settings("⚙️ Settings<br/>[Store Config]<br/>[Payment Methods]<br/>[Shipping Rates]"):::admin
            Seed("🌱 Seed Data<br/>[Reset DB]<br/>[Populate Mock Data]"):::admin
            Sitemap("🗺️ Sitemap<br/>[Interactive Map]<br/>[Full View]"):::admin
        end
    end

    %% Connections
    Home -->|Click Product| ProdDetail
    ProdDetail -->|Add| Cart
    Cart -->|Proceed| Checkout
    Checkout -->|Success| Orders
    
    Home -->|Nav| Auth
    Auth -->|Success| Profile
    
    Profile --> Orders
    Orders --> OrderDetail
    Profile --> Wishlist
    Profile --> Addresses
    
    Home -->|Nav| Canvas
    Canvas -->|Save| Gallery
    
    Auth -->|Admin Login| Dashboard
    
    Dashboard --> ProdList
    ProdList -->|Add New| ProdCreate
    ProdList -->|Edit| ProdCreate
    Dashboard --> Inventory
    
    Dashboard --> OrderList
    OrderList --> AdminOrderDetail
    Dashboard --> CustomerList
    Dashboard --> Invoices
    
    Dashboard --> Calendar
    Dashboard --> Settings
    Dashboard --> Seed
    Dashboard --> Sitemap
  `;

  return (
    <div className="relative w-full h-[calc(100vh-100px)] overflow-hidden bg-[#0f0f0f] rounded-lg border border-gray-800">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm border border-white/10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setScale(s => Math.min(s * 1.2, 5))}
          className="text-white hover:bg-white/10"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setScale(s => Math.max(s / 1.2, 0.1))}
          className="text-white hover:bg-white/10"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
          className="text-white hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Canvas */}
      <div 
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div 
          className="mermaid transition-transform duration-75 ease-out origin-center"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` 
          }}
        >
          {graphDefinition}
        </div>
      </div>
    </div>
  );
}
