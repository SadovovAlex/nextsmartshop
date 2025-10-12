"use client";

import InvoiceList from "@/components/InvoiceList";
import Container from "@/components/Container";
import Menu from "@/components/Menu";

const InvoicePage = () => {
  return (
    <div>
      <Menu />
      <Container>
        <InvoiceList />
      </Container>
    </div>
  );
};

export default InvoicePage;