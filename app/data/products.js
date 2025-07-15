const products = [
  {
    id: 1,
    name: "Apple",
    productImage: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1518390870587-a9d1c8ee4260?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    category: {
      id: 1,
      name: "Food",
      categoryImage:
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Fruits",
    price: 1,
    stocks: 100,
    reviews: 4.2,
    description: "Fresh and juicy apples.",
    availability: "In Stock",
    tags: ["Organic", "Fresh", "Healthy"],
  },
  {
    id: 2,
    name: "Orange Juice",
    productImage: [
      {
        id: 1,
        url: "https://plus.unsplash.com/premium_photo-1675667390417-d9d23160f4a6?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    category: {
      id: 2,
      name: "Beverages",
      categoryImage:
        "https://images.unsplash.com/photo-1589948100953-963e39185fd6?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Juices",
    price: 3,
    stocks: 50,
    reviews: 4,
    description: "Freshly squeezed orange juice.",
    availability: "In Stock",
    tags: ["Natural", "No Sugar Added", "Fresh"],
  },
  {
    id: 3,
    name: "Headphones",
    productImage: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 2,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 5,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 6,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
    ],
    category: {
      id: 3,
      name: "Accessories",
      categoryImage:
        "https://plus.unsplash.com/premium_photo-1664872566404-493056e98f16?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Electronics",
    price: 25,
    stocks: 20,
    reviews: 3.5,
    description: "Noise-cancelling over-ear headphones ndjjv jfvenvenv vnovenvkjfevno  fivndfvn.",
    availability: "Low Stock",
    tags: ["Wireless", "Noise Cancelling", "Premium"],
  },
  {
    id: 4,
    name: "T-Shirt",
    productImage: [
      {
        id: 1,
        url: "https://plus.unsplash.com/premium_photo-1673356302067-aac3b545a362?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    category: {
      id: 4,
      name: "Clothing",
      categoryImage:
        "https://plus.unsplash.com/premium_photo-1675057972702-e48f4adb295b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Casual Wear",
    price: 15,
    stocks: 200,
    reviews: 3.2,
    description: "Comfortable cotton t-shirt.",
    availability: "In Stock",
    tags: ["Cotton", "Casual", "Comfortable"],
  },
  {
    id: 5,
    name: "Book",
    productImage: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1621948415135-15a2be5f5669?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    category: {
      id: 5,
      name: "Books",
      categoryImage:
        "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Fiction",
    price: 10,
    stocks: 75,
    reviews: 4.9,
    description: "Bestselling novel by a renowned author.",
    availability: "In Stock",
    tags: ["Bestseller", "Fiction", "Paperback"],
  },
  {
    id: 6,
    name: "Necklace",
    productImage: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    category: {
      id: 3,
      name: "Accessories",
      categoryImage:
        "https://plus.unsplash.com/premium_photo-1664872566404-493056e98f16?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Jewelery",
    price: 2000,
    stocks: 10,
    reviews: 3.5,
    description: "Beautiful and Asthetic.",
    availability: "Low Stock",
    tags: ["Gold Necklace", "Premium"],
  },
  {
    id: 7,
    name: "Watch",
    productImage: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    category: {
      id: 3,
      name: "Accessories",
      categoryImage:
        "https://plus.unsplash.com/premium_photo-1664872566404-493056e98f16?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Electronics",
    price: 1500,
    stocks: 5,
    reviews: 3.5,
    description:
      "A classic men's wristwatch with a sleek stainless steel case, a black leather strap, a silver dial with luminous hour markers, and three hands.",
    availability: "Low Stock",
    tags: ["Omega Watch", "WristWatch", "Digital Watch", "Diving Watch"],
  },
  {
    id: 8,
    name: "Headphones",
    productImage: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 2,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 5,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 6,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
    ],
    category: {
      id: 3,
      name: "Accessories",
      categoryImage:
        "https://plus.unsplash.com/premium_photo-1664872566404-493056e98f16?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Electronics",
    price: 25,
    stocks: 20,
    reviews: 3.5,
    description: "Noise-cancelling over-ear headphones ndjjv jfvenvenv vnovenvkjfevno  fivndfvn.",
    availability: "Low Stock",
    tags: ["Wireless", "Noise Cancelling", "Premium"],
  },
  {
    id: 9,
    name: "Headphones",
    productImage: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 2,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 5,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 6,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
    ],
    category: {
      id: 3,
      name: "Accessories",
      categoryImage:
        "https://plus.unsplash.com/premium_photo-1664872566404-493056e98f16?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Electronics",
    price: 25,
    stocks: 20,
    reviews: 3.5,
    description: "Noise-cancelling over-ear headphones ndjjv jfvenvenv vnovenvkjfevno  fivndfvn.",
    availability: "Low Stock",
    tags: ["Wireless", "Noise Cancelling", "Premium"],
  },
  {
    id: 10,
    name: "Headphones",
    productImage: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 2,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 5,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 6,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
    ],
    category: {
      id: 3,
      name: "Accessories",
      categoryImage:
        "https://plus.unsplash.com/premium_photo-1664872566404-493056e98f16?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Electronics",
    price: 25,
    stocks: 20,
    reviews: 3.5,
    description: "Noise-cancelling over-ear headphones ndjjv jfvenvenv vnovenvkjfevno  fivndfvn.",
    availability: "Low Stock",
    tags: ["Wireless", "Noise Cancelling", "Premium"],
  },
  {
    id: 11,
    name: "Headphones",
    productImage: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 2,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 5,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 6,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
    ],
    category: {
      id: 3,
      name: "Accessories",
      categoryImage:
        "https://plus.unsplash.com/premium_photo-1664872566404-493056e98f16?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Electronics",
    price: 25,
    stocks: 20,
    reviews: 3.5,
    description: "Noise-cancelling over-ear headphones ndjjv jfvenvenv vnovenvkjfevno  fivndfvn.",
    availability: "Low Stock",
    tags: ["Wireless", "Noise Cancelling", "Premium"],
  },
  {
    id: 12,
    name: "Headphones",
    productImage: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 2,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 5,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        id: 6,
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
    ],
    category: {
      id: 3,
      name: "Accessories",
      categoryImage:
        "https://plus.unsplash.com/premium_photo-1664872566404-493056e98f16?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Electronics",
    price: 25,
    stocks: 20,
    reviews: 3.5,
    description: "Noise-cancelling over-ear headphones ndjjv jfvenvenv vnovenvkjfevno  fivndfvn.",
    availability: "Low Stock",
    tags: ["Wireless", "Noise Cancelling", "Premium"],
  },
  {
    id: 13,
    name: "Watch",
    productImage: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    category: {
      id: 3,
      name: "Accessories",
      categoryImage:
        "https://plus.unsplash.com/premium_photo-1664872566404-493056e98f16?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Electronics",
    price: 1500,
    stocks: 5,
    reviews: 3.5,
    description:
      "A classic men's wristwatch with a sleek stainless steel case, a black leather strap, a silver dial with luminous hour markers, and three hands.",
    availability: "Low Stock",
    tags: ["Omega Watch", "WristWatch", "Digital Watch", "Diving Watch"],
  },
  {
    id: 14,
    name: "Watch",
    productImage: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    category: {
      id: 3,
      name: "Accessories",
      categoryImage:
        "https://plus.unsplash.com/premium_photo-1664872566404-493056e98f16?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    subcategory: "Electronics",
    price: 1500,
    stocks: 5,
    reviews: 3.5,
    description:
      "A classic men's wristwatch with a sleek stainless steel case, a black leather strap, a silver dial with luminous hour markers, and three hands.",
    availability: "Low Stock",
    tags: ["Omega Watch", "WristWatch", "Digital Watch", "Diving Watch"],
  },
];

export default products;
