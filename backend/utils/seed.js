// Seed script — populates the database with demo users and properties
// Run with: npm run seed
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Inquiry from "../models/Inquiry.js";
import Favorite from "../models/Favorite.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany(),
    Property.deleteMany(),
    Inquiry.deleteMany(),
    Favorite.deleteMany(),
  ]);

  console.log("Creating demo users...");
  const admin = await User.create({
    name: "Admin User",
    email: "admin@demo.com",
    password: "Admin@123",
    role: "admin",
  });

  const agent = await User.create({
    name: "Ahmed Raza",
    email: "agent@demo.com",
    password: "Agent@123",
    role: "agent",
    agencyName: "Raza Estates",
    phone: "+92 300 1234567",
  });

  const agent2 = await User.create({
    name: "Sana Malik",
    email: "sana.agent@demo.com",
    password: "Agent@123",
    role: "agent",
    agencyName: "Malik Properties",
    phone: "+92 300 7654321",
  });

  const buyer = await User.create({
    name: "Bilal Khan",
    email: "buyer@demo.com",
    password: "Buyer@123",
    role: "buyer",
    phone: "+92 300 9998888",
  });

  console.log("Creating demo properties...");
  const propertiesData = [
    {
      title: "Modern Villa in DHA Phase 6",
      description:
        "A stunning modern villa featuring open-plan living, floor-to-ceiling windows, a private pool, and landscaped gardens. Perfect for families seeking luxury and comfort in one of the city's most sought-after neighborhoods.",
      listingType: "sell",
      propertyType: "villa",
      price: 45000000,
      priceUnit: "total",
      address: "Street 12, DHA Phase 6",
      city: "Lahore",
      area: 3200,
      bedrooms: 5,
      bathrooms: 4,
      amenities: ["Swimming Pool", "Garden", "Parking", "Security", "Gym"],
      images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
        "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800",
      ],
      location: { lat: 31.4697, lng: 74.4142 },
      agent: agent._id,
      status: "approved",
      featured: true,
    },
    {
      title: "Cozy Apartment near Gulberg",
      description:
        "A beautifully maintained 2-bedroom apartment ideal for small families or working professionals. Close to markets, schools, and major roads with easy access to the whole city.",
      listingType: "rent",
      propertyType: "apartment",
      price: 65000,
      priceUnit: "monthly",
      address: "Main Boulevard, Gulberg",
      city: "Lahore",
      area: 1200,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["Parking", "Elevator", "Security"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      ],
      location: { lat: 31.5099, lng: 74.3574 },
      agent: agent._id,
      status: "approved",
    },
    {
      title: "Luxury Farmhouse with Pool",
      description:
        "Escape the city in this exquisite farmhouse featuring sprawling lawns, a private pool, and a serene atmosphere — perfect for weekend getaways or full-time luxury living.",
      listingType: "sell",
      propertyType: "house",
      price: 120000000,
      priceUnit: "total",
      address: "Bedian Road",
      city: "Lahore",
      area: 8000,
      bedrooms: 6,
      bathrooms: 5,
      amenities: ["Swimming Pool", "Garden", "Servant Quarters", "Parking"],
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      ],
      location: { lat: 31.4295, lng: 74.4649 },
      agent: agent2._id,
      status: "approved",
      featured: true,
    },
    {
      title: "Commercial Plaza Space - Prime Location",
      description:
        "Excellent commercial space on a busy main road, ideal for retail outlets, offices, or restaurants. High foot traffic and excellent visibility.",
      listingType: "rent",
      propertyType: "commercial",
      price: 150000,
      priceUnit: "monthly",
      address: "MM Alam Road",
      city: "Lahore",
      area: 2000,
      bedrooms: 0,
      bathrooms: 2,
      amenities: ["Parking", "Elevator", "Generator Backup"],
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800",
      ],
      location: { lat: 31.5, lng: 74.35 },
      agent: agent2._id,
      status: "approved",
    },
    {
      title: "Budget-Friendly Family Home",
      description:
        "A comfortable single-story home perfect for a small family. Quiet neighborhood, close to schools and parks, with a well-maintained lawn.",
      listingType: "sell",
      propertyType: "house",
      price: 18500000,
      priceUnit: "total",
      address: "Johar Town",
      city: "Lahore",
      area: 1800,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ["Garden", "Parking"],
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
      ],
      location: { lat: 31.4697, lng: 74.2728 },
      agent: agent._id,
      status: "approved",
    },
    {
      title: "Beachside Resort Villa (Pending Review)",
      description:
        "A dreamy resort-style villa with private pool access and stunning views, currently awaiting admin approval.",
      listingType: "rent",
      propertyType: "resort",
      price: 90000,
      priceUnit: "monthly",
      address: "Clifton Block 5",
      city: "Karachi",
      area: 2600,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ["Swimming Pool", "Sea View", "Security"],
      images: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      ],
      location: { lat: 24.8138, lng: 67.0299 },
      agent: agent2._id,
      status: "pending",
    },
  ];

  const properties = await Property.insertMany(propertiesData);

  console.log("Creating demo inquiry...");
  await Inquiry.create({
    property: properties[0]._id,
    buyer: buyer._id,
    agent: agent._id,
    name: buyer.name,
    email: buyer.email,
    phone: buyer.phone,
    message: "Hi, I'm interested in scheduling a viewing for this villa. Is it still available?",
  });

  console.log("Creating demo favorite...");
  await Favorite.create({ user: buyer._id, property: properties[0]._id });

  console.log("\n✅ Seed complete!\n");
  console.log("Demo Login Credentials:");
  console.log("  Admin -> admin@demo.com / Admin@123");
  console.log("  Agent -> agent@demo.com / Agent@123");
  console.log("  Buyer -> buyer@demo.com / Buyer@123");

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
