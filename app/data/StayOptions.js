import { FontAwesome } from '@expo/vector-icons';

export const stayOptions = [
  { id: 1, title: "Hotel", icon: () => <FontAwesome name="hotel" size={24} />, color: "#8B0000" },
  { id: 2, title: "Homestay", icon: () => <FontAwesome name="home" size={24} />, color: "#FFD700" },
  { id: 3, title: "Lodge", icon: () => <FontAwesome name="building" size={24} />, color: "#006400" },
  { id: 4, title: "Resort", icon: () => <FontAwesome name="umbrella" size={24} />, color: "#1E90FF" },
  { id: 5, title: "Villa", icon: () => <FontAwesome name="building-o" size={24} />, color: "#191970" },
  { id: 6, title: "Camping Site", icon: () => <FontAwesome name="fire" size={24} />, color: "#8B0000" },
  { id: 7, title: "Mountain Cabin", icon: () => <FontAwesome name="tree" size={24} />, color: "#006400" },
  { id: 8, title: "Farm Stay", icon: () => <FontAwesome name="pagelines" size={24} />, color: "#FFD700" },
];

export const stays = [
  {
    id: 0,
    type: "Hotel",
    title: "Daju vai lodge",
    location: "Thangpal, Bhotang",
    contact: "9812345678",
    price: 3000,
    rating: 4.4,
    tags: ["luxury", "ranged prices", "balcony view"],
    description:
      "Daju Vai Lodge offers a blend of comfort and elegance with spacious rooms, scenic balcony views, and modern amenities. Perfect for travelers seeking a premium stay experience in Thangpal, Bhotang. Enjoy warm hospitality, freshly prepared local meals, and easy access to nearby attractions.",
    image: [
      { id: 1, url: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?auto=format&fit=crop&w=400&h=250&q=60" },
      { id: 2, url: "https://images.unsplash.com/photo-1653408400816-af6dba0c9432?auto=format&fit=crop&w=400&h=250&q=60" },
      { id: 3, url: "https://images.unsplash.com/photo-1653312727964-736f11663ef6?auto=format&fit=crop&w=400&h=250&q=80" },
      { id: 4, url: "https://images.unsplash.com/photo-1629447236132-22c57cd0f0bf?auto=format&fit=crop&w=400&h=250&q=60" },
    ],
  },
  {
    id: 1,
    type: "Villa",
    title: "Rambahadur ko bangla",
    location: "Bhotang, Thangpal",
    contact: "9812345678",
    price: 1499,
    rating: 3.0,
    tags: ["villa", "group stay", "luxury", "good view"],
    description:
      "Rambahadur ko Bangla is a spacious villa ideal for groups and families, offering a peaceful getaway with scenic surroundings. The property features traditional architecture, comfortable living spaces, and a panoramic view of the valley, making it a memorable stay for nature lovers.",
    image: [
      { id: 1, url: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?auto=format&fit=crop&w=400&h=250&q=60" },
      { id: 2, url: "https://images.unsplash.com/photo-1653408400816-af6dba0c9432?auto=format&fit=crop&w=400&h=250&q=60" },
      { id: 3, url: "https://images.unsplash.com/photo-1653312727964-736f11663ef6?auto=format&fit=crop&w=400&h=250&q=80" },
      { id: 4, url: "https://images.unsplash.com/photo-1629447236132-22c57cd0f0bf?auto=format&fit=crop&w=400&h=250&q=60" },
    ],
  },
  {
    id: 2,
    type: "Resort",
    title: "Homestay Near Tsegro ri",
    location: "Tsegro, Thangpal",
    contact: "9812345678",
    price: 1000,
    rating: 2.8,
    tags: ["homestay", "cheaper", "affordable"],
    description:
      "Located near the scenic Tsegro Ri, this homestay offers a budget-friendly option for travelers. Guests can enjoy simple yet comfortable rooms, local cuisine, and a welcoming family atmosphere. Ideal for trekkers and budget explorers seeking an authentic cultural experience.",
    image: [
      { id: 1, url: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?auto=format&fit=crop&w=400&h=250&q=60" },
      { id: 2, url: "https://images.unsplash.com/photo-1653408400816-af6dba0c9432?auto=format&fit=crop&w=400&h=250&q=60" },
      { id: 3, url: "https://images.unsplash.com/photo-1653312727964-736f11663ef6?auto=format&fit=crop&w=400&h=250&q=80" },
      { id: 4, url: "https://images.unsplash.com/photo-1629447236132-22c57cd0f0bf?auto=format&fit=crop&w=400&h=250&q=60" },
    ],
  },
  {
    id: 3,
    type: "Hotel",
    title: "Road Side Homestay",
    location: "Tsegro, Thangpal",
    contact: "9812345678",
    price: 1799,
    rating: 3.4,
    tags: ["highway accessible", "afforadable", "lower price"],
    description:
      "Road Side Homestay is conveniently located along the highway, offering easy access for travelers. The homestay features clean and cozy rooms at reasonable rates, making it perfect for short stays. Guests can enjoy quick stopovers with nearby eateries and shops.",
    image: [
      { id: 1, url: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?auto=format&fit=crop&w=400&h=250&q=60" },
      { id: 2, url: "https://images.unsplash.com/photo-1653408400816-af6dba0c9432?auto=format&fit=crop&w=400&h=250&q=60" },
      { id: 3, url: "https://images.unsplash.com/photo-1653312727964-736f11663ef6?auto=format&fit=crop&w=400&h=250&q=80" },
      { id: 4, url: "https://images.unsplash.com/photo-1629447236132-22c57cd0f0bf?auto=format&fit=crop&w=400&h=250&q=60" },
    ],
  },
  {
    id: 4,
    type: "Hotel",
    title: "Lake Side Homestay",
    location: "Tsegro, Thangpal",
    contact: "9812345678",
    price: 1799,
    rating: 4.4,
    tags: ["Parking", "lake side", "boating", "great view"],
    description:
      "Lake Side Homestay offers stunning views of the lake with opportunities for boating and outdoor relaxation. Guests can enjoy spacious rooms, friendly service, and secure parking. A perfect choice for couples and families seeking a peaceful retreat close to nature.",
    image: [
      { id: 1, url: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?auto=format&fit=crop&w=400&h=250&q=60" },
      { id: 2, url: "https://images.unsplash.com/photo-1653408400816-af6dba0c9432?auto=format&fit=crop&w=400&h=250&q=60" },
      { id: 3, url: "https://images.unsplash.com/photo-1653312727964-736f11663ef6?auto=format&fit=crop&w=400&h=250&q=80" },
      { id: 4, url: "https://images.unsplash.com/photo-1629447236132-22c57cd0f0bf?auto=format&fit=crop&w=400&h=250&q=60" },
    ],
  },
];
