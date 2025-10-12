"use client";

import InvoiceList from "@/components/InvoiceList";
import Container from "@/components/Container";
import Menu from "@/components/Menu";
import AdminRouteGuard from "@/components/AdminRouteGuard";

const InvoicePage = () => {
  return (
    <div>
      <Menu />
      <Container>
        <AdminRouteGuard>
          <InvoiceList />
        </AdminRouteGuard>
      </Container>
    </div>
  );
};

export default InvoicePage;