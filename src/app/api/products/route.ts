import { NextResponse } from "next/server";
//import { productData } from "@/constants/data";

// export const GET = async () => {
//   try {
//     return NextResponse.json({
//       message: "Products fetched successfully",
//       success: true,
//       productData,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         error: "Product loading error",
//       },
//       { status: 500 }
//     );
//   }
// };

export const GET = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/product2222");
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const productData = await response.json();

    return NextResponse.json({
      message: "Products fetched successfully",
      success: true,
      productData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Product loading error: " + error,
      },
      { status: 500 }
    );
  }
};

