import { store } from "@/store";
import { FirestoreCollections } from "@/store/modules/firebase";
import { format } from "date-fns";

/**
 * This function will be use to build categories collection.
 * This wont be used very likely, because each entry of transaction updates
 * the category collection.
 */
export async function indexCategoriesCollection() {
  const firestore = store.state.firebase.firestore;
  if (!firestore) return;

  const collRef = await firestore
    .collection(FirestoreCollections.TRANSACTIONS)
    .get();

  collRef.docs.map(async doc => {
    const category = doc.get("merchant.category");
    await firestore
      .collection(FirestoreCollections.CATEGORIES)
      .doc(category.key)
      .set({ ...category }, { merge: true });
  });
}

export function centsToRands(cents: number) {
  const rands = cents / 100;
  return rands.toLocaleString("en-ZA", {
    style: "currency",
    currency: "ZAR"
  });
}

export function formatDate(val: string, formatType: string) {
  return format(new Date(val), formatType);
}
