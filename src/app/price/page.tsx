"use client";
import React, { useState } from "react";
import PriceList from "@/components/PriceList";
import Banner from "@/components/Banner";
import Header from "@/components/Header"; 
import OrderDetails from "@/components/OrderDetails";
import Container from "@/components/Container";

const PricePage = () => {
  return (
    <div>
      <Container>
        <PriceList searchTerm={""} />
      </Container>
    </div>

   
  );
};


export default PricePage;
