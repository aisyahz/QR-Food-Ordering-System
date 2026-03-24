import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

const SAMPLE_MENU = [
  {
    name: "Nasi Lemak Ayam Berempah",
    description: "Fragrant coconut rice served with spiced fried chicken, sambal, anchovies, peanuts, and hard-boiled egg.",
    price: 15.90,
    imageUrl: "https://picsum.photos/seed/nasilemak/400/300",
    category: "Main Dish",
    available: true
  },
  {
    name: "Char Kway Teow",
    description: "Stir-fried flat rice noodles with prawns, cockles, bean sprouts, and chives in a savory sauce.",
    price: 12.50,
    imageUrl: "https://picsum.photos/seed/charkwayteow/400/300",
    category: "Main Dish",
    available: true
  },
  {
    name: "Satay Ayam (6 pcs)",
    description: "Grilled chicken skewers served with peanut sauce, cucumber, and onion.",
    price: 10.00,
    imageUrl: "https://picsum.photos/seed/satay/400/300",
    category: "Main Dish",
    available: true
  },
  {
    name: "Teh Tarik",
    description: "Traditional Malaysian pulled milk tea, perfectly frothy and sweet.",
    price: 3.50,
    imageUrl: "https://picsum.photos/seed/tehtarik/400/300",
    category: "Drinks",
    available: true
  },
  {
    name: "Iced Milo Dinosaur",
    description: "Chilled Milo topped with a generous amount of Milo powder.",
    price: 5.50,
    imageUrl: "https://picsum.photos/seed/milo/400/300",
    category: "Drinks",
    available: true
  },
  {
    name: "Fresh Watermelon Juice",
    description: "100% fresh watermelon juice, no added sugar.",
    price: 7.00,
    imageUrl: "https://picsum.photos/seed/watermelon/400/300",
    category: "Drinks",
    available: true
  },
  {
    name: "Cendol",
    description: "Shaved ice dessert with green rice flour jelly, coconut milk, and palm sugar syrup.",
    price: 6.50,
    imageUrl: "https://picsum.photos/seed/cendol/400/300",
    category: "Dessert",
    available: true
  },
  {
    name: "Sago Gula Melaka",
    description: "Sago pearls pudding served with coconut milk and palm sugar syrup.",
    price: 5.00,
    imageUrl: "https://picsum.photos/seed/sago/400/300",
    category: "Dessert",
    available: true
  }
];

export async function seedMenu() {
  const menuRef = collection(db, 'menu_items');
  try {
    const snapshot = await getDocs(menuRef);
    
    if (snapshot.empty) {
      console.log("Seeding menu data...");
      for (const item of SAMPLE_MENU) {
        await addDoc(menuRef, item);
      }
      console.log("Menu seeded successfully!");
    } else {
      console.log("Menu already contains items, skipping seed.");
    }
  } catch (error: any) {
    // Check for permission denied error
    if (error?.code === 'permission-denied' || error?.message?.includes('permissions')) {
      console.log("Skipping seed due to insufficient permissions (normal for customers).");
      return;
    }
    handleFirestoreError(error, OperationType.GET, 'menu_items');
  }
}
